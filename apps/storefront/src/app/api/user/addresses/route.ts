import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    if (error) throw error
    return NextResponse.json({ addresses: addresses ?? [] })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ error: 'Addresses unavailable' }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    // Clear default flag on existing addresses if this will be default
    if (body.isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        label: body.label ?? null,
        type: body.type ?? 'home',
        first_name: body.firstName,
        last_name: body.lastName,
        address: body.address,
        apartment: body.apartment ?? null,
        city: body.city,
        state: body.state,
        zip: body.zip,
        country: body.country ?? 'India',
        phone: body.phone ?? null,
        is_default: body.isDefault ?? false,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ address }, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json({ error: 'Addresses unavailable' }, { status: 503 })
  }
}
