import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { nanoid } from 'nanoid'
import crypto from 'crypto'
import { withRateLimit, rateLimitPresets } from '@/lib/rate-limit'
import { fetchPaymentDetails } from '@/lib/razorpay'
import { getShippingMethod, isShippingMethodId } from '@/lib/shipping'

interface SubmittedOrderItem {
  productId?: string
  material?: string
  quantity: number
}

interface VerifiedOrderItem {
  product_id: string
  name: string
  slug: string | null
  material: string | null
  quantity: number
  unit_price: number
  total_price: number
}

interface PaymentDetails {
  order_id?: string
  amount?: number | string
  currency?: string
  status?: string
  captured?: boolean
}

function normalizeQuantity(quantity: unknown): number {
  return Math.max(1, Math.round(Number(quantity) || 1))
}

export async function POST(request: NextRequest) {
  // ── Rate limiting ─────────────────────────────────────────────────────
  const rateLimitResult = await withRateLimit(request, rateLimitPresets.strict)
  if (rateLimitResult) return rateLimitResult

  try {
    const body = await request.json()

    // Razorpay returns snake_case keys in the handler callback
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body

    // ── 0. Null-guard all required Razorpay fields ───────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required payment fields' }, { status: 400 })
    }

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

    const payment = await fetchPaymentDetails(razorpay_payment_id) as PaymentDetails
    if (payment.order_id !== razorpay_order_id) {
      return NextResponse.json({ error: 'Payment order mismatch' }, { status: 400 })
    }

    if (payment.status !== 'captured' && payment.captured !== true) {
      return NextResponse.json({ error: 'Payment has not been captured' }, { status: 400 })
    }

    if (payment.currency && payment.currency !== 'INR') {
      return NextResponse.json({ error: 'Unsupported payment currency' }, { status: 400 })
    }

    const {
      items = [],
      shippingMethodId = 'standard',
      shippingAddress = {},
      email = '',
      phone = '',
    } = orderData ?? {}

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order items are required' }, { status: 400 })
    }

    if (!isShippingMethodId(shippingMethodId)) {
      return NextResponse.json({ error: 'Invalid shipping method' }, { status: 400 })
    }

    if (typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Order email is required' }, { status: 400 })
    }

    const verifiedShippingAddress =
      shippingAddress && typeof shippingAddress === 'object' ? shippingAddress : {}
    const shippingMethod = getShippingMethod(shippingMethodId)
    const shippingCost = shippingMethod.price
    const tax = 0
    let subtotal = 0
    const verifiedItems: VerifiedOrderItem[] = []

    for (const item of items as SubmittedOrderItem[]) {
      if (!item.productId) {
        return NextResponse.json({ error: 'Order contains an invalid product' }, { status: 400 })
      }

      const quantity = normalizeQuantity(item.quantity)
      const { data: product } = await admin
        .from('products')
        .select('id, name, slug, price')
        .eq('id', item.productId)
        .eq('is_active', true)
        .single()

      if (!product || product.price == null) {
        return NextResponse.json(
          { error: 'One or more products could not be verified. Please refresh and try again.' },
          { status: 400 }
        )
      }

      const unitPrice = Number(product.price)
      if (!Number.isFinite(unitPrice)) {
        return NextResponse.json({ error: 'Invalid product price' }, { status: 400 })
      }

      const lineTotal = unitPrice * quantity
      subtotal += lineTotal
      verifiedItems.push({
        product_id: product.id,
        name: product.name,
        slug: product.slug ?? null,
        material: item.material ?? null,
        quantity,
        unit_price: unitPrice,
        total_price: lineTotal,
      })
    }

    const total = subtotal + shippingCost + tax
    const expectedAmountPaise = Math.round(total * 100)
    const paidAmountPaise = Number(payment.amount)

    if (!Number.isFinite(paidAmountPaise) || paidAmountPaise !== expectedAmountPaise) {
      return NextResponse.json({ error: 'Paid amount does not match verified order total' }, { status: 400 })
    }

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
        shipping_method:     shippingMethod.name,
        shipping_address:    verifiedShippingAddress,
        email:               email.trim(),
        phone:               typeof phone === 'string' && phone.trim() ? phone.trim() : null,
        razorpay_order_id:   razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature:  razorpay_signature,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // ── 3. Insert order items ────────────────────────────────────────────
    const orderItems = verifiedItems.map((item) => ({
      order_id: order.id,
      ...item,
    }))

    const { error: orderItemsError } = await admin.from('order_items').insert(orderItems)
    if (orderItemsError) throw orderItemsError

    // ── 4. Audit log ─────────────────────────────────────────────────────
    if (user) {
      await admin.from('audit_logs').insert({
        user_id:     user.id,
        action:      'PAYMENT_SUCCESS',
        entity_type: 'Order',
        metadata:    { orderId: order.id, orderNumber, razorpay_order_id, razorpay_payment_id, total },
      }).then(null, () => {})
    }

    return NextResponse.json({ success: true, orderNumber, orderId: order.id })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
