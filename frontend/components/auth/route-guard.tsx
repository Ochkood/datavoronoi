"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCurrentUser, isAuthenticated, type AuthUser } from "@/lib/auth"

interface RouteGuardProps {
  children: React.ReactNode
  roles?: Array<AuthUser["role"]>
}

export function RouteGuard({ children, roles }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`)
      return
    }

    const user = getCurrentUser()
    if (!user) {
      router.replace("/login")
      return
    }

    if (roles && !roles.includes(user.role)) {
      router.replace("/")
      return
    }

    setAllowed(true)
  }, [pathname, roles, router])

  if (!allowed) return null
  return <>{children}</>
}
