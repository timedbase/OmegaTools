import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { LIQUIDITY_LOCKER_ADDRESS, LIQUIDITY_LOCKER_ABI, ERC20_ABI } from '@/lib/contracts/liquidity-locker'
import { parseUnits, formatUnits } from 'viem'

export function useLiquidityLocker() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  // Read lock fee
  const { data: lockFee } = useReadContract({
    address: LIQUIDITY_LOCKER_ADDRESS,
    abi: LIQUIDITY_LOCKER_ABI,
    functionName: 'lockFee',
  })

  // Read total lock count
  const { data: totalLocks } = useReadContract({
    address: LIQUIDITY_LOCKER_ADDRESS,
    abi: LIQUIDITY_LOCKER_ABI,
    functionName: 'erc20LockCount',
  })

  // Get user's locks
  const { data: userLockIds, refetch: refetchUserLocks } = useReadContract({
    address: LIQUIDITY_LOCKER_ADDRESS,
    abi: LIQUIDITY_LOCKER_ABI,
    functionName: 'getUserERC20LiquidityLocks',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Lock liquidity
  const lockLiquidity = async (
    tokenAddress: `0x${string}`,
    amount: string,
    unlockTimeInDays: number
  ) => {
    if (!address) throw new Error('Wallet not connected')

    const unlockTime = BigInt(Math.floor(Date.now() / 1000) + unlockTimeInDays * 24 * 60 * 60)
    const amountBigInt = parseUnits(amount, 18)

    // First approve the locker contract
    const approveTx = await writeContractAsync({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [LIQUIDITY_LOCKER_ADDRESS, amountBigInt],
    })

    // Wait for approval
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Then lock the liquidity
    const lockTx = await writeContractAsync({
      address: LIQUIDITY_LOCKER_ADDRESS,
      abi: LIQUIDITY_LOCKER_ABI,
      functionName: 'lockERC20Liquidity',
      args: [tokenAddress, amountBigInt, unlockTime],
      value: lockFee || BigInt(0),
    })

    return lockTx
  }

  // Withdraw liquidity
  const withdrawLiquidity = async (lockId: bigint) => {
    if (!address) throw new Error('Wallet not connected')

    const tx = await writeContractAsync({
      address: LIQUIDITY_LOCKER_ADDRESS,
      abi: LIQUIDITY_LOCKER_ABI,
      functionName: 'withdrawERC20Liquidity',
      args: [lockId],
    })

    return tx
  }

  // Extend lock
  const extendLock = async (lockId: bigint, additionalDays: number) => {
    if (!address) throw new Error('Wallet not connected')

    const newUnlockTime = BigInt(Math.floor(Date.now() / 1000) + additionalDays * 24 * 60 * 60)

    const tx = await writeContractAsync({
      address: LIQUIDITY_LOCKER_ADDRESS,
      abi: LIQUIDITY_LOCKER_ABI,
      functionName: 'extendERC20LiquidityLock',
      args: [lockId, newUnlockTime],
    })

    return tx
  }

  // Get lock details
  const getLockDetails = async (lockId: bigint) => {
    // This would need to be implemented with useReadContract
    // For now, returning a placeholder
    return null
  }

  return {
    lockFee,
    totalLocks,
    userLockIds,
    lockLiquidity,
    withdrawLiquidity,
    extendLock,
    getLockDetails,
    refetchUserLocks,
  }
}

// Hook to get LP token details
export function useERC20Token(tokenAddress: `0x${string}` | undefined) {
  const { address } = useAccount()

  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress,
    },
  })

  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'name',
    query: {
      enabled: !!tokenAddress,
    },
  })

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: !!tokenAddress,
    },
  })

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    },
  })

  return {
    balance,
    name,
    symbol,
    decimals,
    formattedBalance: balance && decimals ? formatUnits(balance, decimals) : '0',
  }
}

// Hook to get lock details by ID
export function useLockDetails(lockId: bigint | undefined) {
  const { data: lockDetails, refetch } = useReadContract({
    address: LIQUIDITY_LOCKER_ADDRESS,
    abi: LIQUIDITY_LOCKER_ABI,
    functionName: 'getERC20LockDetails',
    args: lockId !== undefined ? [lockId] : undefined,
    query: {
      enabled: lockId !== undefined,
    },
  })

  const { data: isWithdrawable } = useReadContract({
    address: LIQUIDITY_LOCKER_ADDRESS,
    abi: LIQUIDITY_LOCKER_ABI,
    functionName: 'isERC20Withdrawable',
    args: lockId !== undefined ? [lockId] : undefined,
    query: {
      enabled: lockId !== undefined,
    },
  })

  return {
    lockDetails,
    isWithdrawable,
    refetch,
  }
}
