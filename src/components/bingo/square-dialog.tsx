"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Check, Undo2 } from "lucide-react"
import { FREE_SPACE_POSITION } from "@/lib/constants"

type SquareData = {
  position: number
  title: string
  completed: boolean
  completedAt: string | null
  notes: string | null
}

type Props = {
  square: SquareData | null
  onClose: () => void
  onToggle: (position: number, completed: boolean, notes?: string) => void
  saving: boolean
  readOnly?: boolean
}

export function SquareDialog({ square, onClose, onToggle, saving, readOnly }: Props) {
  const [notes, setNotes] = useState("")
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (square) {
      setNotes(square.notes ?? "")
    }
  }, [square])

  if (!square) return null

  const isFreeSpace = square.position === FREE_SPACE_POSITION

  function handleToggle() {
    if (isFreeSpace) return
    onToggle(square!.position, !square!.completed, notes || undefined)
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-[#f5f0e0] p-6 shadow-xl animate-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#2a3a1a]">
              {square.title}
            </h3>
            {square.completed && square.completedAt && (
              <p className="text-sm text-[#6a6a4a] mt-1">
                Completed{" "}
                {new Date(square.completedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-[#e5e0cc]"
          >
            <X className="h-5 w-5 text-[#6a6a4a]" />
          </button>
        </div>

        {isFreeSpace && (
          <p className="text-sm text-[#6a6a4a]">
            This one&apos;s on us. The free space is automatically completed. SYITG!
          </p>
        )}

        {!isFreeSpace && !readOnly && (
          <>
            <div className="mb-4">
              <Label htmlFor="notes" className="text-[#3a3a2a]">
                Notes (optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add a note about this achievement..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5 border-[#c4b998] bg-white"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              {square.completed ? (
                <Button
                  variant="outline"
                  className="flex-1 border-[#c4b998] text-[#3a3a2a]"
                  onClick={handleToggle}
                  disabled={saving}
                >
                  <Undo2 className="h-4 w-4" />
                  {saving ? "Saving..." : "Mark Incomplete"}
                </Button>
              ) : (
                <Button
                  className="flex-1 bg-[#4a5c3a] hover:bg-[#3a4a2a] text-amber-50"
                  onClick={handleToggle}
                  disabled={saving}
                >
                  <Check className="h-4 w-4" />
                  {saving ? "Saving..." : "Mark Complete"}
                </Button>
              )}
            </div>
          </>
        )}

        {!isFreeSpace && readOnly && (
          <>
            {square.notes && (
              <p className="text-sm text-[#6a6a4a] italic">&quot;{square.notes}&quot;</p>
            )}
            {!square.completed && (
              <p className="text-sm text-[#8a7a5a]">Not yet completed</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
