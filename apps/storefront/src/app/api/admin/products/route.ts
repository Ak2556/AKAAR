import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
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

// POST — create product (accepts JSON with pre-uploaded URLs)
export async function POST(request: Request) {
  const adminUser = await requireAdmin()
  if (!adminUser) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  try {
    const body = await request.json()
    const {
      name,
      slug: providedSlug,
      category,
      shortDescription,
      description,
      price: rawPrice,
      isActive,
      imageUrl,
      modelUrl,
      modelFilename,
      modelSize,
    } = body

    if (!name?.trim()) return NextResponse.json({ error: 'Product name is required' }, { status: 400 })

    const slug = slugify(providedSlug || name)
    if (!slug) return NextResponse.json({ error: 'A valid slug is required' }, { status: 400 })

    const price = Number(rawPrice)
    if (!Number.isFinite(price) || price <= 0)
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 })

    const supabase = await createClient()
    const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle()
    if (existing) return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 })

    const admin = createAdminClient()

    // If a 3D model was uploaded, create mesh_file record
    let meshFileId: string | null = null
    if (modelUrl && modelFilename) {
      const { data: meshFile, error: meshError } = await admin
        .from('mesh_files')
        .insert({
          original_filename: modelFilename,
          stored_filename: modelFilename,
          storage_path: modelUrl,
          file_type: 'model/gltf-binary',
          file_size: modelSize ?? 0,
          is_processed: true,
        })
        .select()
        .single()
      if (meshError) throw meshError
      meshFileId = meshFile.id
    }

    const { data: product, error: productError } = await admin
      .from('products')
      .insert({
        name: name.trim(),
        slug,
        category: category?.trim() || null,
        short_description: shortDescription?.trim() || null,
        description: description?.trim() || null,
        image_url: imageUrl || null,
        price,
        is_active: isActive ?? true,
        mesh_file_id: meshFileId,
      })
      .select('*, mesh_files(*)')
      .single()

    if (productError) throw productError

    await admin.from('audit_logs').insert({
      user_id: adminUser.id,
      action: 'ADMIN_PRODUCT_CREATE',
      entity_type: 'Product',
      metadata: { name, slug },
    }).then(null, () => {})

    return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 })
  } catch (error) {
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
  }).then(null, () => {})

  return NextResponse.json({ message: 'Product deleted' })
}
