import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Game Theory Agent | Unabotter",
  description: "AI-powered game theory analysis for crypto protocols, tokenomics, and mechanism design.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Game Theory Agent",
    description: "Analyze crypto protocol incentives, Nash equilibria, and attack vectors",
    type: "website",
    url: "https://gametheory.unabotter.xyz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Theory Agent",
    description: "AI-powered game theory analysis for DeFi",
    creator: "@spoobsV1",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh bg-[#0a0a0a] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  )
}
