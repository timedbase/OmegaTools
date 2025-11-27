"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"
import { ShieldCheck } from "lucide-react"
import { useTokenFactory } from "@/hooks/use-token-factory"

interface CreateAntiBotLiquidityGenTokenDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateAntiBotLiquidityGenTokenDialog({ isOpen, onClose }: CreateAntiBotLiquidityGenTokenDialogProps) {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [decimals, setDecimals] = useState("18")
  const [charityWallet, setCharityWallet] = useState("")
  const [router, setRouter] = useState("")
  const [maxTxPercent, setMaxTxPercent] = useState("50")
  const [maxWalletPercent, setMaxWalletPercent] = useState("100")
  const [maxAntiWhalePercent, setMaxAntiWhalePercent] = useState("5")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  const [successData, setSuccessData] = useState<{ tokenAddress: string; txHash: string } | null>(null)

  const { createToken, getExplorerUrl, getTxExplorerUrl, isConnected, isCorrectNetwork } = useTokenFactory()

  const handleCreate = async () => {
    if (!tokenName || !tokenSymbol || !totalSupply || !decimals || !charityWallet || !router) {
      setError("Please fill all required fields")
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
        charityWallet: charityWallet as `0x${string}`,
        router: router as `0x${string}`,
        maxTxPercent: parseInt(maxTxPercent),
        maxWalletPercent: parseInt(maxWalletPercent),
        maxAntiWhalePercent: parseInt(maxAntiWhalePercent),
      }, 'antiBotLiquidityGen')

      setSuccessData({
        tokenAddress: result.tokenAddress,
        txHash: result.txHash,
      })

      setTimeout(() => {
        setTokenName("")
        setTokenSymbol("")
        setTotalSupply("")
        setDecimals("18")
        setCharityWallet("")
        setRouter("")
        setMaxTxPercent("50")
        setMaxWalletPercent("100")
        setMaxAntiWhalePercent("5")
        setSuccessData(null)
      }, 10000)
    } catch (err: any) {
      setError(err.message || "Failed to create token")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create AntiBot Liquidity Gen Token" maxWidth="lg">
      <div className="space-y-6">
        {successData ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6">
            <p className="mb-4 font-mono text-lg font-bold text-green-400">AntiBot Liquidity Gen Token Created!</p>
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
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-mono text-sm text-foreground/80">Token Name</label>
                <input
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="My Protected Liquidity Token"
                  className="w-full rounded-lg border border-foreground/20 bg-background/50 px-4 py-2.5 font-mono text-sm text-foreground backdrop-blur-sm focus:border-foreground/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-sm text-foreground/80">Token Symbol</label>
                <input
                  type="text"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  placeholder="APLIQ"
                  className="w-full rounded-lg border border-foreground/20 bg-background/50 px-4 py-2.5 font-mono text-sm text-foreground backdrop-blur-sm focus:border-foreground/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block font-mono text-sm text-foreground/80">Total Supply</label>
                  <input
                    type="text"
                    value={totalSupply}
                    onChange={(e) => setTotalSupply(e.target.value)}
                    placeholder="1000000"
                    className="w-full rounded-lg border border-foreground/20 bg-background/50 px-4 py-2.5 font-mono text-sm text-foreground backdrop-blur-sm focus:border-foreground/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-mono text-sm text-foreground/80">Decimals</label>
                  <input
                    type="number"
                    value={decimals}
                    onChange={(e) => setDecimals(e.target.value)}
                    placeholder="18"
                    className="w-full rounded-lg border border-foreground/20 bg-background/50 px-4 py-2.5 font-mono text-sm text-foreground backdrop-blur-sm focus:border-foreground/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-mono text-sm text-foreground/80">Charity Wallet Address</label>
                <input
                  type="text"
                  value={charityWallet}
                  onChange={(e) => setCharityWallet(e.target.value)}
                  placeholder="0x..."
                  className="w-full rounded-lg border border-foreground/20 bg-background/50 px-4 py-2.5 font-mono text-sm text-foreground backdrop-blur-sm focus:border-foreground/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-sm text-foreground/80">Router Address</label>
                <input
                  type="text"
                  value={router}
                  onChange={(e) => setRouter(e.target.value)}
                  placeholder="0x... (Uniswap V2 Router)"
                  className="w-full rounded-lg border border-foreground/20 bg-background/50 px-4 py-2.5 font-mono text-sm text-foreground backdrop-blur-sm focus:border-foreground/40 focus:outline-none"
                />
              </div>

              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-4">
                <p className="mb-3 font-mono text-xs text-foreground/60">Anti-Bot Protection (in tenths of percent)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/70">Max TX %</label>
                    <input
                      type="number"
                      value={maxTxPercent}
                      onChange={(e) => setMaxTxPercent(e.target.value)}
                      placeholder="50"
                      className="w-full rounded border border-foreground/20 bg-background/50 px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/70">Max Wallet %</label>
                    <input
                      type="number"
                      value={maxWalletPercent}
                      onChange={(e) => setMaxWalletPercent(e.target.value)}
                      placeholder="100"
                      className="w-full rounded border border-foreground/20 bg-background/50 px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/70">Anti-Whale %</label>
                    <input
                      type="number"
                      value={maxAntiWhalePercent}
                      onChange={(e) => setMaxAntiWhalePercent(e.target.value)}
                      placeholder="5"
                      className="w-full rounded border border-foreground/20 bg-background/50 px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/40 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <p className="font-mono text-xs text-blue-400">
                  Creation Fee: 10 MONAD • Combines liquidity generation with bot protection
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <p className="font-mono text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <MagneticButton
                onClick={handleCreate}
                disabled={isCreating}
                className="flex-1"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                {isCreating ? "Creating..." : "Create AntiBot Liquidity Gen Token"}
              </MagneticButton>

              <MagneticButton
                onClick={onClose}
                variant="secondary"
                disabled={isCreating}
              >
                Cancel
              </MagneticButton>
            </div>
          </>
        )}
      </div>
    </Dialog>
  )
}
