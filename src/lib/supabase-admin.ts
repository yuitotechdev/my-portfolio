import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('CRITICAL: Supabase environment variables are missing!')
}

// Admin client for write operations (bypasses RLS)
// ONLY use this in Server Components or Server Actions where auth is already verified
export const supabaseAdmin = createClient(
    SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
)
