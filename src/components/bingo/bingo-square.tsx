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
        "relative flex flex-col items-center justify-center p-1.5 text-center transition-all aspect-square overflow-hidden border",
        "hover:brightness-110 active:scale-[0.97]",
        isFreeSpace &&
          "bg-[#4a5c3a] border-[#3a4a2a] text-amber-100",
        completed && !isFreeSpace &&
          "bg-[#5a6b4a] border-[#4a5c3a] text-amber-50",
        !completed && !isFreeSpace &&
          "bg-[#f5f0e0] border-[#d4c9a8] text-[#3a3a2a] hover:bg-[#ede8d4]",
        isInCompletedLine && completed &&
          "ring-2 ring-amber-400 ring-offset-1 ring-offset-[#2a3a1a]"
      )}
    >
      {completed && !isFreeSpace && (
        <div className="absolute top-0.5 right-0.5 rounded-full bg-amber-500 p-0.5">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}

      {isFreeSpace ? (
        <>
          <div className="flex gap-0.5 mb-0.5">
            <Star className="h-2 w-2 text-amber-400 fill-amber-400" />
            <Star className="h-2 w-2 text-amber-400 fill-amber-400" />
            <Star className="h-2 w-2 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-[10px] sm:text-xs font-black leading-tight tracking-wide">
            FREE
          </span>
          <span className="text-[10px] sm:text-xs font-black leading-tight tracking-wide">
            SPACE
          </span>
          <div className="w-6 h-px bg-amber-400/60 my-0.5" />
          <span className="text-[7px] sm:text-[8px] font-bold tracking-widest text-amber-300">
            SYITG
          </span>
        </>
      ) : (
        <span className={cn(
          "text-[9px] sm:text-[11px] font-semibold leading-tight line-clamp-4 px-0.5",
          completed ? "text-amber-50" : "text-[#3a3a2a]"
        )}>
          {title}
        </span>
      )}

      {notes && !isFreeSpace && (
        <div className="absolute bottom-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
      )}
    </button>
  )
}
