'use server'; 

import { signIn, signOut } from "@/auth/auth.node";

export async function serverSignIn(
  provider?: string,
  options?: { 
    email?: string; 
    password?: string; 
    callbackUrl?: string; 
    redirect?: boolean 
  }
) {
  const defaultCallbackUrl = options?.callbackUrl ?? "/";
  const defaultRedirect = options?.redirect ?? true;

  if (provider === "nodemailer") {
    
    return await signIn(provider, {
      email: options?.email, 
      callbackUrl: defaultCallbackUrl,
      redirect: defaultRedirect,
    });
  } else if (provider === "credentials") { 
    
    if (!options?.email || !options?.password) {
      throw new Error("Credentials sign-in requires both email and password.");
    }
    
   
    return await signIn(provider, {
      email: options.email,
      password: options.password,
      callbackUrl: defaultCallbackUrl,
      redirect: defaultRedirect,
    });
  } else {
    
    return await signIn(provider, {
      callbackUrl: defaultCallbackUrl,
      redirect: defaultRedirect,
    });
  }
}

export async function serverSignOut() {
  await signOut( {
    redirectTo: "/",
  });
}