import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Grid3X3, Trophy, Award, Target } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect("/card")

  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl">
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-blue-100 p-4">
              <Grid3X3 className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            F3 Legacy
            <br />
            <span className="text-blue-600">Summer Bingo</span>
          </h1>

          <p className="mt-4 text-lg text-gray-600 max-w-lg mx-auto">
            Challenge yourself this summer. Complete achievements, earn
            stickers, and compete for F3 Legacy patches.
          </p>

          <p className="mt-2 text-sm text-gray-400">
            July 1 — August 31, 2026
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Join the Challenge
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-8"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <Target className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900">
                25 Challenges
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Complete achievements across fitness, community, and leadership.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <Award className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900">
                Earn a Sticker
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Complete any 2 full lines to earn an F3 Legacy sticker.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <Trophy className="h-8 w-8 text-yellow-600 mb-3" />
              <h3 className="font-semibold text-gray-900">
                Win a Patch
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Top 3 PAX with the most squares completed win F3 patches.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
