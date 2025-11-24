// auth.ts
import NextAuth from "next-auth";

import authCommon from "@/auth/auth.common";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authCommon);