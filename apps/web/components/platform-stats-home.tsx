'use client'

import { useQuery } from '@tanstack/react-query'
import { request, gql } from 'graphql-request'
import { subgraphUrl, subgraphHeaders } from '@/lib/graphql/client'

const PLATFORM_STATS_QUERY = gql`
  query GetPlatformStats {
    globalStats(id: "global") {
      totalTokensCreated
      totalLocksCreated
      totalMultisends
      totalFeesPaid
    }
    factoryStats(orderBy: totalTokensCreated, orderDirection: desc) {
      factoryType
      totalTokensCreated
      totalFeesCollected
    }
  }
`

interface GlobalStats {
  totalTokensCreated: string
  totalLocksCreated: string
  totalMultisends: string
  totalFeesPaid: string
}

interface FactoryStats {
  factoryType: string
  totalTokensCreated: string
  totalFeesCollected: string
}

interface PlatformStatsData {
  globalStats: GlobalStats | null
  factoryStats: FactoryStats[]
}

export function PlatformStatsHome() {
  const { data, isLoading, error } = useQuery<PlatformStatsData>({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      return await request(subgraphUrl, PLATFORM_STATS_QUERY, {}, subgraphHeaders)
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <p className="font-mono text-sm text-red-400">Unable to load platform statistics</p>
      </div>
    )
  }

  const stats = data?.globalStats

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tokens Created"
        value={stats?.totalTokensCreated || '0'}
        isLoading={isLoading}
        icon="🪙"
      />
      <StatCard
        title="Liquidity Locks"
        value={stats?.totalLocksCreated || '0'}
        isLoading={isLoading}
        icon="🔒"
      />
      <StatCard
        title="Multisends"
        value={stats?.totalMultisends || '0'}
        isLoading={isLoading}
        icon="📤"
      />
      <StatCard
        title="Total Fees (MON)"
        value={stats ? (parseFloat(stats.totalFeesPaid) / 1e18).toFixed(2) : '0'}
        isLoading={isLoading}
        icon="💰"
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  isLoading,
  icon,
}: {
  title: string
  value: string
  isLoading: boolean
  icon: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-foreground/10 bg-foreground/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/10">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-2 font-mono text-xs text-foreground/60">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-foreground/10" />
          ) : (
            <p className="font-sans text-3xl font-light text-foreground">{value}</p>
          )}
        </div>
        <span className="text-2xl opacity-50 transition-opacity group-hover:opacity-100">{icon}</span>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500/50 to-blue-500/50 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}
