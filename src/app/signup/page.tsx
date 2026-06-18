import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata = {
  title: "Sign Up - F3 Legacy Summer Bingo",
}

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-[#f5f0e0] border-[#c4b998]">
        <CardHeader className="text-center">
          <CardTitle className="text-[#2a3a1a]">Join the Challenge</CardTitle>
          <CardDescription className="text-[#6a6a4a]">
            Create your account for F3 Legacy Summer Bingo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  )
}
