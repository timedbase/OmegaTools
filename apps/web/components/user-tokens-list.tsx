"use client"

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { querySubgraph, GET_USER_TOKENS } from '@/lib/graphql'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Token {
  id: string
  name: string
  symbol: string
  tokenType: string
  totalSupply: string
  createdAt: string
  creationTxHash: string
}

interface UserData {
  id: string
  totalTokensCreated: string
  tokensCreated: Token[]
}

export function UserTokensList() {
  const { address } = useAccount()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserTokens() {
      if (!address) {
        setUserData(null)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await querySubgraph<{ user: UserData }>(GET_USER_TOKENS, {
          userAddress: address.toLowerCase(),
        })
        setUserData(data.user)
      } catch (err) {
        console.error('Error fetching user tokens:', err)
        setError('Failed to load your tokens')
      } finally {
        setLoading(false)
      }
    }

    fetchUserTokens()
  }, [address])

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Created Tokens</CardTitle>
          <CardDescription>Connect your wallet to view your tokens</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Created Tokens</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Created Tokens</CardTitle>
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!userData || userData.tokensCreated.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Created Tokens</CardTitle>
          <CardDescription>You haven't created any tokens yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Start by creating your first token using one of our factory contracts.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getTokenTypeBadgeColor = (tokenType: string) => {
    switch (tokenType) {
      case 'standard':
        return 'default'
      case 'antibot':
        return 'destructive'
      case 'liquidityGen':
        return 'secondary'
      case 'antiBotLiquidityGen':
        return 'outline'
      case 'buybackBaby':
        return 'default'
      case 'antiBotBuybackBaby':
        return 'destructive'
      default:
        return 'default'
    }
  }

  const formatTokenType = (tokenType: string) => {
    switch (tokenType) {
      case 'standard':
        return 'Standard'
      case 'antibot':
        return 'AntiBot'
      case 'liquidityGen':
        return 'Liquidity Gen'
      case 'antiBotLiquidityGen':
        return 'AntiBot Liquidity Gen'
      case 'buybackBaby':
        return 'Buyback Baby'
      case 'antiBotBuybackBaby':
        return 'AntiBot Buyback Baby'
      default:
        return tokenType
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Created Tokens</CardTitle>
        <CardDescription>
          You've created {userData.totalTokensCreated} token{userData.totalTokensCreated !== '1' ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userData.tokensCreated.map((token) => (
            <div
              key={token.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{token.name}</h4>
                  <Badge variant={getTokenTypeBadgeColor(token.tokenType) as any}>
                    {formatTokenType(token.tokenType)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{token.symbol}</span>
                  <span>•</span>
                  <span className="font-mono text-xs">{token.id.slice(0, 6)}...{token.id.slice(-4)}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(parseInt(token.createdAt) * 1000), { addSuffix: true })}</span>
                </div>
              </div>
              <a
                href={`https://monadscan.com/address/${token.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View →
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
