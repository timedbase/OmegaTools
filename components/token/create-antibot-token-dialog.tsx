"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"
import { Shield } from "lucide-react"

interface CreateAntibotTokenDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateAntibotTokenDialog({ isOpen, onClose }: CreateAntibotTokenDialogProps) {
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
    // TODO: Implement actual anti-bot token creation transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsCreating(false)
    alert("Anti-Bot token created successfully! Remember to enable trading when ready.")
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Anti-Bot Token" maxWidth="lg">
      <div className="space-y-6">
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 shrink-0 text-blue-400" />
            <div>
              <p className="mb-1 font-mono text-sm font-medium text-blue-400">Anti-Bot Protection</p>
              <p className="font-mono text-xs text-foreground/80">
                This token will be launched with trading disabled. Only the owner (you) can send tokens
                until you enable trading. This prevents bots from sniping your token launch.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block font-mono text-sm text-foreground/60">Token Name</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="e.g., My Protected Token"
            className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-sm text-foreground/60">Token Symbol</label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
            placeholder="e.g., MPT"
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
        </div>

        <div className="rounded-lg border border-foreground/20 bg-foreground/5 p-4">
          <p className="mb-3 font-mono text-xs text-foreground/60">How it works:</p>
          <ul className="space-y-2 font-mono text-xs text-foreground/80">
            <li className="flex gap-2">
              <span className="text-foreground/60">1.</span>
              <span>Token is created with trading disabled</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground/60">2.</span>
              <span>Only you (owner) can send tokens</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground/60">3.</span>
              <span>Anyone can receive tokens</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground/60">4.</span>
              <span>Add liquidity and distribute tokens safely</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground/60">5.</span>
              <span>Enable trading when ready (via Manage Tokens)</span>
            </li>
          </ul>
        </div>

        <MagneticButton
          variant="primary"
          size="lg"
          onClick={handleCreate}
          className="w-full"
        >
          {isCreating ? "Creating Token..." : "Create Anti-Bot Token"}
        </MagneticButton>
      </div>
    </Dialog>
  )
}
