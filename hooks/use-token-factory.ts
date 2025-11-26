import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { parseEther, parseUnits } from 'viem'
import {
  TOKEN_FACTORY_ADDRESSES,
  TOKEN_FACTORY_ABI,
  TOKEN_CREATION_FEE,
  type TokenType,
  type TokenCreationParams,
} from '@/lib/contracts/token-factory'
import { monadChain } from '@/lib/web3-config'

export function useTokenFactory() {
  const { address, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const [createdTokenAddress, setCreatedTokenAddress] = useState<`0x${string}` | null>(null)

  const createToken = async (
    params: TokenCreationParams,
    tokenType: TokenType = 'standard'
  ): Promise<{ tokenAddress: `0x${string}`; txHash: `0x${string}` }> => {
    if (!address) {
      throw new Error('Please connect your wallet first')
    }

    // Check if on correct network
    if (chainId !== monadChain.id) {
      try {
        await switchChainAsync({ chainId: monadChain.id })
      } catch (error) {
        throw new Error('Please switch to Monad network')
      }
    }

    const factoryAddress =
      tokenType === 'standard'
        ? TOKEN_FACTORY_ADDRESSES.STANDARD
        : TOKEN_FACTORY_ADDRESSES.ANTIBOT

    try {
      // Convert total supply to wei (with decimals)
      const totalSupplyInWei = parseUnits(params.totalSupply.toString(), params.decimals)

      // Call the factory create function
      const hash = await writeContractAsync({
        address: factoryAddress,
        abi: TOKEN_FACTORY_ABI,
        functionName: 'create',
        args: [params.name, params.symbol, params.decimals, totalSupplyInWei],
        value: parseEther('10'), // 10 MONAD
      })

      // Wait for transaction confirmation and get receipt
      const receipt = await new Promise<any>((resolve) => {
        const checkReceipt = async () => {
          try {
            const response = await fetch(monadChain.rpcUrls.default.http[0], {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getTransactionReceipt',
                params: [hash],
              }),
            })
            const data = await response.json()
            if (data.result) {
              resolve(data.result)
            } else {
              setTimeout(checkReceipt, 1000)
            }
          } catch {
            setTimeout(checkReceipt, 1000)
          }
        }
        checkReceipt()
      })

      // Parse TokenCreated event to get token address
      const tokenCreatedEvent = receipt.logs.find(
        (log: any) =>
          log.topics[0] === '0x...' // TODO: Calculate event signature hash
      )

      if (!tokenCreatedEvent || !tokenCreatedEvent.topics[2]) {
        throw new Error('Failed to get token address from transaction')
      }

      // Extract token address from indexed parameter
      const tokenAddress = `0x${tokenCreatedEvent.topics[2].slice(-40)}` as `0x${string}`
      setCreatedTokenAddress(tokenAddress)

      return {
        tokenAddress,
        txHash: hash,
      }
    } catch (error: any) {
      console.error('Token creation error:', error)
      throw new Error(error?.message || 'Failed to create token')
    }
  }

  const getExplorerUrl = (address: string) => {
    return `${monadChain.blockExplorers.default.url}/address/${address}`
  }

  const getTxExplorerUrl = (hash: string) => {
    return `${monadChain.blockExplorers.default.url}/tx/${hash}`
  }

  return {
    createToken,
    createdTokenAddress,
    getExplorerUrl,
    getTxExplorerUrl,
    isConnected: !!address,
    isCorrectNetwork: chainId === monadChain.id,
  }
}
