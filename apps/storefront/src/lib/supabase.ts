// Re-export Supabase clients — use these directly in new code
export { createClient as createBrowserClient } from './supabase/client'
export { createClient as createServerClient }  from './supabase/server'
export { createAdminClient }                   from './supabase/admin'
export type { Database }                       from './supabase/types'
