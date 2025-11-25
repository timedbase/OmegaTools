"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"

interface CreateStandardTokenDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateStandardTokenDialog({ isOpen, onClose }: CreateStandardTokenDialogProps) {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!tokenName || !tokenSymbol || !totalSupply) {
      alert("Please fill all fields")
      return
    }

    setIsCreating(true)
    // TODO: Implement actual token creation transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsCreating(false)
    alert("Token created successfully!")
    onClose()
    // Reset form
    setTokenName("")
    setTokenSymbol("")
    setTotalSupply("")
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Standard Token" maxWidth="lg">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block font-mono text-sm text-foreground/60">Token Name</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="e.g., My Token"
            className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-sm text-foreground/60">Token Symbol</label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
            placeholder="e.g., MTK"
            className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-sm text-foreground/60">Total Supply</label>
          <input
            type="number"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            placeholder="e.g., 1000000"
            className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
          />
          <p className="mt-1 font-mono text-xs text-foreground/50">
            Total supply will be minted to your wallet
          </p>
        </div>

        {tokenName && tokenSymbol && totalSupply && (
          <div className="rounded-lg border border-foreground/20 bg-foreground/5 p-4">
            <p className="mb-2 font-mono text-xs text-foreground/60">Token Summary</p>
            <div className="space-y-1 font-mono text-sm">
              <p className="text-foreground/80">
                Name: <span className="text-foreground">{tokenName}</span>
              </p>
              <p className="text-foreground/80">
                Symbol: <span className="text-foreground">{tokenSymbol}</span>
              </p>
              <p className="text-foreground/80">
                Supply: <span className="text-foreground">{totalSupply}</span>
              </p>
              <p className="text-foreground/80">
                Decimals: <span className="text-foreground">18</span>
              </p>
            </div>
          </div>
        )}

        <MagneticButton
          variant="primary"
          size="lg"
          onClick={handleCreate}
          className="w-full"
        >
          {isCreating ? "Creating Token..." : "Create Token"}
        </MagneticButton>
      </div>
    </Dialog>
  )
}
