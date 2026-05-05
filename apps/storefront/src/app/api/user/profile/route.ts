import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, name, email, image, role, created_at')
      .eq('id', user.id)
      .single()

    if (error || !profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ user: profile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Profile unavailable' }, { status: 503 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const updates: { name?: string; image?: string } = {}
    if (typeof body.name === 'string') updates.name = body.name.trim()
    if (typeof body.image === 'string') updates.image = body.image

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id, name, email, image, role')
      .single()

    if (error) throw error
    return NextResponse.json({ user: profile })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Profile unavailable' }, { status: 503 })
  }
}
