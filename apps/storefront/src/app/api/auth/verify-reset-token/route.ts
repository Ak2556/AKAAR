import { NextResponse } from 'next/server'

// Token verification is now handled client-side via supabase.auth.verifyOtp()
// This route is kept so existing bookmarked URLs don't 404.
export async function GET() {
  return NextResponse.json({ message: 'Use the reset-password page directly.' }, { status: 200 })
}
