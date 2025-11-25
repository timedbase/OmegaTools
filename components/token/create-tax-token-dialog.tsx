"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"

interface CreateTaxTokenDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateTaxTokenDialog({ isOpen, onClose }: CreateTaxTokenDialogProps) {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [liquifyTax, setLiquifyTax] = useState("2")
  const [marketingTax, setMarketingTax] = useState("2")
  const [devTax, setDevTax] = useState("1")
  const [marketingWallet, setMarketingWallet] = useState("")
  const [devWallet, setDevWallet] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const totalTax = Number.parseFloat(liquifyTax || "0") + Number.parseFloat(marketingTax || "0") + Number.parseFloat(devTax || "0")

  const handleCreate = async () => {
    if (!tokenName || !tokenSymbol || !totalSupply || !marketingWallet || !devWallet) {
      alert("Please fill all fields")
      return
    }

    if (totalTax > 25) {
      alert("Total tax cannot exceed 25%")
      return
    }

    setIsCreating(true)
    // TODO: Implement actual tax token creation transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsCreating(false)
    alert("Tax token created successfully!")
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Tax/Fee Token" maxWidth="xl">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-mono text-sm text-foreground/60">Token Name</label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="e.g., My Tax Token"
              className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-sm text-foreground/60">Token Symbol</label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
              placeholder="e.g., MTT"
              className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
            />
          </div>
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
          <p className="mb-4 font-mono text-sm text-foreground">Tax Configuration</p>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-mono text-xs text-foreground/60">
                Liquify Tax (%)
              </label>
              <input
                type="number"
                value={liquifyTax}
                onChange={(e) => setLiquifyTax(e.target.value)}
                step="0.1"
                min="0"
                max="25"
                className="w-full rounded-lg border border-foreground/30 bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs text-foreground/60">
                Marketing Tax (%)
              </label>
              <input
                type="number"
                value={marketingTax}
                onChange={(e) => setMarketingTax(e.target.value)}
                step="0.1"
                min="0"
                max="25"
                className="w-full rounded-lg border border-foreground/30 bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs text-foreground/60">
                Dev Tax (%)
              </label>
              <input
                type="number"
                value={devTax}
                onChange={(e) => setDevTax(e.target.value)}
                step="0.1"
                min="0"
                max="25"
                className="w-full rounded-lg border border-foreground/30 bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-background/50 px-3 py-2">
            <span className="font-mono text-xs text-foreground/60">Total Tax:</span>
            <span className={`font-mono text-sm ${totalTax > 25 ? "text-red-400" : "text-foreground"}`}>
              {totalTax.toFixed(1)}%
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block font-mono text-sm text-foreground/60">
            Marketing Wallet Address
          </label>
          <input
            type="text"
            value={marketingWallet}
            onChange={(e) => setMarketingWallet(e.target.value)}
            placeholder="0x..."
            className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-sm text-foreground/60">
            Dev Wallet Address
          </label>
          <input
            type="text"
            value={devWallet}
            onChange={(e) => setDevWallet(e.target.value)}
            placeholder="0x..."
            className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
          />
        </div>

        <MagneticButton
          variant="primary"
          size="lg"
          onClick={handleCreate}
          className="w-full"
        >
          {isCreating ? "Creating Token..." : "Create Tax Token"}
        </MagneticButton>
      </div>
    </Dialog>
  )
}
