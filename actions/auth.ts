"use server"

import { signIn, signOut } from "@/auth/auth.node";

export async function serverSignIn(
  provider?: string,
  options?: { email?: string; callbackUrl?: string; redirect?: boolean }
) {
  
  if (provider === "nodemailer") {
    return await signIn(provider, {
      email: options?.email ?? "",
      callbackUrl: options?.callbackUrl ?? "/",
      redirect: options?.redirect ?? true,
    });
  } else {
    return await signIn(provider, {
      callbackUrl: options?.callbackUrl ?? "/",
      redirect: options?.redirect ?? true,
    });
  }
}

export async function serverSignOut() {
  await signOut( {
    redirectTo: "/",
  });
}