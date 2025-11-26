// Token Factory Contract Addresses on Monad Network (Chain ID: 143)
// Source: INTEGRATION.md
export const TOKEN_FACTORY_ADDRESSES = {
  STANDARD: '0xE4D8cF581CaFc6E6A30DE12ebbE12EfD1EE3871a' as `0x${string}`,
  ANTIBOT: '0x322e4A64156E7ff5040C2e0cEa2AacAE9E83B420' as `0x${string}`,
  LIQUIDITY_GEN: '0x68C1F787610E5311C48A634DB2DFCd5D007064db' as `0x${string}`,
  ANTIBOT_LIQUIDITY_GEN: '0x45fCE82e66a2e453B7E89aE9C8835f1c3DB7f725' as `0x${string}`,
  BUYBACK_BABY: '0xeBEe683f60840AF5Cb71E7f60c296888D343154C' as `0x${string}`,
  ANTIBOT_BUYBACK_BABY: '0x36a172246ee20ab48523812e3d413fe09d807b64' as `0x${string}`,
} as const

// Other contract addresses
export const OTHER_ADDRESSES = {
  LIQUIDITY_LOCKER: '0xa36E03745d1dc28f5B56cb04980DB99e7c866Be4' as `0x${string}`,
  MULTISENDER: '0x7789e88f8F49CC3Ca9C154591D525062A47a988C' as `0x${string}`,
} as const

// Standard Token Factory ABI
export const STANDARD_TOKEN_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createToken',
    stateMutability: 'payable',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_symbol', type: 'string' },
      { name: '_decimals', type: 'uint8' },
      { name: '_initialSupply', type: 'uint256' },
      { name: '_salt', type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'creationFee',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'TokenCreated',
    inputs: [
      { name: 'creator', type: 'address', indexed: true },
      { name: 'tokenAddress', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'symbol', type: 'string', indexed: false },
      { name: 'initialSupply', type: 'uint256', indexed: false },
      { name: 'fee', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const

// AntiBot Token Factory ABI
export const ANTIBOT_TOKEN_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createToken',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'totalSupply', type: 'uint256' },
      { name: 'maxTxPercent', type: 'uint256' },
      { name: 'maxWalletPercent', type: 'uint256' },
      { name: 'maxAntiWhalePercent', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'creationFee',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'TokenCreated',
    inputs: [
      { name: 'token', type: 'address', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'symbol', type: 'string', indexed: false },
      { name: 'totalSupply', type: 'uint256', indexed: false },
    ],
  },
] as const

// Liquidity Generation Token Factory ABI (non-antibot version)
export const LIQUIDITY_GEN_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createToken',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'totalSupply', type: 'uint256' },
      { name: 'reflectionFee', type: 'uint256' },
      { name: 'liquidityFee', type: 'uint256' },
      { name: 'charityFee', type: 'uint256' },
      { name: 'charityWallet', type: 'address' },
      { name: 'router', type: 'address' },
    ],
    outputs: [{ name: 'token', type: 'address' }],
  },
  {
    type: 'function',
    name: 'creationFee',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'TokenCreated',
    inputs: [
      { name: 'token', type: 'address', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'symbol', type: 'string', indexed: false },
      { name: 'totalSupply', type: 'uint256', indexed: false },
      { name: 'reflectionFee', type: 'uint256', indexed: false },
      { name: 'liquidityFee', type: 'uint256', indexed: false },
      { name: 'charityFee', type: 'uint256', indexed: false },
    ],
  },
] as const

// AntiBot Liquidity Generation Token Factory ABI
export const ANTIBOT_LIQUIDITY_GEN_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createToken',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'totalSupply', type: 'uint256' },
      { name: 'charityWallet', type: 'address' },
      { name: 'router', type: 'address' },
      { name: 'maxTxPercent', type: 'uint256' },
      { name: 'maxWalletPercent', type: 'uint256' },
      { name: 'maxAntiWhalePercent', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'creationFee',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'TokenCreated',
    inputs: [
      { name: 'token', type: 'address', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'symbol', type: 'string', indexed: false },
      { name: 'totalSupply', type: 'uint256', indexed: false },
      { name: 'reflectionFee', type: 'uint256', indexed: false },
      { name: 'liquidityFee', type: 'uint256', indexed: false },
      { name: 'charityFee', type: 'uint256', indexed: false },
    ],
  },
] as const

