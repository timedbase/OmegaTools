import { useWriteContract, useReadContract, useAccount, useChainId } from 'wagmi'
import { MULTISENDER_ADDRESS, MULTISENDER_ABI } from '@/lib/contracts/multisender'
import { parseUnits } from 'viem'

/**
 * Hooks for OmegaMultisenderV2 contract
 * Contract: 0x494BB03fA823520486D7f8f802428B1cFf94cdE7
 * Features:
 * - Default fee: 1 MON per recipient
 * - Atomic fee transfers to treasury
 * - Owner can update fees and treasury
 */

const ERC20_ABI = [
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
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
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

export interface Recipient {
  address: string
  amount: string
}

export function useMultisender() {
  const { writeContractAsync } = useWriteContract()
  const { address: userAddress } = useAccount()
  const chainId = useChainId()

  // Get fee per recipient
  const { data: feePerRecipient, isError: feeError, isLoading: feeLoading } = useReadContract({
    address: MULTISENDER_ADDRESS,
    abi: MULTISENDER_ABI,
    functionName: 'feePerRecipient',
  })

  // Get max recipients
  const { data: maxRecipients } = useReadContract({
    address: MULTISENDER_ADDRESS,
    abi: MULTISENDER_ABI,
    functionName: 'MAX_RECIPIENTS',
  })

  const calculateFee = (recipientCount: number): bigint => {
    if (!feePerRecipient) return BigInt(0)
    return feePerRecipient * BigInt(recipientCount)
  }

  const multisendNative = async (recipients: Recipient[]) => {
    if (!userAddress) throw new Error('Wallet not connected')
    if (recipients.length === 0) throw new Error('No recipients provided')
    if (!feePerRecipient) throw new Error('Fee not loaded. Please try again.')

    const addresses = recipients.map((r) => r.address as `0x${string}`)
    const amounts = recipients.map((r) => parseUnits(r.amount, 18))
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, BigInt(0))
    const totalFee = feePerRecipient * BigInt(recipients.length)
    const totalValue = totalAmount + totalFee

    console.log('Multisend Native:', {
      recipients: addresses,
      amounts: amounts.map(a => a.toString()),
      totalAmount: totalAmount.toString(),
      totalFee: totalFee.toString(),
      totalValue: totalValue.toString(),
    })

    const tx = await writeContractAsync({
      address: MULTISENDER_ADDRESS,
      abi: MULTISENDER_ABI,
      functionName: 'multisendNative',
      args: [addresses, amounts],
      value: totalValue,
    })

    return tx
  }

  const multisendNativeEqual = async (recipients: string[], amount: string) => {
    if (!userAddress) throw new Error('Wallet not connected')
    if (recipients.length === 0) throw new Error('No recipients provided')
    if (!feePerRecipient) throw new Error('Fee not loaded. Please try again.')

    const addresses = recipients.map((r) => r as `0x${string}`)
    const amountBigInt = parseUnits(amount, 18)
    const totalAmount = amountBigInt * BigInt(recipients.length)
    const totalFee = feePerRecipient * BigInt(recipients.length)
    const totalValue = totalAmount + totalFee

    const tx = await writeContractAsync({
      address: MULTISENDER_ADDRESS,
      abi: MULTISENDER_ABI,
      functionName: 'multisendNativeEqual',
      args: [addresses, amountBigInt],
      value: totalValue,
    })

    return tx
  }

  const multisendToken = async (
    tokenAddress: `0x${string}`,
    recipients: Recipient[],
    decimals: number = 18
  ) => {
    if (!userAddress) throw new Error('Wallet not connected')
    if (recipients.length === 0) throw new Error('No recipients provided')
    if (!feePerRecipient) throw new Error('Fee not loaded. Please try again.')

    const addresses = recipients.map((r) => r.address as `0x${string}`)
    const amounts = recipients.map((r) => parseUnits(r.amount, decimals))
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, BigInt(0))
    const totalFee = feePerRecipient * BigInt(recipients.length)

    console.log('Multisend Token:', {
      token: tokenAddress,
      recipients: addresses,
      amounts: amounts.map(a => a.toString()),
      totalAmount: totalAmount.toString(),
      totalFee: totalFee.toString(),
    })

    // First approve the token
    await writeContractAsync({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [MULTISENDER_ADDRESS, totalAmount],
    })

    // Then multisend
    const tx = await writeContractAsync({
      address: MULTISENDER_ADDRESS,
      abi: MULTISENDER_ABI,
      functionName: 'multisendToken',
      args: [tokenAddress, addresses, amounts],
      value: totalFee,
    })

    return tx
  }

  const multisendTokenEqual = async (
    tokenAddress: `0x${string}`,
    recipients: string[],
    amount: string,
    decimals: number = 18
  ) => {
    if (!userAddress) throw new Error('Wallet not connected')
    if (recipients.length === 0) throw new Error('No recipients provided')
    if (!feePerRecipient) throw new Error('Fee not loaded. Please try again.')

    const addresses = recipients.map((r) => r as `0x${string}`)
    const amountBigInt = parseUnits(amount, decimals)
    const totalAmount = amountBigInt * BigInt(recipients.length)
    const totalFee = feePerRecipient * BigInt(recipients.length)

    // First approve the token
    await writeContractAsync({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [MULTISENDER_ADDRESS, totalAmount],
    })

    // Then multisend
    const tx = await writeContractAsync({
      address: MULTISENDER_ADDRESS,
      abi: MULTISENDER_ABI,
      functionName: 'multisendTokenEqual',
      args: [tokenAddress, addresses, amountBigInt],
      value: totalFee,
    })

    return tx
  }

  return {
    multisendNative,
    multisendNativeEqual,
    multisendToken,
    multisendTokenEqual,
    feePerRecipient,
    maxRecipients,
    calculateFee,
  }
}
