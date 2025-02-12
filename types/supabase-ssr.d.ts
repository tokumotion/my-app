declare module '@supabase/ssr' {
  import { SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js'

  export type CookieOptions = {
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'lax' | 'strict' | 'none'
    path?: string
    maxAge?: number
    domain?: string
  }

  export type Cookie = {
    name: string
    value: string
    options?: CookieOptions
  }

  export type CookieMethods = {
    getAll: () => Cookie[]
    setAll: (cookies: Cookie[]) => void
  }

  export type CreateClientConfig = SupabaseClientOptions & {
    cookies: CookieMethods
  }

  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    options: CreateClientConfig
  ): SupabaseClient
} 