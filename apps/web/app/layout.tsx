import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/contexts/web3-provider"
import Providers from "./providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OmegaTools - Monad",
  description: "Complete DeFi toolkit for Monad blockchain - Lock liquidity, create tokens, and multisend with ease",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>
          <Web3Provider>
            {children}
            <Analytics />
          </Web3Provider>
        </Providers>
      </body>
    </html>
  )
}
