import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: rawOrders, error } = await supabase
      .from('orders')
      .select('id, order_number, status, total, created_at, tracking_number, tracking_url, order_items(id, name, quantity, material)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const orders = (rawOrders ?? []).map((o: typeof rawOrders extends (infer T)[] ? T : never) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      total: o.total,
      createdAt: o.created_at,
      trackingNumber: o.tracking_number,
      trackingUrl: o.tracking_url,
      items: o.order_items,
    }))

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
