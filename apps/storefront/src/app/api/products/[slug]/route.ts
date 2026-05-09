import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Transform raw Supabase snake_case row → camelCase shape the product page expects
function mapProduct(p: Record<string, unknown>) {
  const mf = p.mesh_files as Record<string, unknown> | null
  return {
    id:               p.id,
    name:             p.name,
    slug:             p.slug,
    category:         p.category ?? null,
    price:            p.price,
    description:      p.description ?? null,
    shortDescription: p.short_description ?? null,
    imageUrl:         p.image_url ?? null,
    isActive:         p.is_active,
    sortOrder:        p.sort_order,
    meshFile: mf ? {
      id:               mf.id,
      storagePath:      mf.storage_path ?? null,
      s3Key:            mf.s3_key ?? null,
      originalFilename: mf.original_filename ?? 'model.glb',
      fileSize:         mf.file_size ?? null,
      fileType:         mf.file_type ?? null,
    } : null,
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: raw, error } = await supabase
      .from('products')
      .select('*, mesh_files(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !raw) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Related products — same category, exclude current
    const { data: relatedRaw } = await supabase
      .from('products')
      .select('*, mesh_files(*)')
      .eq('is_active', true)
      .eq('category', raw.category ?? '')
      .neq('id', raw.id)
      .limit(4)

    return NextResponse.json({
      product: mapProduct(raw as Record<string, unknown>),
      relatedProducts: (relatedRaw ?? []).map(r => mapProduct(r as Record<string, unknown>)),
      catalogAvailable: true,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Catalog unavailable', catalogAvailable: false }, { status: 503 })
  }
}
