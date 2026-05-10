import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category  = searchParams.get('category')
    const search    = searchParams.get('search')
    const page      = parseInt(searchParams.get('page')  || '1')
    const limit     = parseInt(searchParams.get('limit') || '12')
    const sortBy    = searchParams.get('sortBy')    || 'sort_order'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const offset    = (page - 1) * limit

    const supabase = await createClient()

    let query = supabase
      .from('products')
      .select('*, mesh_files(*)', { count: 'exact' })
      .eq('is_active', true)

    if (category && category !== 'all') {
      query = query.ilike('category', category)
    }
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,short_description.ilike.%${search}%`
      )
    }

    const validSortCols: Record<string, string> = {
      price: 'price', name: 'name', createdAt: 'created_at', sortOrder: 'sort_order'
    }
    const col = validSortCols[sortBy] ?? 'sort_order'
    query = query.order(col, { ascending: sortOrder !== 'desc' })

    const { data: products, count, error } = await query.range(offset, offset + limit - 1)

    if (error) throw error

    // Fetch distinct categories
    const { data: cats } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true)
      .not('category', 'is', null)

    const categoryMap: Record<string, number> = {}
    for (const row of cats ?? []) {
      if (row.category) categoryMap[row.category] = (categoryMap[row.category] ?? 0) + 1
    }
    const categories = Object.entries(categoryMap).map(([label, count]) => ({
      id: label.toLowerCase(), label, count,
    }))

    // Transform snake_case → camelCase for the client
    const mapped = (products ?? []).map((p) => {
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
        meshFile: mf ? {
          id:               mf.id,
          storagePath:      mf.storage_path ?? null,
          originalFilename: mf.original_filename ?? 'model.glb',
        } : null,
      }
    })

    const total = count ?? 0
    return NextResponse.json(
      {
        products: mapped,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        categories,
        catalogAvailable: true,
        empty: total === 0,
      },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" } }
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { products: [], pagination: { page:1,limit:12,total:0,totalPages:0 }, categories: [], catalogAvailable: false, empty: true },
      { status: 503 }
    )
  }
}
