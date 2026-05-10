import { NextResponse } from 'next/server'
import { getCatalog } from '@/lib/catalog'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const result = await getCatalog({
    category: searchParams.get('category'),
    search: searchParams.get('search'),
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12'),
    sortBy: searchParams.get('sortBy') || 'sort_order',
    sortOrder: searchParams.get('sortOrder') || 'asc',
  })

  return NextResponse.json(
    result,
    {
      status: result.catalogAvailable ? 200 : 503,
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" },
    }
  )
}