// Buyback Baby Token Factory ABI (non-antibot version)
export const BUYBACK_BABY_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createToken',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'totalSupply', type: 'uint256' },
      { name: 'rewardToken', type: 'address' },
      { name: 'router', type: 'address' },
      { name: 'liquidityFee', type: 'uint256' },
      { name: 'buybackFee', type: 'uint256' },
      { name: 'reflectionFee', type: 'uint256' },
      { name: 'marketingFee', type: 'uint256' },
      { name: 'marketingWallet', type: 'address' },
    ],
    outputs: [{ name: 'token', type: 'address' }],
  },
  {
    type: 'function',
    name: 'creationFee',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'TokenCreated',
    inputs: [
      { name: 'token', type: 'address', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'symbol', type: 'string', indexed: false },
      { name: 'totalSupply', type: 'uint256', indexed: false },
      { name: 'rewardToken', type: 'address', indexed: false },
    ],
  },
] as const

// AntiBot Buyback Baby Token Factory ABI
export const ANTIBOT_BUYBACK_BABY_FACTORY_ABI = [
  {
    type: 'function',
    name: 'createToken',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'totalSupply', type: 'uint256' },
      { name: 'rewardToken', type: 'address' },
      { name: 'router', type: 'address' },
      { name: 'marketingWallet', type: 'address' },
      { name: 'maxTxPercent', type: 'uint256' },
      { name: 'maxWalletPercent', type: 'uint256' },
      { name: 'maxAntiWhalePercent', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'creationFee',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'TokenCreated',
    inputs: [
      { name: 'token', type: 'address', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'symbol', type: 'string', indexed: false },
      { name: 'totalSupply', type: 'uint256', indexed: false },
      { name: 'rewardToken', type: 'address', indexed: false },
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

export type TokenType =
  | 'standard'
  | 'antibot'
  | 'liquidityGen'
  | 'antiBotLiquidityGen'
  | 'buybackBaby'
  | 'antiBotBuybackBaby'

export interface BaseTokenCreationParams {
  name: string
  symbol: string
  decimals: number
  totalSupply: bigint
}

export interface StandardTokenParams extends BaseTokenCreationParams {}

export interface AntiBotTokenParams extends BaseTokenCreationParams {
  maxTxPercent: number
  maxWalletPercent: number
  maxAntiWhalePercent: number
}

export interface LiquidityGenTokenParams extends BaseTokenCreationParams {
  reflectionFee: number
  liquidityFee: number
  charityFee: number
  charityWallet: `0x${string}`
  router: `0x${string}`
}

export interface AntiBotLiquidityGenTokenParams extends BaseTokenCreationParams {
  charityWallet: `0x${string}`
  router: `0x${string}`
  maxTxPercent: number
  maxWalletPercent: number
  maxAntiWhalePercent: number
}

export interface BuybackBabyTokenParams extends BaseTokenCreationParams {
  rewardToken: `0x${string}`
  router: `0x${string}`
  liquidityFee: number
  buybackFee: number
  reflectionFee: number
  marketingFee: number
  marketingWallet: `0x${string}`
}

export interface AntiBotBuybackBabyTokenParams extends BaseTokenCreationParams {
  rewardToken: `0x${string}`
  router: `0x${string}`
  marketingWallet: `0x${string}`
  maxTxPercent: number
  maxWalletPercent: number
  maxAntiWhalePercent: number
}

export type TokenCreationParams =
  | StandardTokenParams
  | AntiBotTokenParams
  | LiquidityGenTokenParams
  | AntiBotLiquidityGenTokenParams
  | BuybackBabyTokenParams
  | AntiBotBuybackBabyTokenParams
