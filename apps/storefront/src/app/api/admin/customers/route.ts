import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'ADMIN') return null
  return user
}

// GET — all customer profiles with order counts
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  const db = createAdminClient()

  // Profiles
  const { data: profiles, error } = await db
    .from('profiles')
    .select('id, name, email, role, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Order stats per customer
  const { data: orders } = await db
    .from('orders')
    .select('user_id, total, status')

  const statsByUser: Record<string, { count: number; revenue: number }> = {}
  for (const o of orders ?? []) {
    if (!o.user_id) continue
    if (!statsByUser[o.user_id]) statsByUser[o.user_id] = { count: 0, revenue: 0 }
    statsByUser[o.user_id].count += 1
    if (o.status !== 'CANCELLED') statsByUser[o.user_id].revenue += Number(o.total)
  }

  const customers = (profiles ?? []).map((p) => ({
    ...p,
    orderCount: statsByUser[p.id]?.count ?? 0,
    totalSpent: statsByUser[p.id]?.revenue ?? 0,
  }))

  return NextResponse.json({ customers })
}

// PATCH — promote / demote a user's role
export async function PATCH(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

  const { id, role } = await request.json()
  if (!id || !['CUSTOMER', 'ADMIN'].includes(role))
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const db = createAdminClient()
  const { data: profile, error } = await db
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ profile })
}
