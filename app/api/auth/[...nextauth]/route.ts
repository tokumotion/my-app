import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import jwt from 'jsonwebtoken'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET
      if (signingSecret) {
        const payload = {
          aud: 'authenticated',
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: 'authenticated',
        }
        session.supabaseAccessToken = jwt.sign(payload, signingSecret)
      }
      session.user.id = user.id
      return session
    },
    async redirect({ url, baseUrl }) {
      // Check if this is a sign-out redirect
      if (url.includes('signout')) {
        return baseUrl;
      }
      
      // For sign-in and other cases, redirect to dashboards
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboards`;
      }
      
      return url;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 