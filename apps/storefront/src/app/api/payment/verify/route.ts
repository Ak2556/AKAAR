import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = body

    // Verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Get current user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Update order payment status
    const admin = createAdminClient()
    const { error } = await admin
      .from('orders')
      .update({
        payment_status: 'CAPTURED',
        status: 'CONFIRMED',
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      })
      .eq('id', orderId)

    if (error) throw error

    // Audit log
    if (user) {
      await admin.from('audit_logs').insert({
        user_id: user.id,
        action: 'PAYMENT_SUCCESS',
        entity_type: 'Order',
        metadata: { orderId, razorpayOrderId, razorpayPaymentId },
      })
    }

    return NextResponse.json({ success: true, message: 'Payment verified successfully' })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
