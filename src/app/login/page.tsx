import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Sign In - F3 Legacy Summer Bingo",
}

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-[#f5f0e0] border-[#c4b998]">
        <CardHeader className="text-center">
          <CardTitle className="text-[#2a3a1a]">Welcome Back</CardTitle>
          <CardDescription className="text-[#6a6a4a]">Sign in to your F3 Bingo account</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
