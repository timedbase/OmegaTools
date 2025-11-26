"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { request, gql } from "graphql-request"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"
import { ExternalLink, Loader2, Lock, Unlock } from "lucide-react"
import { subgraphUrl, subgraphHeaders } from "@/lib/graphql/client"

interface ViewLiquidityDialogProps {
  isOpen: boolean
  onClose: () => void
}

const LOCKS_QUERY = gql`
  query GetLocks($first: Int!, $skip: Int!) {
    locks(
      first: $first
      skip: $skip
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      token
      owner {
        id
      }
      amount
      unlockTime
      unlocked
      createdAt
      unlockedAt
    }
    globalStats(id: "global") {
      totalLocksCreated
    }
  }
`

interface Lock {
  id: string
  token: string
  owner: {
    id: string
  }
  amount: string
  unlockTime: string
  unlocked: boolean
  createdAt: string
  unlockedAt: string | null
}

interface LocksData {
  locks: Lock[]
  globalStats: {
    totalLocksCreated: string
  } | null
}

const ITEMS_PER_PAGE = 10

export function ViewLiquidityDialog({ isOpen, onClose }: ViewLiquidityDialogProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, error } = useQuery<LocksData>({
    queryKey: ['all-locks', currentPage],
    queryFn: async () => {
      return await request(
        subgraphUrl,
        LOCKS_QUERY,
        {
          first: ITEMS_PER_PAGE,
          skip: (currentPage - 1) * ITEMS_PER_PAGE,
        },
        subgraphHeaders
      )
    },
    enabled: isOpen,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const locks = data?.locks || []
  const totalLocks = parseInt(data?.globalStats?.totalLocksCreated || '0')
  const totalPages = Math.ceil(totalLocks / ITEMS_PER_PAGE)

  const formatAmount = (amount: string) => {
    const num = BigInt(amount)
    const divisor = BigInt(10 ** 18)
    const formatted = Number(num / divisor).toLocaleString()
    return formatted
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeRemaining = (unlockTime: string) => {
    const now = Date.now()
    const unlock = parseInt(unlockTime) * 1000
    const diff = unlock - now

    if (diff <= 0) return 'Unlocked'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  const getExplorerUrl = (address: string) => {
    return `https://explorer.monad.xyz/address/${address}`
  }

  const isLockActive = (unlockTime: string, unlocked: boolean) => {
    if (unlocked) return false
    const now = Date.now()
    const unlock = parseInt(unlockTime) * 1000
    return unlock > now
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="View All Locked Liquidity" maxWidth="4xl">
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="flex items-center justify-between rounded-lg border border-foreground/10 bg-foreground/5 p-4">
          <div>
            <p className="font-mono text-xs text-foreground/60">Total Locks</p>
            <p className="font-sans text-2xl font-light text-foreground">{totalLocks}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-foreground/60">Page</p>
            <p className="font-mono text-sm text-foreground">
              {currentPage} / {totalPages || 1}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="font-mono text-sm text-red-400">Failed to load locks. Please try again.</p>
          </div>
        ) : locks.length === 0 ? (
          <div className="rounded-lg border border-foreground/20 bg-foreground/5 p-12 text-center">
            <Lock className="mx-auto mb-4 h-12 w-12 text-foreground/20" />
            <p className="mb-2 font-mono text-sm text-foreground/60">No liquidity locks found</p>
            <p className="font-mono text-xs text-foreground/40">
              Be the first to lock liquidity
            </p>
          </div>
        ) : (
          <>
            {/* Locks Grid */}
            <div className="space-y-3">
              {locks.map((lock) => {
                const active = isLockActive(lock.unlockTime, lock.unlocked)
                return (
                  <div
                    key={lock.id}
                    className={`group rounded-lg border p-4 transition-all hover:bg-foreground/5 ${
                      active
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-foreground/20 bg-foreground/5'
                    }`}
                  >
                    <div className="grid gap-4 md:grid-cols-5">
                      {/* Lock ID & Status */}
                      <div>
                        <p className="mb-1 font-mono text-xs text-foreground/60">Lock ID</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm text-foreground">#{lock.id}</p>
                          {active ? (
                            <Lock className="h-3 w-3 text-green-400" />
                          ) : (
                            <Unlock className="h-3 w-3 text-foreground/40" />
                          )}
                        </div>
                        <p
                          className={`mt-1 font-mono text-xs ${
                            active ? 'text-green-400' : 'text-foreground/40'
                          }`}
                        >
                          {lock.unlocked ? 'Withdrawn' : active ? 'Active' : 'Unlockable'}
                        </p>
                      </div>

                      {/* Token Address */}
                      <div>
                        <p className="mb-1 font-mono text-xs text-foreground/60">LP Token</p>
                        <a
                          href={getExplorerUrl(lock.token)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-mono text-sm text-foreground transition-colors hover:text-purple-400"
                        >
                          {lock.token.slice(0, 6)}...{lock.token.slice(-4)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      {/* Amount */}
                      <div>
                        <p className="mb-1 font-mono text-xs text-foreground/60">Amount</p>
                        <p className="font-mono text-sm text-foreground">
                          {formatAmount(lock.amount)} LP
                        </p>
                      </div>

                      {/* Owner */}
                      <div>
                        <p className="mb-1 font-mono text-xs text-foreground/60">Owner</p>
                        <a
                          href={getExplorerUrl(lock.owner.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-mono text-sm text-foreground transition-colors hover:text-purple-400"
                        >
                          {lock.owner.id.slice(0, 6)}...{lock.owner.id.slice(-4)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      {/* Unlock Time */}
                      <div>
                        <p className="mb-1 font-mono text-xs text-foreground/60">Unlock Time</p>
                        <p className="font-mono text-xs text-foreground">
                          {formatDate(lock.unlockTime)}
                        </p>
                        {!lock.unlocked && (
                          <p className={`mt-1 font-mono text-xs ${active ? 'text-orange-400' : 'text-green-400'}`}>
                            {getTimeRemaining(lock.unlockTime)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-foreground/10 pt-4">
                <p className="font-mono text-xs text-foreground/60">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalLocks)} of {totalLocks}
                </p>
                <div className="flex gap-2">
                  <MagneticButton
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    variant="ghost"
                    size="sm"
                  >
                    Previous
                  </MagneticButton>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-8 w-8 rounded-lg font-mono text-xs transition-colors ${
                            currentPage === pageNum
                              ? 'bg-purple-500 text-white'
                              : 'border border-foreground/20 text-foreground hover:bg-foreground/10'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <MagneticButton
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    variant="ghost"
                    size="sm"
                  >
                    Next
                  </MagneticButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Dialog>
  )
}
