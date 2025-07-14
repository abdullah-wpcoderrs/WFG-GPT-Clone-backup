"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect based on role
        switch (user.role) {
          case "super_admin":
            router.push("/dashboard/super")
            break
          case "admin":
            router.push("/dashboard/admin")
            break
          case "user":
            router.push("/dashboard/user")
            break
          default:
            router.push("/login")
        }
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#66BB6A]" />
      </div>
    )
  }

  return null
}
