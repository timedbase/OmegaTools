"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { MagneticButton } from "@/components/magnetic-button"
import { Droplets } from "lucide-react"
import { useTokenFactory } from "@/hooks/use-token-factory"

interface CreateLiquidityGenTokenDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateLiquidityGenTokenDialog({ isOpen, onClose }: CreateLiquidityGenTokenDialogProps) {
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [decimals, setDecimals] = useState("18")
  const [reflectionFee, setReflectionFee] = useState("20")
  const [liquidityFee, setLiquidityFee] = useState("30")
  const [charityFee, setCharityFee] = useState("10")
  const [charityWallet, setCharityWallet] = useState("")
  const [router, setRouter] = useState("")
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

    // Validate total fees don't exceed 25%
    const totalFees = parseInt(reflectionFee) + parseInt(liquidityFee) + parseInt(charityFee)
    if (totalFees > 250) {
      setError("Total fees cannot exceed 25% (250 in tenths of percent)")
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
        reflectionFee: parseInt(reflectionFee),
        liquidityFee: parseInt(liquidityFee),
        charityFee: parseInt(charityFee),
        charityWallet: charityWallet as `0x${string}`,
        router: router as `0x${string}`,
      }, 'liquidityGen')

      setSuccessData({
        tokenAddress: result.tokenAddress,
        txHash: result.txHash,
      })

      setTimeout(() => {
        setTokenName("")
        setTokenSymbol("")
        setTotalSupply("")
        setDecimals("18")
        setReflectionFee("20")
        setLiquidityFee("30")
        setCharityFee("10")
        setCharityWallet("")
        setRouter("")
        setSuccessData(null)
      }, 10000)
    } catch (err: any) {
      setError(err.message || "Failed to create token")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Liquidity Generation Token" maxWidth="lg">
      <div className="space-y-6">
        {successData ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6">
            <p className="mb-4 font-mono text-lg font-bold text-green-400">Liquidity Gen Token Created!</p>
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
                  placeholder="My Liquidity Token"
                  className="w-full rounded-lg border border-foreground/20 bg-background/50 px-4 py-2.5 font-mono text-sm text-foreground backdrop-blur-sm focus:border-foreground/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-sm text-foreground/80">Token Symbol</label>
                <input
                  type="text"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  placeholder="LIQT"
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

              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-4">
                <p className="mb-3 font-mono text-xs text-foreground/60">Fee Configuration (in tenths of percent: 10 = 1%)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/70">Reflection Fee</label>
                    <input
                      type="number"
                      value={reflectionFee}
                      onChange={(e) => setReflectionFee(e.target.value)}
                      placeholder="20"
                      className="w-full rounded border border-foreground/20 bg-background/50 px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/70">Liquidity Fee</label>
                    <input
                      type="number"
                      value={liquidityFee}
                      onChange={(e) => setLiquidityFee(e.target.value)}
                      placeholder="30"
                      className="w-full rounded border border-foreground/20 bg-background/50 px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs text-foreground/70">Charity Fee</label>
                    <input
                      type="number"
                      value={charityFee}
                      onChange={(e) => setCharityFee(e.target.value)}
                      placeholder="10"
                      className="w-full rounded border border-foreground/20 bg-background/50 px-3 py-2 font-mono text-sm text-foreground focus:border-foreground/40 focus:outline-none"
                    />
                  </div>
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

              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <p className="font-mono text-xs text-blue-400">
                  Creation Fee: 10 MONAD • Max Total Fees: 25%
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
                <Droplets className="mr-2 h-4 w-4" />
                {isCreating ? "Creating..." : "Create Liquidity Gen Token"}
              </MagneticButton>

              <MagneticButton
                onClick={onClose}
                variant="outline"
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
