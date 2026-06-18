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
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
        <Target className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">
          {completedCount}/{totalSquares - 1}
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
        <Award className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium text-gray-700">
          {completedLines.length} line{completedLines.length !== 1 ? "s" : ""}
        </span>
        {sticker ? (
          <Badge variant="success">Sticker Earned!</Badge>
        ) : (
          <span className="text-xs text-gray-400">
            ({STICKER_LINES_REQUIRED} for sticker)
          </span>
        )}
      </div>

      {leaderboardRank !== null && leaderboardRank <= 3 && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2">
          <Trophy className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-bold text-yellow-800">
            #{leaderboardRank} — Patch Contender!
          </span>
        </div>
      )}
    </div>
  )
}
