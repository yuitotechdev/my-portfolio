import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('WARNING: NEXT_PUBLIC_SUPABASE_URL is missing! Queries will fail.')
}

// Client for public read operations (respects RLS for anon)
export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
