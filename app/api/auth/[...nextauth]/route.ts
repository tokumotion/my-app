import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
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
});

export { handler as GET, handler as POST }; 