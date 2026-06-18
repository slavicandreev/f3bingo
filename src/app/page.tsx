import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy, Award, Target } from "lucide-react"

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
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
            <span className="text-amber-100">F3 LEGACY</span>
            <br />
            <span className="text-amber-400">BINGO</span>
          </h1>

          <p className="mt-4 text-lg text-amber-200/70 max-w-lg mx-auto">
            Challenge yourself this summer. Complete achievements, earn
            stickers, and compete for F3 Legacy patches.
          </p>

          <p className="mt-2 text-sm text-amber-200/40 font-bold tracking-widest">
            JULY 1 — AUGUST 31, 2026
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 bg-[#4a5c3a] hover:bg-[#5a6b4a] text-amber-100">
                Join the Challenge
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-8 border-[#4a5c3a] text-amber-200 hover:bg-[#2a3a1a] bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="rounded-xl border border-[#3a4a2a] bg-[#2a3a1a] p-5">
              <Target className="h-8 w-8 text-amber-400 mb-3" />
              <h3 className="font-bold text-amber-100">
                25 Challenges
              </h3>
              <p className="mt-1 text-sm text-amber-200/60">
                Complete achievements across fitness, community, and leadership.
              </p>
            </div>
            <div className="rounded-xl border border-[#3a4a2a] bg-[#2a3a1a] p-5">
              <Award className="h-8 w-8 text-amber-400 mb-3" />
              <h3 className="font-bold text-amber-100">
                Earn a Sticker
              </h3>
              <p className="mt-1 text-sm text-amber-200/60">
                Complete any 2 full lines to earn an F3 Legacy sticker.
              </p>
            </div>
            <div className="rounded-xl border border-[#3a4a2a] bg-[#2a3a1a] p-5">
              <Trophy className="h-8 w-8 text-amber-400 mb-3" />
              <h3 className="font-bold text-amber-100">
                Win a Patch
              </h3>
              <p className="mt-1 text-sm text-amber-200/60">
                Top 3 PAX with the most squares completed win F3 patches.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
