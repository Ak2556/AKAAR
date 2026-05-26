import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasRazorpayCredentials } from '@/lib/local-runtime'
import { withRateLimit, rateLimitPresets } from '@/lib/rate-limit'
import { getShippingMethod, isShippingMethodId } from '@/lib/shipping'
import { evaluateCoupon, type CouponRecord } from '@/lib/coupons'

interface CartItem {
  productId: string
  variantId?: string | null
  name: string
  slug?: string
  price: number
  quantity: number
  material?: string
}

export async function POST(request: NextRequest) {
  // ── Rate limiting ─────────────────────────────────────────────────────
  const rateLimitResult = await withRateLimit(request, rateLimitPresets.strict)
  if (rateLimitResult) return rateLimitResult

  try {
    if (!hasRazorpayCredentials()) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const {
      items,
      currency = 'INR',
      receipt,
      shippingMethodId = 'standard',
      couponCode = null,
    } = body as {
      items: CartItem[]
      currency?: string
      receipt?: string
      shippingMethodId?: string
      couponCode?: string | null
      // amount from client is intentionally ignored — computed server-side
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 })
    }

    if (!isShippingMethodId(shippingMethodId)) {
      return NextResponse.json({ error: 'Invalid shipping method' }, { status: 400 })
    }

    // ── Server-side price validation ──────────────────────────────────────
    // For every item that has a productId, fetch the authoritative price from
    // the database. The client-supplied price is NEVER used for DB-backed items.
    const admin = createAdminClient()
    let itemsTotal = 0

    for (const item of items) {
      const qty = Math.max(1, Math.round(Number(item.quantity) || 1))

      if (!item.productId) {
        return NextResponse.json({ error: 'Cart contains an invalid product' }, { status: 400 })
      }

      const { data: product } = await admin
        .from('products')
        .select('price, stock_quantity, name')
        .eq('id', item.productId)
        .eq('is_active', true)
        .single()

      if (!product || product.price == null) {
        return NextResponse.json(
          { error: 'One or more products could not be priced. Please refresh and try again.' },
          { status: 400 }
        )
      }

      let unitPrice = Number(product.price)
      let variantStock: number | null = null

      if (item.variantId) {
        const { data: variant } = await admin
          .from('product_variants')
          .select('id, price_modifier, stock_quantity, is_active')
          .eq('id', item.variantId)
          .eq('product_id', item.productId)
          .single()
        if (!variant || !variant.is_active) {
          return NextResponse.json(
            { error: 'Selected material is no longer available' },
            { status: 400 }
          )
        }
        unitPrice += Number(variant.price_modifier) || 0
        variantStock = variant.stock_quantity
      }

      const stockLimit = variantStock ?? product.stock_quantity
      if (stockLimit != null && stockLimit < qty) {
        return NextResponse.json(
          { error: `${product.name ?? 'A product'} only has ${stockLimit} in stock` },
          { status: 400 }
        )
      }

      itemsTotal += unitPrice * qty
    }

    const shippingMethod = getShippingMethod(shippingMethodId)
    let shippingCost = shippingMethod.price

    let couponDiscount = 0
    let appliedCouponCode: string | null = null
    if (typeof couponCode === 'string' && couponCode.trim()) {
      const code = couponCode.trim().toUpperCase()
      const { data: couponRow } = await admin.from('coupons').select('*').eq('code', code).single()
      if (!couponRow) {
        return NextResponse.json({ error: 'Coupon not found' }, { status: 400 })
      }
      const coupon: CouponRecord = {
        id: couponRow.id,
        code: couponRow.code,
        description: couponRow.description,
        type: couponRow.type,
        value: Number(couponRow.value) || 0,
        minOrderTotal: couponRow.min_order_total == null ? null : Number(couponRow.min_order_total),
        maxDiscount: couponRow.max_discount == null ? null : Number(couponRow.max_discount),
        maxUses: couponRow.max_uses,
        usedCount: couponRow.used_count ?? 0,
        startsAt: couponRow.starts_at,
        expiresAt: couponRow.expires_at,
        isActive: couponRow.is_active,
      }
      const evaluation = evaluateCoupon(coupon, { subtotal: itemsTotal, shippingCost })
      if (!evaluation.valid) {
        return NextResponse.json({ error: evaluation.reason ?? 'Invalid coupon' }, { status: 400 })
      }
      couponDiscount = evaluation.discount ?? 0
      appliedCouponCode = coupon.code
      if (evaluation.freeShipping) shippingCost = 0
    }

    const serverTotal = Math.max(0, itemsTotal + shippingCost - couponDiscount)

    if (serverTotal <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 })
    }

    // Razorpay expects amount in paise (smallest currency unit)
    const amountPaise = Math.round(serverTotal * 100)
    const order = await createRazorpayOrder({
      amount: amountPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        shippingMethodId: shippingMethod.id,
        shippingMethod: shippingMethod.name,
        userId: user?.id ?? 'guest',
        couponCode: appliedCouponCode ?? '',
        couponDiscount: String(couponDiscount),
      },
    })

    return NextResponse.json({
      // Fields the checkout page reads directly
      key:      process.env.RAZORPAY_KEY_ID,
      orderId:  order.id,
      amount:   order.amount,   // in paise — Razorpay modal expects paise
      currency: order.currency,
      userId:   user?.id ?? null,
      // Return the server-verified total (in rupees) so the client can confirm
      verifiedTotal: serverTotal,
      shippingCost,
      shippingMethodId: shippingMethod.id,
      couponDiscount,
      couponCode: appliedCouponCode,
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
