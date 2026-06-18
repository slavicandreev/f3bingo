"use client"

import { useState, useOptimistic, useTransition } from "react"
import { BingoSquare } from "./bingo-square"
import { SquareDialog } from "./square-dialog"
import { PrizeProgress } from "./prize-progress"
import { getLinePositions } from "@/lib/bingo"
import { toggleSquare } from "@/app/card/actions"
import { GRID_SIZE, TOTAL_SQUARES } from "@/lib/constants"
import type { CardSquare, BingoItem } from "@/lib/types"

type SquareWithItem = {
  position: number
  title: string
  completed: boolean
  completedAt: string | null
  notes: string | null
}

type Props = {
  squares: (CardSquare & { bingo_items: BingoItem })[]
  leaderboardRank: number | null
  readOnly?: boolean
}

export function BingoCard({ squares, leaderboardRank, readOnly = false }: Props) {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const sortedSquares: SquareWithItem[] = squares
    .sort((a, b) => a.item_position - b.item_position)
    .map((sq) => ({
      position: sq.item_position,
      title: sq.bingo_items.title,
      completed: sq.completed,
      completedAt: sq.completed_at,
      notes: sq.notes,
    }))

  const [optimisticSquares, setOptimisticSquare] = useOptimistic(
    sortedSquares,
    (state, update: { position: number; completed: boolean; notes?: string }) =>
      state.map((sq) =>
        sq.position === update.position
          ? {
              ...sq,
              completed: update.completed,
              completedAt: update.completed
                ? new Date().toISOString()
                : null,
              notes: update.notes ?? sq.notes,
            }
          : sq
      )
  )

  const completedPositions = new Set(
    optimisticSquares.filter((sq) => sq.completed).map((sq) => sq.position)
  )
  const linePositions = getLinePositions(completedPositions)

  const selectedSquare = selectedPosition !== null
    ? optimisticSquares.find((sq) => sq.position === selectedPosition) ?? null
    : null

  function handleToggle(position: number, completed: boolean, notes?: string) {
    startTransition(async () => {
      setOptimisticSquare({ position, completed, notes })
      await toggleSquare(position, completed, notes)
      setSelectedPosition(null)
    })
  }

  const rows: SquareWithItem[][] = []
  for (let i = 0; i < GRID_SIZE; i++) {
    rows.push(optimisticSquares.slice(i * GRID_SIZE, (i + 1) * GRID_SIZE))
  }

  return (
    <div className="space-y-4">
      <PrizeProgress
        completedPositions={completedPositions}
        totalSquares={TOTAL_SQUARES}
        leaderboardRank={leaderboardRank}
      />

      <div className="mx-auto w-full max-w-[420px]">
        <div className="grid grid-cols-5 gap-1.5">
          {optimisticSquares.map((square) => (
            <BingoSquare
              key={square.position}
              position={square.position}
              title={square.title}
              completed={square.completed}
              notes={square.notes}
              isInCompletedLine={linePositions.has(square.position)}
              onClick={() => {
                if (!readOnly) setSelectedPosition(square.position)
              }}
            />
          ))}
        </div>
      </div>

      {!readOnly && (
        <SquareDialog
          square={selectedSquare}
          onClose={() => setSelectedPosition(null)}
          onToggle={handleToggle}
          saving={isPending}
        />
      )}
    </div>
  )
}
