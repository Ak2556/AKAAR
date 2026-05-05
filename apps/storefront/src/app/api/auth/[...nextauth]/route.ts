// NextAuth route is no longer used — auth is handled by Supabase.
// This file is kept to prevent 404s from old bookmarks/clients.
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Auth is handled by Supabase' }, { status: 200 })
}
export async function POST() {
  return NextResponse.json({ message: 'Auth is handled by Supabase' }, { status: 200 })
}
