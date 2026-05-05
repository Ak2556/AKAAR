import { NextResponse } from 'next/server'

// Supabase handles token verification automatically via the reset-password redirect.
// This endpoint is kept for backwards compatibility but is no longer needed.
export async function GET() {
  return NextResponse.json({ message: 'Use Supabase password reset flow' }, { status: 200 })
}
