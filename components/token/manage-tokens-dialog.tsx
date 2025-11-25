"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"
import { Settings, Shield, Trash2 } from "lucide-react"

interface ManageTokensDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface UserToken {
  address: string
  name: string
  symbol: string
  supply: string
  type: "standard" | "tax" | "antibot"
  isTradingEnabled?: boolean
  taxConfig?: {
    liquify: string
    marketing: string
    dev: string
  }
}

export function ManageTokensDialog({ isOpen, onClose }: ManageTokensDialogProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [newLiquifyTax, setNewLiquifyTax] = useState("")
  const [newMarketingTax, setNewMarketingTax] = useState("")
  const [newDevTax, setNewDevTax] = useState("")

  // Mock user tokens - replace with actual created tokens
  const userTokens: UserToken[] = [
    {
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      name: "My Token",
      symbol: "MTK",
      supply: "1000000",
      type: "standard",
    },
    {
      address: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
      name: "Tax Token",
      symbol: "TAX",
      supply: "500000",
      type: "tax",
      taxConfig: {
        liquify: "2",
        marketing: "2",
        dev: "1",
      },
    },
    {
      address: "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
      name: "Protected Token",
      symbol: "PROT",
      supply: "2000000",
      type: "antibot",
      isTradingEnabled: false,
    },
  ]

  const handleEnableTrading = async (tokenAddress: string) => {
    // TODO: Implement enable trading transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("Trading enabled successfully!")
  }

  const handleUpdateFees = async (tokenAddress: string) => {
    if (!newLiquifyTax && !newMarketingTax && !newDevTax) {
      alert("Please enter at least one fee to update")
      return
    }

    // TODO: Implement update fees transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("Fees updated successfully!")
  }

  const handleRenounceOwnership = async (tokenAddress: string) => {
    if (!confirm("Are you sure? This action is irreversible!")) return

    // TODO: Implement renounce ownership transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert("Ownership renounced!")
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Manage Your Tokens" maxWidth="2xl">
      <div className="space-y-4">
        {userTokens.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-mono text-sm text-foreground/60">No tokens created yet</p>
          </div>
        ) : (
          userTokens.map((token) => (
            <div
              key={token.address}
              className="rounded-lg border border-foreground/20 bg-foreground/5 p-4 md:p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="mb-1 font-sans text-lg font-light text-foreground">
                    {token.name} ({token.symbol})
                  </h3>
                  <p className="font-mono text-xs text-foreground/60">
                    {token.address.slice(0, 10)}...{token.address.slice(-8)}
                  </p>
                </div>
                <div className="rounded-full bg-foreground/10 px-3 py-1 font-mono text-xs text-foreground capitalize">
                  {token.type}
                </div>
              </div>

              <div className="mb-4 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="mb-1 font-mono text-xs text-foreground/60">Total Supply</p>
                  <p className="font-mono text-sm text-foreground">{token.supply}</p>
                </div>
                {token.type === "antibot" && (
                  <div>
                    <p className="mb-1 font-mono text-xs text-foreground/60">Trading Status</p>
                    <p
                      className={`font-mono text-sm ${
                        token.isTradingEnabled ? "text-green-400" : "text-orange-400"
                      }`}
                    >
                      {token.isTradingEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                )}
              </div>

              {/* Tax Token Fee Management */}
              {token.type === "tax" && selectedToken === token.address && (
                <div className="mb-4 rounded-lg border border-foreground/20 bg-background/50 p-4">
                  <p className="mb-3 flex items-center gap-2 font-mono text-xs text-foreground/60">
                    <Settings className="h-4 w-4" />
                    Update Fees
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block font-mono text-xs text-foreground/60">
                        Liquify (%)
                      </label>
                      <input
                        type="number"
                        value={newLiquifyTax}
                        onChange={(e) => setNewLiquifyTax(e.target.value)}
                        placeholder={token.taxConfig?.liquify}
                        className="w-full rounded-lg border border-foreground/30 bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-mono text-xs text-foreground/60">
                        Marketing (%)
                      </label>
                      <input
                        type="number"
                        value={newMarketingTax}
                        onChange={(e) => setNewMarketingTax(e.target.value)}
                        placeholder={token.taxConfig?.marketing}
                        className="w-full rounded-lg border border-foreground/30 bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block font-mono text-xs text-foreground/60">
                        Dev (%)
                      </label>
                      <input
                        type="number"
                        value={newDevTax}
                        onChange={(e) => setNewDevTax(e.target.value)}
                        placeholder={token.taxConfig?.dev}
                        className="w-full rounded-lg border border-foreground/30 bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/50 focus:outline-none"
                      />
                    </div>
                  </div>
                  <MagneticButton
                    variant="secondary"
                    size="default"
                    onClick={() => handleUpdateFees(token.address)}
                    className="mt-3 w-full"
                  >
                    Update Fees
                  </MagneticButton>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {token.type === "antibot" && !token.isTradingEnabled && (
                  <MagneticButton
                    variant="primary"
                    size="default"
                    onClick={() => handleEnableTrading(token.address)}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Enable Trading
                  </MagneticButton>
                )}

                {token.type === "tax" && (
                  <MagneticButton
                    variant="secondary"
                    size="default"
                    onClick={() =>
                      setSelectedToken(selectedToken === token.address ? null : token.address)
                    }
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {selectedToken === token.address ? "Cancel" : "Manage Fees"}
                  </MagneticButton>
                )}

                <MagneticButton
                  variant="ghost"
                  size="default"
                  onClick={() => handleRenounceOwnership(token.address)}
                  className="border border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Renounce Ownership
                </MagneticButton>
              </div>
            </div>
          ))
        )}
      </div>
    </Dialog>
  )
}
