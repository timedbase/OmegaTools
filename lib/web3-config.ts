import { http, cookieStorage, createStorage } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'a4d4d5d0e1e4b8c9d0e1e4b8c9d0e1e4'

const metadata = {
  name: 'Acme - OmegaTools',
  description: 'Creative experiences in fluid motion on Monad',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://omegatools.io',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Define Chain 143
export const monadChain = {
  id: 143,
  name: 'Monad',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.monad.xyz' },
  },
  testnet: false,
} as const

export const chains = [monadChain, mainnet] as const

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  transports: {
    [monadChain.id]: http(),
    [mainnet.id]: http(),
  },
  projectId,
  networks: chains as any,
})

export const config = wagmiAdapter.wagmiConfig
