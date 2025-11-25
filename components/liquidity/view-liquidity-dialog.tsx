"use client"

import { useState, useEffect } from "react"
import { Dialog } from "@/components/ui/dialog"
import { useReadContract } from "wagmi"
import { LIQUIDITY_LOCKER_ADDRESS, LIQUIDITY_LOCKER_ABI } from "@/lib/contracts/liquidity-locker"
import { formatUnits } from "viem"

interface ViewLiquidityDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ViewLiquidityDialog({ isOpen, onClose }: ViewLiquidityDialogProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [locks, setLocks] = useState<any[]>([])
  const itemsPerPage = 5

  // Get total lock count
  const { data: totalLockCount } = useReadContract({
    address: LIQUIDITY_LOCKER_ADDRESS,
    abi: LIQUIDITY_LOCKER_ABI,
    functionName: 'erc20LockCount',
  })

  // Fetch lock details for visible page
  useEffect(() => {
    const fetchLocks = async () => {
      if (!totalLockCount) return

      const startId = (currentPage - 1) * itemsPerPage
      const endId = Math.min(startId + itemsPerPage, Number(totalLockCount))
      const lockPromises = []

      for (let i = startId; i < endId; i++) {
        lockPromises.push(
          fetch(`/api/lock/${i}`).catch(() => null) // Placeholder - would use readContract
        )
      }

      // For now, we'll generate sample data based on lock count
      const sampleLocks = Array.from({ length: endId - startId }, (_, i) => ({
        id: startId + i,
        token: `0x${(startId + i).toString(16).padStart(40, '0')}`,
        owner: `0x${Math.random().toString(16).slice(2, 42)}`,
        amount: (Math.random() * 1000).toFixed(2),
        unlockTime: Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000,
        withdrawn: false,
      }))

      setLocks(sampleLocks)
    }

    if (isOpen) {
      fetchLocks()
    }
  }, [isOpen, currentPage, totalLockCount])

  const totalPages = totalLockCount ? Math.ceil(Number(totalLockCount) / itemsPerPage) : 1
  const startIndex = (currentPage - 1) * itemsPerPage

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="View Locked Liquidity" maxWidth="2xl">
      <div className="space-y-4">
        {locks.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-mono text-sm text-foreground/60">
              {totalLockCount === BigInt(0) ? 'No locks found' : 'Loading...'}
            </p>
          </div>
        ) : (
          locks.map((lock) => (
            <LockCard key={lock.id} lock={lock} />
          ))
        )}

        {/* Pagination */}
        {totalLockCount && Number(totalLockCount) > 0 && (
          <div className="flex items-center justify-between border-t border-foreground/10 pt-4">
            <p className="font-mono text-xs text-foreground/60">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, Number(totalLockCount))} of{" "}
              {Number(totalLockCount)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-foreground/20 px-3 py-1 font-mono text-sm text-foreground transition-colors hover:bg-foreground/10 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-foreground/20 px-3 py-1 font-mono text-sm text-foreground transition-colors hover:bg-foreground/10 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}

function LockCard({ lock }: { lock: any }) {
  const { data: lockDetails } = useReadContract({
    address: LIQUIDITY_LOCKER_ADDRESS,
    abi: LIQUIDITY_LOCKER_ABI,
    functionName: 'getERC20LockDetails',
    args: [BigInt(lock.id)],
  })

  if (!lockDetails) return null

  const [token, owner, amount, unlockTime, withdrawn] = lockDetails

  return (
    <div className="rounded-lg border border-foreground/20 bg-foreground/5 p-4 transition-colors hover:border-foreground/30">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="mb-1 font-mono text-xs text-foreground/60">LP Token</p>
          <p className="font-mono text-sm text-foreground">
            {token.slice(0, 10)}...{token.slice(-8)}
          </p>
        </div>
        <div>
          <p className="mb-1 font-mono text-xs text-foreground/60">Amount</p>
          <p className="font-mono text-sm text-foreground">
            {formatUnits(amount, 18)} LP
          </p>
        </div>
        <div>
          <p className="mb-1 font-mono text-xs text-foreground/60">Owner</p>
          <p className="font-mono text-sm text-foreground">
            {owner.slice(0, 10)}...{owner.slice(-8)}
          </p>
        </div>
        <div>
          <p className="mb-1 font-mono text-xs text-foreground/60">Unlock Date</p>
          <p className="font-mono text-sm text-foreground">
            {new Date(Number(unlockTime) * 1000).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="mb-1 font-mono text-xs text-foreground/60">Status</p>
          <p className={`font-mono text-sm ${withdrawn ? 'text-foreground/50' : 'text-green-400'}`}>
            {withdrawn ? 'Withdrawn' : 'Active'}
          </p>
        </div>
      </div>
    </div>
  )
}
