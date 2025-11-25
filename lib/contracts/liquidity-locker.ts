// OmegaLiquidityLocker Contract Configuration
export const LIQUIDITY_LOCKER_ADDRESS = '0x28a6fe6AEfd6AA7E2476440a6088f844f89b78a5'

export const LIQUIDITY_LOCKER_ABI = [
  // Read Functions
  {
    inputs: [{ name: 'lockId', type: 'uint256' }],
    name: 'getERC20LockDetails',
    outputs: [
      { name: 'token', type: 'address' },
      { name: 'owner', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'unlockTime', type: 'uint256' },
      { name: 'withdrawn', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserERC20LiquidityLocks',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'token', type: 'address' }],
    name: 'getTokenERC20LiquidityLocks',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'lockId', type: 'uint256' }],
    name: 'isERC20Withdrawable',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lockFee',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'erc20LockCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write Functions
  {
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'unlockTime', type: 'uint256' },
    ],
    name: 'lockERC20Liquidity',
    outputs: [{ name: 'lockId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'lockId', type: 'uint256' }],
    name: 'withdrawERC20Liquidity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'lockId', type: 'uint256' },
      { name: 'newUnlockTime', type: 'uint256' },
    ],
    name: 'extendERC20LiquidityLock',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'lockId', type: 'uint256' },
      { indexed: true, name: 'token', type: 'address' },
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: false, name: 'unlockTime', type: 'uint256' },
    ],
    name: 'ERC20Locked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'lockId', type: 'uint256' },
      { indexed: true, name: 'token', type: 'address' },
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
    name: 'ERC20Withdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'lockId', type: 'uint256' },
      { indexed: false, name: 'lockType', type: 'uint8' },
      { indexed: false, name: 'newUnlockTime', type: 'uint256' },
    ],
    name: 'LockExtended',
    type: 'event',
  },
] as const

// ERC20 ABI for LP token interactions
export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
