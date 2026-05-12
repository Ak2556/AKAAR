import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { nanoid } from 'nanoid'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Razorpay returns snake_case keys in the handler callback
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body

    // ── 1. Verify Razorpay signature ────────────────────────────────────
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // ── 2. Idempotency — return existing order if payment already processed ─
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const admin = createAdminClient()

    const { data: existingOrder } = await admin
      .from('orders')
      .select('id, order_number')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle()

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        orderNumber: existingOrder.order_number,
        orderId: existingOrder.id,
      })
    }

    const {
      items = [],
      subtotal = 0,
      shippingCost = 0,
      tax = 0,
      total = 0,
      shippingMethod = 'Standard',
      shippingAddress = {},
      email = '',
      phone = '',
    } = orderData ?? {}

    const orderNumber = `ORD-${nanoid(10).toUpperCase()}`

    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        order_number:        orderNumber,
        user_id:             user?.id ?? null,
        subtotal,
        shipping_cost:       shippingCost,
        tax,
        total,
        status:              'CONFIRMED',
        payment_status:      'CAPTURED',
        shipping_method:     shippingMethod,
        shipping_address:    shippingAddress,
        email,
        phone:               phone || null,
        razorpay_order_id:   razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature:  razorpay_signature,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // ── 3. Insert order items ────────────────────────────────────────────
    if (items.length > 0) {
      const orderItems = items.map((item: {
        productId?: string; name: string; slug?: string;
        material?: string; quantity: number; price: number;
      }) => ({
        order_id:    order.id,
        product_id:  item.productId ?? null,
        name:        item.name,
        slug:        item.slug ?? null,
        material:    item.material ?? null,
        quantity:    item.quantity,
        unit_price:  item.price,
        total_price: item.price * item.quantity,
      }))

      await admin.from('order_items').insert(orderItems)
    }

    // ── 4. Audit log ─────────────────────────────────────────────────────
    if (user) {
      await admin.from('audit_logs').insert({
        user_id:     user.id,
        action:      'PAYMENT_SUCCESS',
        entity_type: 'Order',
        metadata:    { orderId: order.id, orderNumber, razorpay_order_id, razorpay_payment_id },
      }).then(null, () => {})
    }

    return NextResponse.json({ success: true, orderNumber, orderId: order.id })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
