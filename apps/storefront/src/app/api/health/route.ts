import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    // Probe a table the anon role is permitted to read. `profiles` SELECT is
    // intentionally revoked from anon (see supabase/migrations/002_security_fixes.sql),
    // so querying it here always failed with "permission denied" and reported a
    // false "database disconnected". `products` is public for the storefront catalog.
    const { error } = await supabase.from('products').select('id').limit(1)
    if (error) throw error

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: { database: 'connected', provider: 'supabase' },
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: { database: 'disconnected' },
      },
      { status: 503 }
    )
  }
}
