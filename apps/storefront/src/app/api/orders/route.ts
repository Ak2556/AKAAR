import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ orders: orders ?? [] })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const { items, subtotal, shippingCost, tax, total, shippingMethod, shippingAddress, email, phone, notes } = body

    if (!items?.length || !shippingAddress || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const orderNumber = `ORD-${nanoid(10).toUpperCase()}`

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user?.id ?? null,
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        shipping_method: shippingMethod,
        shipping_address: shippingAddress,
        email,
        phone: phone ?? null,
        notes: notes ?? null,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Insert items
    const orderItems = items.map((item: {
      productId?: string; name: string; slug?: string; material?: string;
      quantity: number; unitPrice: number; totalPrice: number;
    }) => ({
      order_id: order.id,
      product_id: item.productId ?? null,
      name: item.name,
      slug: item.slug ?? null,
      material: item.material ?? null,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw itemsError

    return NextResponse.json({ order, orderNumber }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
