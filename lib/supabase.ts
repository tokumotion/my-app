import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { DB_SCHEMAS } from './schema'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

type Cookie = {
  name: string
  value: string
  options: CookieOptions
}

// Client-side Supabase client with schema configuration
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: {
      schema: DB_SCHEMAS.AUTH
    }
  }
)

// Server-side Supabase client with auth context
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieList = cookieStore.getAll()
          return cookieList.map((cookie: RequestCookie): Cookie => ({
            name: cookie.name,
            value: cookie.value,
            options: {
              httpOnly: true,
              sameSite: 'lax',
              path: '/'
            }
          }))
        },
        setAll(cookies: Cookie[]) {
          cookies.forEach(cookie => {
            cookieStore.set(cookie.name, cookie.value, cookie.options)
          })
        }
      }
    }
  )
} 