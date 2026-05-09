import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, supabase }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'ADMIN') return { user: null, supabase }
  return { user, supabase }
}

// GET — list all orders for admin
export async function GET() {
  try {
    const { user, supabase } = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(id, name, quantity, unit_price, total_price, material)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ orders: orders ?? [] })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
