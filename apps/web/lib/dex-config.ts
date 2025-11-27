export interface DexConfig {
  name: string
  router: `0x${string}`
  displayName: string
}

export const DEX_CONFIGS: DexConfig[] = [
  {
    name: 'uniswap',
    router: '0x4b2ab38dbf28d31d467aa8993f6c2585981d6804',
    displayName: 'Uniswap',
  },
  {
    name: 'pancakeswap',
    router: '0xB1Bc24c34e88f7D43D5923034E3a14B24DaACfF9',
    displayName: 'PancakeSwap',
  },
  {
    name: 'dyorswap',
    router: '0x2D7aA179B485D25FE89f8E1B26b9f3CC2668f615',
    displayName: 'DYORSwap',
  },
  {
    name: 'octoswap',
    router: '0x60fd5Aa15Debd5ffdEfB5129FD9FD8A34d80d608',
    displayName: 'Octoswap',
  },
]

export const getRouterByDexName = (dexName: string): `0x${string}` | undefined => {
  const dex = DEX_CONFIGS.find(d => d.name.toLowerCase() === dexName.toLowerCase())
  return dex?.router
}
