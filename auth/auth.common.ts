// auth.common.ts
import type { NextAuthConfig } from "next-auth";

const authCommon: NextAuthConfig = {
  // Keep this list empty or only include providers that are safe to import
  providers: [],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;

      
      if (
        pathname === "/login" ||
        pathname === "/error" ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico"
      ) {
        return true;
      }

      const isLoggedIn = !!auth;
      // Protect everything else under root if not logged in
      if (!isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
  session: { strategy: "jwt" },
};

export default authCommon;
