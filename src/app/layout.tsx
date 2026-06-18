import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Header } from "@/components/layout/header"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "F3 Legacy Summer Bingo",
  description:
    "Track your F3 Legacy Summer Bingo progress. Complete challenges, earn stickers, and compete for patches!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#1e2d14]">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-[#3a4a2a] bg-[#1e2d14] py-4 text-center">
          <p className="text-xs font-bold tracking-widest text-amber-200/40">
            FITNESS. FELLOWSHIP. FAITH.
          </p>
          <p className="mt-1 text-xs text-amber-200/30">
            ALL MEN. ALL FREE. ALL IN.
          </p>
        </footer>
      </body>
    </html>
  )
}
