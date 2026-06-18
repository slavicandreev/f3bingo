"use client"

import { cn } from "@/lib/utils"
import { FREE_SPACE_POSITION } from "@/lib/constants"
import { Check, Star } from "lucide-react"

type Props = {
  position: number
  title: string
  completed: boolean
  notes: string | null
  isInCompletedLine: boolean
  onClick: () => void
}

export function BingoSquare({
  position,
  title,
  completed,
  notes,
  isInCompletedLine,
  onClick,
}: Props) {
  const isFreeSpace = position === FREE_SPACE_POSITION

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-1 rounded-md border-2 text-center transition-all aspect-square overflow-hidden",
        "hover:scale-[1.03] active:scale-[0.97]",
        completed && !isFreeSpace &&
          "bg-green-50 border-green-500 text-green-900",
        completed && isFreeSpace &&
          "bg-blue-50 border-blue-400 text-blue-900",
        !completed &&
          "bg-white border-gray-200 text-gray-700 hover:border-gray-400",
        isInCompletedLine && completed &&
          "ring-2 ring-yellow-400 ring-offset-1"
      )}
    >
      {completed && (
        <div
          className={cn(
            "absolute top-0.5 right-0.5 rounded-full p-0.5",
            isFreeSpace ? "bg-blue-500" : "bg-green-500"
          )}
        >
          {isFreeSpace ? (
            <Star className="h-2.5 w-2.5 text-white" />
          ) : (
            <Check className="h-2.5 w-2.5 text-white" />
          )}
        </div>
      )}

      <span className="text-[10px] sm:text-xs font-medium leading-tight line-clamp-3 px-0.5">
        {title}
      </span>

      {notes && (
        <div className="absolute bottom-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-blue-400" />
      )}
    </button>
  )
}
