import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

export async function getOptionalSession(): Promise<{ user: { id: string; email?: string | null } } | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    return { user: { id: user.id, email: user.email } }
  } catch {
    return null
  }
}

export async function requireSession(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}
