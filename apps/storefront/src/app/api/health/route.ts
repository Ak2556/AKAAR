import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').select('id').limit(1)
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
