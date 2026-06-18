export type Profile = {
  id: string
  display_name: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type BingoItem = {
  id: number
  position: number
  title: string
  description: string | null
  created_at: string
}

export type CardSquare = {
  id: string
  user_id: string
  item_position: number
  completed: boolean
  completed_at: string | null
  notes: string | null
  updated_at: string
}

export type CardSquareWithItem = CardSquare & {
  bingo_items: BingoItem
}

export type LeaderboardEntry = {
  user_id: string
  display_name: string
  avatar_url: string | null
  completed_count: number
  last_completion_at: string | null
  account_created_at: string
}
