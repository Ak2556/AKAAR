import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: product, error } = await supabase
      .from('products')
      .select('*, mesh_files(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Related products — same category, exclude current
    const { data: relatedProducts } = await supabase
      .from('products')
      .select('*, mesh_files(*)')
      .eq('is_active', true)
      .eq('category', product.category ?? '')
      .neq('id', product.id)
      .limit(4)

    return NextResponse.json({
      product,
      relatedProducts: relatedProducts ?? [],
      catalogAvailable: true,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Catalog unavailable', catalogAvailable: false }, { status: 503 })
  }
}
