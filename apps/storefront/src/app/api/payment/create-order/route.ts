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
    const { amount, currency = 'INR', receipt } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    const order = await createRazorpayOrder({ amount, currency, receipt })

    return NextResponse.json({ order, userId: user?.id ?? null })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
