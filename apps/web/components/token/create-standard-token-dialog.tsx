"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"
import { useTokenFactory } from "@/hooks/use-token-factory"
import { parseUnits } from "viem"

interface CreateStandardTokenDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateStandardTokenDialog({ isOpen, onClose }: CreateStandardTokenDialogProps) {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [decimals, setDecimals] = useState("18")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const [successData, setSuccessData] = useState<{ tokenAddress: string; txHash: string } | null>(null)

  const { createToken, getExplorerUrl, getTxExplorerUrl, isConnected, isCorrectNetwork } = useTokenFactory()

  const handleCreate = async () => {
    if (!tokenName || !tokenSymbol || !totalSupply || !decimals) {
      setError("Please fill all fields")
      return
    }

    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!isCorrectNetwork) {
      setError("Please switch to Monad network")
      return
    }

    setIsCreating(true)
    setError("")

    try {
      const result = await createToken({
        name: tokenName,
        symbol: tokenSymbol,
        decimals: parseInt(decimals),
        totalSupply: BigInt(totalSupply),
      }, 'standard')

      setSuccessData({
        tokenAddress: result.tokenAddress,
        txHash: result.txHash,
      })

      // Reset form after success
      setTimeout(() => {
        setTokenName("")
        setTokenSymbol("")
        setTotalSupply("")
        setDecimals("18")
        setSuccessData(null)
      }, 10000)
    } catch (err: any) {
      setError(err.message || "Failed to create token")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Standard Token" maxWidth="lg">
      <div className="space-y-6">
        {successData ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6">
            <p className="mb-4 font-mono text-lg font-bold text-green-400">Token Created Successfully!</p>
            <div className="space-y-2 font-mono text-sm">
              <p className="text-foreground/80">
                Token Address:{" "}
                <a
                  href={getExplorerUrl(successData.tokenAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline"
                >
                  {successData.tokenAddress.slice(0, 10)}...{successData.tokenAddress.slice(-8)}
                </a>
              </p>
              <p className="text-foreground/80">
                Transaction:{" "}
                <a
                  href={getTxExplorerUrl(successData.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline"
                >
                  View on MonadScan
                </a>
              </p>
            </div>
            <MagneticButton variant="secondary" size="lg" onClick={onClose} className="mt-6 w-full">
              Close
            </MagneticButton>
          </div>
        ) : (
          <>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-mono text-sm text-foreground/60">Decimals</label>
                <input
                  type="number"
                  value={decimals}
                  onChange={(e) => setDecimals(e.target.value)}
                  placeholder="18"
                  min="0"
                  max="18"
                  className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block font-mono text-sm text-foreground/60">Total Supply</label>
                <input
                  type="number"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(e.target.value)}
                  placeholder="1000000"
                  className="w-full rounded-lg border border-foreground/30 bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
              <p className="mb-2 font-mono text-xs font-bold text-blue-400">Creation Fee</p>
              <p className="font-mono text-sm text-foreground/80">10 MONAD</p>
              <p className="mt-1 font-mono text-xs text-foreground/50">
                Fee required to deploy the token on Monad network
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
                    Decimals: <span className="text-foreground">{decimals}</span>
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <p className="font-mono text-sm text-red-400">{error}</p>
              </div>
            )}

            <MagneticButton
              variant="primary"
              size="lg"
              onClick={handleCreate}
              className="w-full"
            >
              {isCreating ? "Creating Token..." : "Create Token (10 MONAD)"}
            </MagneticButton>
          </>
        )}
      </div>
    </Dialog>
  )
}
