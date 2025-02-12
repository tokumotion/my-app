import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      console.log('🍪 Middleware Cookies:', {
        timestamp: new Date().toISOString(),
        hasCookies: !!req.cookies,
        cookieNames: req.cookies.getAll().map(c => c.name),
        hasSupabaseCookies: req.cookies.getAll().some(c => c.name.includes('supabase'))
      });
      return !!token;
    }
  },
});

export const config = {
  matcher: [
    "/(private)/:path*",
    "/api/api-keys/:path*"
  ],
}; 