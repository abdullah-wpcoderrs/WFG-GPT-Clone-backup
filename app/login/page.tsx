"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DemoAccountItem, type DemoAccount } from "@/components/ui/demo-account-item"
import { Loader2, Brain } from "lucide-react"

const demoAccounts: DemoAccount[] = [
  {
    name: "Super Admin",
    email: "superadmin@test.com",
    role: "SUPER_ADMIN",
    team: "Executive Management",
  },
  {
    name: "Finance Admin",
    email: "admin@test.com",
    role: "ADMIN",
    team: "Finance Team",
  },
  {
    name: "John Doe",
    email: "user@test.com",
    role: "USER",
    team: "Finance Team",
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)

    if (success) {
      router.push("/")
    } else {
      setError("Invalid email or password.")
    }
  }

  const handleDemoClick = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("password123")
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-white p-4">
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Select a demo account below"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password works"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">DEMO ACCOUNTS</span>
            </div>
          </div>

          <div className="space-y-3">
            {demoAccounts.map((account) => (
              <DemoAccountItem key={account.email} account={account} onClick={handleDemoClick} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

