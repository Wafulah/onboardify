"use client"

import { serverSignOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={serverSignOut} className="w-full">
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  )
}