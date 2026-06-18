"use client"

import { Badge } from "@/components/ui/badge"
import { getCompletedLines, hasEarnedSticker } from "@/lib/bingo"
import { FREE_SPACE_POSITION, STICKER_LINES_REQUIRED } from "@/lib/constants"
import { Award, Trophy, Target } from "lucide-react"

type Props = {
  completedPositions: Set<number>
  totalSquares: number
  leaderboardRank: number | null
}

export function PrizeProgress({
  completedPositions,
  totalSquares,
  leaderboardRank,
}: Props) {
  const completedCount = [...completedPositions].filter(
    (p) => p !== FREE_SPACE_POSITION
  ).length
  const completedLines = getCompletedLines(completedPositions)
  const sticker = hasEarnedSticker(completedPositions)

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-[#3a4a2a] bg-[#2a3a1a] px-3 py-2">
        <Target className="h-4 w-4 text-amber-400" />
        <span className="text-sm font-bold text-amber-100">
          {completedCount}/{totalSquares - 1}
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-[#3a4a2a] bg-[#2a3a1a] px-3 py-2">
        <Award className="h-4 w-4 text-amber-400" />
        <span className="text-sm font-bold text-amber-100">
          {completedLines.length} line{completedLines.length !== 1 ? "s" : ""}
        </span>
        {sticker ? (
          <Badge variant="success">Sticker Earned!</Badge>
        ) : (
          <span className="text-xs text-amber-200/50">
            ({STICKER_LINES_REQUIRED} for sticker)
          </span>
        )}
      </div>

      {leaderboardRank !== null && leaderboardRank <= 3 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-900/30 px-3 py-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-bold text-amber-200">
            #{leaderboardRank} — Patch Contender!
          </span>
        </div>
      )}
    </div>
  )
}
