"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleOAuthButton } from "./oauth-button"

export function SignupForm() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    })

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
          <span className="bg-[#f5f0e0] px-2 text-[#8a7a5a]">Or sign up with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-[#3a3a2a]">F3 Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Your F3 name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="border-[#c4b998] bg-white"
            required
          />
        </div>
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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-[#c4b998] bg-white"
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="text-sm text-red-700">{error}</p>
        )}

        <Button type="submit" className="w-full bg-[#4a5c3a] hover:bg-[#3a4a2a] text-amber-100" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#8a7a5a]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#4a5c3a] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
