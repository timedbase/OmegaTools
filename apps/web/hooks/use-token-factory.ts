import { useState } from 'react'
import { useAccount, useWriteContract, useSwitchChain, useReadContract } from 'wagmi'
import { parseEther, parseUnits, keccak256, toBytes } from 'viem'
import {
  TOKEN_FACTORY_ADDRESSES,
  STANDARD_TOKEN_FACTORY_ABI,
  ANTIBOT_TOKEN_FACTORY_ABI,
  LIQUIDITY_GEN_FACTORY_ABI,
  ANTIBOT_LIQUIDITY_GEN_FACTORY_ABI,
  BUYBACK_BABY_FACTORY_ABI,
  ANTIBOT_BUYBACK_BABY_FACTORY_ABI,
  type TokenType,
  type TokenCreationParams,
  type StandardTokenParams,
  type AntiBotTokenParams,
  type LiquidityGenTokenParams,
  type AntiBotLiquidityGenTokenParams,
  type BuybackBabyTokenParams,
  type AntiBotBuybackBabyTokenParams,
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

    // Get factory address based on token type
    let factoryAddress: `0x${string}`
    let abi: any
    let functionName: string
    let args: any[]
    let value: bigint

    switch (tokenType) {
      case 'standard': {
        factoryAddress = TOKEN_FACTORY_ADDRESSES.STANDARD
        abi = STANDARD_TOKEN_FACTORY_ABI
        functionName = 'createToken'

        const totalSupplyInWei = parseUnits(params.totalSupply.toString(), params.decimals)
        // Generate random salt
        const salt = keccak256(toBytes(`${params.name}-${params.symbol}-${Date.now()}`))

        args = [params.name, params.symbol, params.decimals, totalSupplyInWei, salt]
        value = parseEther('10') // 10 MONAD creation fee
        break
      }

      case 'antibot': {
        factoryAddress = TOKEN_FACTORY_ADDRESSES.ANTIBOT
        abi = ANTIBOT_TOKEN_FACTORY_ABI
        functionName = 'createToken'

        const antiBotParams = params as AntiBotTokenParams
        const totalSupplyInWei = parseUnits(params.totalSupply.toString(), params.decimals)

        args = [
          params.name,
          params.symbol,
          totalSupplyInWei,
          antiBotParams.maxTxPercent,
          antiBotParams.maxWalletPercent,
          antiBotParams.maxAntiWhalePercent,
        ]

        // Query the actual creation fee from the contract
        try {
          const feeResponse = await fetch(monadChain.rpcUrls.default.http[0], {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'eth_call',
              params: [
                {
                  to: factoryAddress,
                  data: '0xf9b03b94', // creationFee() function selector
                },
                'latest',
              ],
            }),
          })
          const feeData = await feeResponse.json()
          value = BigInt(feeData.result || '0')
        } catch {
          value = parseEther('0')
        }
        break
      }

      case 'liquidityGen': {
        factoryAddress = TOKEN_FACTORY_ADDRESSES.LIQUIDITY_GEN
        abi = LIQUIDITY_GEN_FACTORY_ABI
        functionName = 'createToken'

        const liquidityGenParams = params as LiquidityGenTokenParams
        const totalSupplyInWei = parseUnits(params.totalSupply.toString(), params.decimals)

        args = [
          params.name,
          params.symbol,
          totalSupplyInWei,
          liquidityGenParams.reflectionFee,
          liquidityGenParams.liquidityFee,
          liquidityGenParams.charityFee,
          liquidityGenParams.charityWallet,
          liquidityGenParams.router,
        ]
        value = parseEther('10') // 10 MONAD creation fee
        break
      }

      case 'antiBotLiquidityGen': {
        factoryAddress = TOKEN_FACTORY_ADDRESSES.ANTIBOT_LIQUIDITY_GEN
        abi = ANTIBOT_LIQUIDITY_GEN_FACTORY_ABI
        functionName = 'createToken'

        const antiBotLiqGenParams = params as AntiBotLiquidityGenTokenParams
        const totalSupplyInWei = parseUnits(params.totalSupply.toString(), params.decimals)

        args = [
          params.name,
          params.symbol,
          totalSupplyInWei,
          antiBotLiqGenParams.charityWallet,
          antiBotLiqGenParams.router,
          antiBotLiqGenParams.maxTxPercent,
          antiBotLiqGenParams.maxWalletPercent,
          antiBotLiqGenParams.maxAntiWhalePercent,
        ]
        value = parseEther('10') // 10 MONAD creation fee
        break
      }

      case 'buybackBaby': {
        factoryAddress = TOKEN_FACTORY_ADDRESSES.BUYBACK_BABY
        abi = BUYBACK_BABY_FACTORY_ABI
        functionName = 'createToken'

        const buybackBabyParams = params as BuybackBabyTokenParams
        const totalSupplyInWei = parseUnits(params.totalSupply.toString(), params.decimals)

        args = [
          params.name,
          params.symbol,
          totalSupplyInWei,
          buybackBabyParams.rewardToken,
          buybackBabyParams.router,
          buybackBabyParams.liquidityFee,
          buybackBabyParams.buybackFee,
          buybackBabyParams.reflectionFee,
          buybackBabyParams.marketingFee,
          buybackBabyParams.marketingWallet,
        ]
        value = parseEther('10') // 10 MONAD creation fee
        break
      }

      case 'antiBotBuybackBaby': {
        factoryAddress = TOKEN_FACTORY_ADDRESSES.ANTIBOT_BUYBACK_BABY
        abi = ANTIBOT_BUYBACK_BABY_FACTORY_ABI
        functionName = 'createToken'

        const antiBotBuybackParams = params as AntiBotBuybackBabyTokenParams
        const totalSupplyInWei = parseUnits(params.totalSupply.toString(), params.decimals)

        args = [
          params.name,
          params.symbol,
          totalSupplyInWei,
          antiBotBuybackParams.rewardToken,
          antiBotBuybackParams.router,
          antiBotBuybackParams.marketingWallet,
          antiBotBuybackParams.maxTxPercent,
          antiBotBuybackParams.maxWalletPercent,
          antiBotBuybackParams.maxAntiWhalePercent,
        ]
        value = parseEther('10') // 10 MONAD creation fee
        break
      }

      default:
        throw new Error(`Unsupported token type: ${tokenType}`)
    }

    try {
      // Call the factory create function
      const hash = await writeContractAsync({
        address: factoryAddress,
        abi,
        functionName,
        args,
        value,
      })

      // For now, return the tx hash. Token address extraction can be improved
      // by parsing events from the transaction receipt
      return {
        tokenAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`,
        txHash: hash,
      }
    } catch (error: any) {
      console.error('Token creation error:', error)
      throw new Error(error?.shortMessage || error?.message || 'Failed to create token')
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
