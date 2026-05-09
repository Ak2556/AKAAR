import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendOrderStatusEmail } from '@/lib/email'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, supabase }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'ADMIN') return { user: null, supabase }
  return { user, supabase }
}

// GET — single order detail
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, supabase } = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(id, name, quantity, unit_price, total_price, material, slug)')
      .eq('id', id)
      .single()

    if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

// PATCH — update order status, tracking, notes
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user, supabase } = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { status, trackingNumber, trackingUrl, statusNotes } = body

    const updatePayload: Record<string, string | null> = {}
    if (status)         updatePayload.status          = status
    if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber || null
    if (trackingUrl    !== undefined) updatePayload.tracking_url    = trackingUrl    || null
    if (statusNotes    !== undefined) updatePayload.status_notes    = statusNotes    || null

    const { data: order, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select('*, order_items(id, name, quantity, unit_price, total_price)')
      .single()

    if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Send email notification on key status changes
    if (status && ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status) && order.email) {
      const trackingMsg = status === 'SHIPPED' && order.tracking_number
        ? `Your tracking number is <strong>${order.tracking_number}</strong>.${order.tracking_url ? ` <a href="${order.tracking_url}">Track your package →</a>` : ''}`
        : undefined

      await sendOrderStatusEmail({
        to: order.email,
        orderNumber: order.order_number,
        status,
        message: trackingMsg,
        trackingNumber: order.tracking_number ?? undefined,
        trackingUrl: order.tracking_url ?? undefined,
      }).catch((err) => console.error('Email send failed (non-fatal):', err))
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
