// Token Factory Contract Addresses on Monad Network (Chain ID: 143)
export const TOKEN_FACTORY_ADDRESSES = {
  STANDARD: '0x8f5cB651e8eF125c5e1549669Cdacf02D94B0CE7' as `0x${string}`,
  ANTIBOT: '0x4dAFb276E9EfD61eb723Aaea0Ecf7855Ce1FD68b' as `0x${string}`,
  OMEGA_ANTIBOT: '0xc90ddA96EcCe9B077cf2358A61b96B1194f36E46' as `0x${string}`,
  FACTORY_MANAGER: '0x9F738C9Dc4c21389ab35173308954C3A15938DC6' as `0x${string}`,
} as const

// Token creation fee (10 MONAD)
export const TOKEN_CREATION_FEE = '10000000000000000000' // 10 * 10^18

// Token Factory ABI
export const TOKEN_FACTORY_ABI = [
  {
    type: 'function',
    name: 'create',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'decimals', type: 'uint8' },
      { name: 'totalSupply', type: 'uint256' },
    ],
    outputs: [{ name: 'token', type: 'address' }],
  },
  {
    type: 'function',
    name: 'flatFee',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'TokenCreated',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'token', type: 'address', indexed: true },
      { name: 'tokenType', type: 'uint8', indexed: false },
    ],
  },
] as const

// OmegaAntiBot ABI
export const OMEGA_ANTIBOT_ABI = [
  {
    type: 'function',
    name: 'enableAntiBot',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'permanent', type: 'bool' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'disableAntiBot',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'blacklistAddress',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'account', type: 'address' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'blacklistAddresses',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'accounts', type: 'address[]' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'whitelistAddress',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'account', type: 'address' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'whitelistAddresses',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'accounts', type: 'address[]' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'configureLaunchProtection',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'duration', type: 'uint256' },
      { name: 'maxTxAmount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'setCooldownPeriod',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'cooldown', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'isEnabled',
    stateMutability: 'view',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'isPermanentlyEnabled',
    stateMutability: 'view',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'isBlacklisted',
    stateMutability: 'view',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'account', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'isWhitelisted',
    stateMutability: 'view',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'account', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

export type TokenType = 'standard' | 'antibot'

export interface TokenCreationParams {
  name: string
  symbol: string
  decimals: number
  totalSupply: bigint
}
