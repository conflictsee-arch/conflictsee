import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Lazy client — only throws when actually queried, so `next build` succeeds
// even when env vars are absent (e.g. external PRs / CI without secrets).
export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
