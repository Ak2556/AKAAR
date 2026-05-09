import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'
import { hasRazorpayCredentials } from '@/lib/local-runtime'

export async function POST(request: NextRequest) {
  try {
    if (!hasRazorpayCredentials()) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    // amount comes in from checkout as rupees — Razorpay needs paise
    const { amount: amountRupees, currency = 'INR', receipt } = body

    if (!amountRupees || amountRupees <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    const amountPaise = Math.round(amountRupees * 100)
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
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
