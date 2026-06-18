"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { FREE_SPACE_POSITION, WRITE_YOUR_OWN_POSITIONS } from "@/lib/constants"

export async function toggleSquare(
  itemPosition: number,
  completed: boolean,
  notes?: string
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  if (itemPosition === FREE_SPACE_POSITION) return

  const { error } = await supabase
    .from("card_squares")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      notes: notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("item_position", itemPosition)

  if (error) throw new Error(error.message)

  revalidatePath("/card")
  revalidatePath("/leaderboard")
}

export async function updateCustomTitle(
  itemPosition: number,
  customTitle: string
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  if (!WRITE_YOUR_OWN_POSITIONS.includes(itemPosition)) return

  const { error } = await supabase
    .from("card_squares")
    .update({
      custom_title: customTitle || null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("item_position", itemPosition)

  if (error) throw new Error(error.message)

  revalidatePath("/card")
}
