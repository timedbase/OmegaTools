"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"
import { Clock } from "lucide-react"
import { useLiquidityLocker, useLockDetails } from "@/hooks/use-liquidity-locker"
import { formatUnits } from "viem"

interface ManageLiquidityDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ManageLiquidityDialog({ isOpen, onClose }: ManageLiquidityDialogProps) {
  const [extendDays, setExtendDays] = useState<{ [key: string]: string }>({})
  const [isProcessing, setIsProcessing] = useState<{ [key: string]: boolean }>({})

  const { userLockIds, withdrawLiquidity, extendLock, refetchUserLocks } = useLiquidityLocker()

  const getTimeLeft = (unlockTime: bigint) => {
    const now = Math.floor(Date.now() / 1000)
    const diff = Number(unlockTime) - now

    if (diff <= 0) return "Unlocked"

    const days = Math.floor(diff / (24 * 60 * 60))
    const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60))

    return `${days}d ${hours}h`
  }

  const handleWithdraw = async (lockId: bigint) => {
    const lockIdStr = lockId.toString()
    try {
      setIsProcessing({ ...isProcessing, [lockIdStr]: true })
      await withdrawLiquidity(lockId)
      alert("Liquidity withdrawn successfully!")
      await refetchUserLocks()
    } catch (error: any) {
      console.error("Error withdrawing liquidity:", error)
      alert(error.message || "Failed to withdraw liquidity")
    } finally {
      setIsProcessing({ ...isProcessing, [lockIdStr]: false })
    }
  }

  const handleExtend = async (lockId: bigint) => {
    const lockIdStr = lockId.toString()
    const days = extendDays[lockIdStr]
    if (!days || Number.parseInt(days) <= 0) {
      alert("Please enter valid days")
      return
    }

    try {
      setIsProcessing({ ...isProcessing, [lockIdStr]: true })
      await extendLock(lockId, Number.parseInt(days))
      alert(`Lock extended by ${days} days!`)
      await refetchUserLocks()
    } catch (error: any) {
      console.error("Error extending lock:", error)
      alert(error.message || "Failed to extend lock")
    } finally {
      setIsProcessing({ ...isProcessing, [lockIdStr]: false })
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Manage Your Liquidity" maxWidth="xl">
      <div className="space-y-4">
        {!userLockIds || userLockIds.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-mono text-sm text-foreground/60">No locked liquidity found</p>
          </div>
        ) : (
          userLockIds.map((lockId) => (
            <LockCard
              key={lockId.toString()}
              lockId={lockId}
              extendDays={extendDays}
              setExtendDays={setExtendDays}
              handleWithdraw={handleWithdraw}
              handleExtend={handleExtend}
              getTimeLeft={getTimeLeft}
              isProcessing={isProcessing}
            />
          ))
        )}
      </div>
    </Dialog>
  )
}

interface LockCardProps {
  lockId: bigint
  extendDays: { [key: string]: string }
  setExtendDays: (days: { [key: string]: string }) => void
  handleWithdraw: (lockId: bigint) => void
  handleExtend: (lockId: bigint) => void
  getTimeLeft: (unlockTime: bigint) => string
  isProcessing: { [key: string]: boolean }
}

function LockCard({
  lockId,
  extendDays,
  setExtendDays,
  handleWithdraw,
  handleExtend,
  getTimeLeft,
  isProcessing,
}: LockCardProps) {
  const { lockDetails, isWithdrawable } = useLockDetails(lockId)

  if (!lockDetails) return null

  const [token, owner, amount, unlockTime, withdrawn] = lockDetails
  const lockIdStr = lockId.toString()

  return (
    <div className="rounded-lg border border-foreground/20 bg-foreground/5 p-4 md:p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-1 font-sans text-lg font-light text-foreground">
            LP Token #{lockIdStr}
          </h3>
          <p className="font-mono text-xs text-foreground/60">
            {token.slice(0, 10)}...{token.slice(-8)}
          </p>
        </div>
        <div
          className={`rounded-full px-3 py-1 font-mono text-xs ${
            withdrawn
              ? "bg-foreground/20 text-foreground/50"
              : isWithdrawable
                ? "bg-green-500/20 text-green-400"
                : "bg-orange-500/20 text-orange-400"
          }`}
        >
          {withdrawn ? "Withdrawn" : isWithdrawable ? "Unlocked" : "Locked"}
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <div>
          <p className="mb-1 font-mono text-xs text-foreground/60">Amount</p>
          <p className="font-mono text-sm text-foreground">{formatUnits(amount, 18)} LP</p>
        </div>
        <div>
          <p className="mb-1 font-mono text-xs text-foreground/60">Unlock Date</p>
          <p className="font-mono text-sm text-foreground">
            {new Date(Number(unlockTime) * 1000).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="mb-1 font-mono text-xs text-foreground/60">Time Left</p>
          <p className="flex items-center gap-1 font-mono text-sm text-foreground">
            <Clock className="h-3 w-3" />
            {getTimeLeft(unlockTime)}
          </p>
        </div>
      </div>

      {!withdrawn && (
        <div className="flex flex-col gap-2 md:flex-row">
          {isWithdrawable ? (
            <MagneticButton
              variant="primary"
              size="default"
              onClick={() => handleWithdraw(lockId)}
              className="flex-1"
            >
              {isProcessing[lockIdStr] ? "Withdrawing..." : "Withdraw"}
            </MagneticButton>
          ) : (
            <div className="flex flex-1 gap-2">
              <input
                type="number"
                value={extendDays[lockIdStr] || ""}
                onChange={(e) =>
                  setExtendDays({ ...extendDays, [lockIdStr]: e.target.value })
                }
                placeholder="Days to extend"
                className="flex-1 rounded-lg border border-foreground/30 bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
              />
              <MagneticButton
                variant="secondary"
                size="default"
                onClick={() => handleExtend(lockId)}
              >
                {isProcessing[lockIdStr] ? "Extending..." : "Extend Lock"}
              </MagneticButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
