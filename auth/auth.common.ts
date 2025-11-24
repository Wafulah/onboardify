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
      const isLoggedIn = !!auth;
      const isAdminRoute = nextUrl.pathname.startsWith("/");

      if (isAdminRoute && isLoggedIn) return true;
      if (!isLoggedIn && isAdminRoute) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
  },
  session: { strategy: "jwt" },
};

export default authCommon;
