import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client (browser-safe, read-only for public data)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-only admin client (never expose to browser)
export function getAdminClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// Storage helpers
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const BUCKETS = {
  PROJECT_IMAGES: 'project-images',
  CLIENT_LOGOS: 'client-logos',
} as const
