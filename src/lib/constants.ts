export const GRID_SIZE = 5
export const FREE_SPACE_POSITION = 12
export const TOTAL_SQUARES = 25
export const STICKER_LINES_REQUIRED = 2
export const PATCH_WINNERS = 3
export const LEADERBOARD_SIZE = 10

export const CHALLENGE_START = new Date("2026-07-01T00:00:00Z")
export const CHALLENGE_END = new Date("2026-08-31T23:59:59Z")

export function isChallengeActive(): boolean {
  const now = new Date()
  return now >= CHALLENGE_START && now <= CHALLENGE_END
}

export const COLUMN_HEADERS = ["B", "I", "N", "G", "O"]

export const BINGO_ITEMS: { position: number; title: string }[] = [
  { position: 0, title: "Q'd a beatdown" },
  { position: 1, title: "Q'd 5 beatdowns" },
  { position: 2, title: "Brought an FNG" },
  { position: 3, title: "Brought 3 FNGs" },
  { position: 4, title: "Completed a pre-run/pre-murph" },
  { position: 5, title: "Stayed for Coffeteria" },
  { position: 6, title: "Attended a 2nd F event" },
  { position: 7, title: "Attended a 3rd F event" },
  { position: 8, title: "Organized a 2nd F event" },
  { position: 9, title: "Organized a 3rd F event" },
  { position: 10, title: "Attended 10 beatdowns" },
  { position: 11, title: "Attended 20 beatdowns" },
  { position: 12, title: "FREE SPACE" },
  { position: 13, title: "Posted at 3 different AOs" },
  { position: 14, title: "Posted at 5 different AOs" },
  { position: 15, title: "Posted in all 3 Legacy Regions" },
  { position: 16, title: "Posted Downrange" },
  { position: 17, title: "Picked up a leadership role" },
  { position: 18, title: "EH'd a kotter" },
  { position: 19, title: "Attended a Convergence" },
  { position: 20, title: "Led 30 for 30 or attended" },
  { position: 21, title: "Attended a Q Source" },
  { position: 22, title: "Posted in Pax Essay" },
  { position: 23, title: "Shared a Social Media Post" },
  { position: 24, title: "Completed a Ruck" },
]
