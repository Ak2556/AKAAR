import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasRazorpayCredentials } from '@/lib/local-runtime'
import { withRateLimit, rateLimitPresets } from '@/lib/rate-limit'

interface CartItem {
  productId?: string
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
      shippingCost: clientShippingCost = 0,
    } = body as {
      items: CartItem[]
      currency?: string
      receipt?: string
      shippingCost?: number
      // amount from client is intentionally ignored — computed server-side
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 })
    }

    // ── Server-side price validation ──────────────────────────────────────
    // For every item that has a productId, fetch the authoritative price from
    // the database. The client-supplied price is NEVER used for DB-backed items.
    const admin = createAdminClient()
    let itemsTotal = 0

    for (const item of items) {
      const qty = Math.max(1, Math.round(Number(item.quantity) || 1))

      if (item.productId) {
        const { data: product } = await admin
          .from('products')
          .select('price')
          .eq('id', item.productId)
          .eq('is_active', true)
          .single()

        if (!product || product.price == null) {
          return NextResponse.json(
            { error: 'One or more products could not be priced. Please refresh and try again.' },
            { status: 400 }
          )
        }

        itemsTotal += Number(product.price) * qty
      } else {
        // Non-catalogued item (e.g. custom quote line) — accept client price
        itemsTotal += Number(item.price) * qty
      }
    }

    // Validate shipping cost is a non-negative number
    const shippingCost = Math.max(0, Number(clientShippingCost) || 0)
    const serverTotal = itemsTotal + shippingCost

    if (serverTotal <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 })
    }

    // Razorpay expects amount in paise (smallest currency unit)
    const amountPaise = Math.round(serverTotal * 100)
    const order = await createRazorpayOrder({
      amount: amountPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
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
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
