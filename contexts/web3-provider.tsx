"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { wagmiAdapter, projectId, chains } from '@/lib/web3-config'
import type React from 'react'

const queryClient = new QueryClient()

const metadata = {
  name: 'Acme - OmegaTools',
  description: 'Creative experiences in fluid motion on Monad',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://omegatools.io',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: chains as any,
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': 'hsl(var(--foreground))',
    '--w3m-border-radius-master': '12px',
  },
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
