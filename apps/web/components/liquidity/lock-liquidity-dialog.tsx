"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"
import { useLiquidityLocker, useERC20Token } from "@/hooks/use-liquidity-locker"
import { formatUnits } from "viem"

interface LockLiquidityDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function LockLiquidityDialog({ isOpen, onClose }: LockLiquidityDialogProps) {
  const [selectedToken, setSelectedToken] = useState<`0x${string}` | "">("")
  const [amount, setAmount] = useState("")
  const [lockDuration, setLockDuration] = useState("30")
  const [isLocking, setIsLocking] = useState(false)
  const [customTokenAddress, setCustomTokenAddress] = useState("")

  const { lockLiquidity, lockFee } = useLiquidityLocker()
  const { balance, symbol, decimals, formattedBalance } = useERC20Token(
    selectedToken ? selectedToken : undefined
  )

  const handleLock = async () => {
    if (!selectedToken || !amount || !lockDuration) {
      alert("Please fill all fields")
      return
    }

    try {
      setIsLocking(true)
      const tx = await lockLiquidity(selectedToken, amount, Number(lockDuration))
      alert("Liquidity locked successfully!")
      onClose()
    } catch (error: any) {
      console.error("Error locking liquidity:", error)
      alert(error.message || "Failed to lock liquidity")
    } finally {
      setIsLocking(false)
    }
  }

  const handleAddCustomToken = () => {
    if (customTokenAddress && customTokenAddress.startsWith("0x") && customTokenAddress.length === 42) {
      setSelectedToken(customTokenAddress as `0x${string}`)
      setCustomTokenAddress("")
    } else {
      alert("Please enter a valid token address")
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Lock Your Liquidity" maxWidth="lg">
      <div className="space-y-6">
        {/* LP Token Selection */}
        <div>
          <label className="mb-2 block font-mono text-sm text-foreground/60">LP Token Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTokenAddress}
              onChange={(e) => setCustomTokenAddress(e.target.value)}
              placeholder="0x..."
              className="flex-1 rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
            />
            <MagneticButton
              variant="secondary"
              size="default"
              onClick={handleAddCustomToken}
            >
              Add
            </MagneticButton>
          </div>
          {selectedToken && (
            <div className="mt-2 rounded-lg border border-foreground/20 bg-foreground/5 p-3">
              <p className="font-mono text-xs text-foreground/60">Selected Token</p>
              <p className="font-mono text-sm text-foreground">
                {selectedToken.slice(0, 10)}...{selectedToken.slice(-8)}
              </p>
              {symbol && (
                <p className="font-mono text-xs text-foreground/60 mt-1">
                  Symbol: {symbol} | Balance: {formattedBalance}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="mb-2 block font-mono text-sm text-foreground/60">Amount to Lock</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
            />
            {selectedToken && formattedBalance && (
              <button
                onClick={() => setAmount(formattedBalance)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-foreground/10 px-3 py-1 font-mono text-xs text-foreground transition-colors hover:bg-foreground/20"
              >
                MAX
              </button>
            )}
          </div>
        </div>

        {/* Lock Duration */}
        <div>
          <label className="mb-2 block font-mono text-sm text-foreground/60">
            Lock Duration (days)
          </label>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {["30", "90", "180", "365"].map((days) => (
              <button
                key={days}
                onClick={() => setLockDuration(days)}
                className={`rounded-lg border px-3 py-2 font-mono text-sm transition-all ${
                  lockDuration === days
                    ? "border-foreground/50 bg-foreground/10 text-foreground"
                    : "border-foreground/20 text-foreground/60 hover:border-foreground/30"
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
          <input
            type="number"
            value={lockDuration}
            onChange={(e) => setLockDuration(e.target.value)}
            placeholder="Custom days"
            className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
          />
        </div>

        {/* Lock Summary */}
        {selectedToken && amount && lockDuration && (
          <div className="rounded-lg border border-foreground/20 bg-foreground/5 p-4">
            <p className="mb-2 font-mono text-xs text-foreground/60">Lock Summary</p>
            <div className="space-y-1 font-mono text-sm">
              <p className="text-foreground/80">
                Amount: <span className="text-foreground">{amount} {symbol || 'LP'}</span>
              </p>
              <p className="text-foreground/80">
                Duration: <span className="text-foreground">{lockDuration} days</span>
              </p>
              <p className="text-foreground/80">
                Unlock Date:{" "}
                <span className="text-foreground">
                  {new Date(Date.now() + Number.parseInt(lockDuration) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </p>
              {lockFee && (
                <p className="text-foreground/80">
                  Lock Fee: <span className="text-foreground">{formatUnits(lockFee, 18)} MON</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Lock Button */}
        <MagneticButton
          variant="primary"
          size="lg"
          onClick={handleLock}
          className="w-full"
        >
          {isLocking ? "Locking..." : "Lock Liquidity"}
        </MagneticButton>
      </div>
    </Dialog>
  )
}
