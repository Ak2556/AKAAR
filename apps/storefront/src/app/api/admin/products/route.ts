import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  isAllowedPreviewImage,
  isAllowedPreviewModel,
  removeSavedAsset,
  saveProductAsset,
  slugifyProductName,
} from '@/lib/local-product-assets'

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const MAX_MODEL_SIZE_BYTES = 50 * 1024 * 1024

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null; error: unknown }

  if (profile?.role !== 'ADMIN') return null
  return user
}

// GET — list all products (admin, including inactive)
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*, mesh_files(*)')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: products ?? [] })
}

// POST — create product
export async function POST(request: Request) {
  const adminUser = await requireAdmin()
  if (!adminUser) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  const formData = await request.formData()
  const name             = String(formData.get('name') || '').trim()
  const providedSlug     = String(formData.get('slug') || '').trim()
  const category         = String(formData.get('category') || '').trim()
  const shortDescription = String(formData.get('shortDescription') || '').trim()
  const description      = String(formData.get('description') || '').trim()
  const rawPrice         = String(formData.get('price') || '').trim()
  const isActive         = formData.get('isActive') === 'true'
  const previewImage     = formData.get('previewImage')
  const modelFile        = formData.get('modelFile')

  if (!name) return NextResponse.json({ error: 'Product name is required' }, { status: 400 })

  const slug = slugifyProductName(providedSlug || name)
  if (!slug) return NextResponse.json({ error: 'A valid slug is required' }, { status: 400 })

  const price = Number(rawPrice)
  if (!Number.isFinite(price) || price <= 0)
    return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })

  if (!(modelFile instanceof File) || modelFile.size === 0)
    return NextResponse.json({ error: 'A GLB or GLTF model file is required' }, { status: 400 })
  if (!isAllowedPreviewModel(modelFile.name))
    return NextResponse.json({ error: 'Only .glb and .gltf files are supported' }, { status: 400 })
  if (modelFile.size > MAX_MODEL_SIZE_BYTES)
    return NextResponse.json({ error: '3D model file must be 50 MB or smaller' }, { status: 400 })

  if (previewImage instanceof File && previewImage.size > 0) {
    if (!isAllowedPreviewImage(previewImage.name))
      return NextResponse.json({ error: 'Preview image must be PNG, JPG, WEBP, or AVIF' }, { status: 400 })
    if (previewImage.size > MAX_IMAGE_SIZE_BYTES)
      return NextResponse.json({ error: 'Preview image must be 10 MB or smaller' }, { status: 400 })
  }

  // Check slug uniqueness
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  if (existing) return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 })

  const savedAssets: string[] = []

  try {
    const savedModel = await saveProductAsset({ file: modelFile, slug, kind: 'model' })
    savedAssets.push(savedModel.absolutePath)

    const savedImage =
      previewImage instanceof File && previewImage.size > 0
        ? await saveProductAsset({ file: previewImage, slug, kind: 'image' })
        : null
    if (savedImage) savedAssets.push(savedImage.absolutePath)

    const admin = createAdminClient()

    // Insert mesh file record
    const { data: meshFile, error: meshError } = await admin
      .from('mesh_files')
      .insert({
        original_filename: modelFile.name,
        stored_filename: savedModel.storedFilename,
        storage_path: savedModel.publicPath,
        file_type: modelFile.type || 'model/gltf-binary',
        file_size: modelFile.size,
        is_processed: true,
      })
      .select()
      .single()
    if (meshError) throw meshError

    const { data: product, error: productError } = await admin
      .from('products')
      .insert({
        name,
        slug,
        category: category || null,
        short_description: shortDescription || null,
        description: description || null,
        image_url: savedImage?.publicPath ?? null,
        price,
        is_active: isActive,
        mesh_file_id: meshFile.id,
      })
      .select('*, mesh_files(*)')
      .single()
    if (productError) throw productError

    await admin.from('audit_logs').insert({
      user_id: adminUser.id,
      action: 'ADMIN_PRODUCT_CREATE',
      entity_type: 'Product',
      metadata: { name, slug },
    })

    return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 })
  } catch (error) {
    await Promise.all(savedAssets.map((p) => removeSavedAsset(p)))
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

// PATCH — update product
export async function PATCH(request: Request) {
  const adminUser = await requireAdmin()
  if (!adminUser) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  const body = await request.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: 'Product id is required' }, { status: 400 })

  const admin = createAdminClient()
  const { data: product, error } = await admin
    .from('products')
    .update({
      name:              updates.name,
      slug:              updates.slug,
      description:       updates.description,
      short_description: updates.shortDescription,
      category:          updates.category,
      price:             updates.price,
      is_active:         updates.isActive,
      image_url:         updates.imageUrl,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product })
}

// DELETE — remove product
export async function DELETE(request: Request) {
  const adminUser = await requireAdmin()
  if (!adminUser) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Product id is required' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await admin.from('audit_logs').insert({
    user_id: adminUser.id,
    action: 'ADMIN_PRODUCT_DELETE',
    entity_type: 'Product',
    metadata: { id },
  })

  return NextResponse.json({ message: 'Product deleted' })
}
