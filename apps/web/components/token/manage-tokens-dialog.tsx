"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { request, gql } from "graphql-request"
import { useAccount } from "wagmi"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"
import { ExternalLink, Loader2 } from "lucide-react"
import { subgraphUrl, subgraphHeaders } from "@/lib/graphql/client"

interface ManageTokensDialogProps {
  isOpen: boolean
  onClose: () => void
}

const USER_TOKENS_QUERY = gql`
  query GetUserTokens($userAddress: String!) {
    user(id: $userAddress) {
      id
      totalTokensCreated
      tokens(orderBy: createdAt, orderDirection: desc) {
        id
        name
        symbol
        decimals
        totalSupply
        tokenType
        factory
        createdAt
        transactionHash
      }
    }
  }
`

interface Token {
  id: string
  name: string
  symbol: string
  decimals: string
  totalSupply: string
  tokenType: string
  factory: string
  createdAt: string
  transactionHash: string
}

interface UserData {
  user: {
    id: string
    totalTokensCreated: string
    tokens: Token[]
  } | null
}

export function ManageTokensDialog({ isOpen, onClose }: ManageTokensDialogProps) {
  const { address, isConnected } = useAccount()

  const { data, isLoading, error } = useQuery<UserData>({
    queryKey: ['user-tokens', address?.toLowerCase()],
    queryFn: async () => {
      if (!address) throw new Error('No wallet connected')
      return await request(
        subgraphUrl,
        USER_TOKENS_QUERY,
        { userAddress: address.toLowerCase() },
        subgraphHeaders
      )
    },
    enabled: isConnected && !!address && isOpen,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const userTokens = data?.user?.tokens || []
  const totalCreated = data?.user?.totalTokensCreated || '0'

  const getTokenTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'standard':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'antibot':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'liquiditygen':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'antibotliquiditygen':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      case 'buybackbaby':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'antibotbuybackbaby':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30'
      default:
        return 'bg-foreground/10 text-foreground border-foreground/20'
    }
  }

  const formatTokenType = (type: string) => {
    const typeMap: Record<string, string> = {
      standard: 'Standard',
      antibot: 'Anti-Bot',
      liquiditygen: 'Liquidity Gen',
      antibotliquiditygen: 'AntiBot Liq Gen',
      buybackbaby: 'Buyback Baby',
      antibotbuybackbaby: 'AntiBot Buyback',
    }
    return typeMap[type.toLowerCase()] || type
  }

  const formatSupply = (supply: string, decimals: string) => {
    const decimalNum = parseInt(decimals)
    const supplyNum = BigInt(supply)
    const divisor = BigInt(10 ** decimalNum)
    const formatted = Number(supplyNum / divisor).toLocaleString()
    return formatted
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getExplorerUrl = (address: string) => {
    return `https://explorer.monad.xyz/address/${address}`
  }

  const getTxExplorerUrl = (txHash: string) => {
    return `https://explorer.monad.xyz/tx/${txHash}`
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Manage Your Tokens" maxWidth="2xl">
      <div className="space-y-6">
        {!isConnected ? (
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-6 text-center">
            <p className="font-mono text-sm text-orange-400">Please connect your wallet to view your tokens</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="font-mono text-sm text-red-400">Failed to load your tokens. Please try again.</p>
          </div>
        ) : userTokens.length === 0 ? (
          <div className="rounded-lg border border-foreground/20 bg-foreground/5 p-12 text-center">
            <p className="mb-2 font-mono text-sm text-foreground/60">No tokens created yet</p>
            <p className="font-mono text-xs text-foreground/40">
              Create your first token to see it here
            </p>
          </div>
        ) : (
          <>
            {/* Header with stats */}
            <div className="flex items-center justify-between rounded-lg border border-foreground/10 bg-foreground/5 p-4">
              <div>
                <p className="font-mono text-xs text-foreground/60">Your Tokens</p>
                <p className="font-sans text-2xl font-light text-foreground">{totalCreated}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-foreground/60">Wallet</p>
                <p className="font-mono text-xs text-foreground">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            </div>

            {/* Tokens Grid */}
            <div className="space-y-4">
              {userTokens.map((token) => (
                <div
                  key={token.id}
                  className="group rounded-lg border border-foreground/20 bg-foreground/5 p-6 transition-all hover:border-foreground/30 hover:bg-foreground/10"
                >
                  {/* Token Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-sans text-xl font-light text-foreground">
                          {token.name}
                        </h3>
                        <span
                          className={`rounded-full border px-3 py-1 font-mono text-xs ${getTokenTypeColor(
                            token.tokenType
                          )}`}
                        >
                          {formatTokenType(token.tokenType)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm text-foreground/60">{token.symbol}</p>
                        <span className="text-foreground/30">•</span>
                        <a
                          href={getExplorerUrl(token.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-mono text-xs text-foreground/60 transition-colors hover:text-foreground"
                        >
                          {token.id.slice(0, 8)}...{token.id.slice(-6)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Token Stats Grid */}
                  <div className="mb-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="mb-1 font-mono text-xs text-foreground/60">Total Supply</p>
                      <p className="font-mono text-sm text-foreground">
                        {formatSupply(token.totalSupply, token.decimals)} {token.symbol}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-xs text-foreground/60">Decimals</p>
                      <p className="font-mono text-sm text-foreground">{token.decimals}</p>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-xs text-foreground/60">Created</p>
                      <p className="font-mono text-sm text-foreground">{formatDate(token.createdAt)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={getExplorerUrl(token.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <MagneticButton variant="secondary" size="default" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on Explorer
                      </MagneticButton>
                    </a>
                    <a
                      href={getTxExplorerUrl(token.transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <MagneticButton variant="ghost" size="default" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View TX
                      </MagneticButton>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Dialog>
  )
}
