import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized: ({ token }) => !!token
  },
});

export const config = {
  matcher: [
    "/(private)/:path*",
    "/api/api-keys/:path*"
  ],
}; 