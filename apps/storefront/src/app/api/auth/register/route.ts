import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { registerSchema, validateRequest } from '@/lib/validations'
import { withRateLimit, rateLimitPresets } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const rateLimitError = await withRateLimit(request, rateLimitPresets.standard)
    if (rateLimitError) return rateLimitError

    const body = await request.json()
    const validation = validateRequest(registerSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { name, email, password } = validation.data
    const supabase = createAdminClient()

    // Check if user already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Check if this is the first user — make them admin
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Create user via Supabase Auth admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Promote first user to admin
    if (count === 0 && data.user) {
      await supabase
        .from('profiles')
        .update({ role: 'ADMIN' })
        .eq('id', data.user.id)
    }

    await supabase.from('audit_logs').insert({
      user_id: data.user?.id ?? null,
      action: 'REGISTER',
      entity_type: 'User',
      metadata: { email },
    })

    return NextResponse.json(
      { message: 'User created successfully', userId: data.user?.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
