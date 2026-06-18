"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleOAuthButton } from "./oauth-button"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/card")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <GoogleOAuthButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#c4b998]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#f5f0e0] px-2 text-[#8a7a5a]">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#3a3a2a]">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[#c4b998] bg-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#3a3a2a]">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[#c4b998] bg-white"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-700">{error}</p>
        )}

        <Button type="submit" className="w-full bg-[#4a5c3a] hover:bg-[#3a4a2a] text-amber-100" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#8a7a5a]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#4a5c3a] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
