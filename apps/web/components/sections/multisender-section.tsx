"use client"

import { useReveal } from "@/hooks/use-reveal"
import { useState, useMemo } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import { useMultisender, type Recipient } from "@/hooks/use-multisender"
import { useERC20Token } from "@/hooks/use-liquidity-locker"
import { formatUnits } from "viem"

export function MultisenderSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [assetType, setAssetType] = useState<"native" | "erc20">("native")
  const [tokenAddress, setTokenAddress] = useState("")
  const [recipients, setRecipients] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { multisendNative, multisendToken, feePerRecipient, maxRecipients, calculateFee } =
    useMultisender()

  const tokenAddressTyped = tokenAddress as `0x${string}` | undefined
  const { decimals, symbol } = useERC20Token(
    assetType === "erc20" && tokenAddress ? tokenAddressTyped : undefined
  )

  const parsedRecipients = useMemo(() => {
    try {
      return recipients
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [address, amount] = line.split(",").map((s) => s.trim())
          if (!address || !amount) throw new Error("Invalid format")
          return { address, amount }
        })
    } catch {
      return []
    }
  }, [recipients])

  const totalFee = useMemo(() => {
    return calculateFee(parsedRecipients.length)
  }, [parsedRecipients.length, calculateFee])

  const handleSend = async () => {
    if (!recipients.trim()) {
      alert("Please add recipients")
      return
    }

    if (parsedRecipients.length === 0) {
      alert("Invalid recipient format. Use: address,amount (one per line)")
      return
    }

    if (maxRecipients && parsedRecipients.length > Number(maxRecipients)) {
      alert(`Maximum ${maxRecipients} recipients allowed`)
      return
    }

    if (assetType === "erc20") {
      if (!tokenAddress.trim()) {
        alert("Please enter token address")
        return
      }
      if (!decimals) {
        alert("Unable to read token decimals. Please check the token address.")
        return
      }
    }

    try {
      setIsSubmitting(true)

      if (assetType === "native") {
        await multisendNative(parsedRecipients)
      } else {
        await multisendToken(tokenAddress as `0x${string}`, parsedRecipients, decimals || 18)
      }

      alert("Transaction sent successfully!")
      setRecipients("")
    } catch (error: any) {
      console.error("Error sending:", error)
      alert(error.message || "Failed to send tokens")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={ref}
      className="flex min-h-screen w-screen shrink-0 snap-start items-center px-4 py-20 md:px-12 md:py-24 lg:px-16"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div
          className={`mb-8 transition-all duration-700 md:mb-12 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Multisender
          </h2>
          <p className="font-mono text-xs text-foreground/60 md:text-base">/ Send tokens to multiple addresses</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Asset Type Selection */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <label className="mb-3 block font-mono text-xs text-foreground/60 md:text-sm">Asset Type</label>
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => setAssetType("native")}
                className={`flex-1 rounded-lg border px-4 py-3 font-mono text-sm transition-all md:px-6 md:py-4 md:text-base ${
                  assetType === "native"
                    ? "border-foreground/50 bg-foreground/10 text-foreground"
                    : "border-foreground/20 bg-transparent text-foreground/60 hover:border-foreground/30"
                }`}
              >
                Native MON
              </button>
              <button
                onClick={() => setAssetType("erc20")}
                className={`flex-1 rounded-lg border px-4 py-3 font-mono text-sm transition-all md:px-6 md:py-4 md:text-base ${
                  assetType === "erc20"
                    ? "border-foreground/50 bg-foreground/10 text-foreground"
                    : "border-foreground/20 bg-transparent text-foreground/60 hover:border-foreground/30"
                }`}
              >
                ERC20 Token
              </button>
            </div>
          </div>

          {/* Token Address (only for ERC20) */}
          {assetType === "erc20" && (
            <div
              className={`transition-all duration-700 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
              }`}
              style={{ transitionDelay: "350ms" }}
            >
              <label className="mb-2 block font-mono text-xs text-foreground/60 md:text-sm">Token Address</label>
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="w-full rounded-lg border border-foreground/30 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:px-6 md:py-4 md:text-base"
                placeholder="0x..."
              />
            </div>
          )}

          {/* Recipients Input */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <label className="mb-2 block font-mono text-xs text-foreground/60 md:text-sm">
              Recipients (one per line: address,amount)
            </label>
            <textarea
              rows={8}
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="w-full rounded-lg border border-foreground/30 bg-transparent px-4 py-3 font-mono text-xs text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none md:px-6 md:py-4 md:text-sm"
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,100&#10;0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed,50&#10;0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C,75"
            />
            <p className="mt-2 font-mono text-xs text-foreground/50">
              Format: address,amount (one per line)
            </p>
          </div>

          {/* Summary */}
          {parsedRecipients.length > 0 && (
            <div
              className={`rounded-lg border border-foreground/20 bg-foreground/5 p-4 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <p className="mb-2 font-mono text-xs text-foreground/60">Summary</p>
              <div className="space-y-1 font-mono text-sm">
                <p className="text-foreground/80">
                  Recipients: <span className="text-foreground">{parsedRecipients.length}</span>
                  {maxRecipients && (
                    <span className="text-foreground/60"> / {maxRecipients.toString()}</span>
                  )}
                </p>
                {assetType === "erc20" && symbol && (
                  <p className="text-foreground/80">
                    Token: <span className="text-foreground">{symbol}</span>
                  </p>
                )}
                <p className="text-foreground/80">
                  Service Fee: <span className="text-foreground">
                    {totalFee > 0 ? `${formatUnits(totalFee, 18)} MON` : 'Loading...'}
                  </span>
                </p>
                {feePerRecipient && (
                  <p className="text-foreground/80">
                    Per Recipient: <span className="text-foreground">{formatUnits(feePerRecipient, 18)} MON</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Send Button */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
            style={{ transitionDelay: "650ms" }}
          >
            <MagneticButton
              variant="primary"
              size="lg"
              className="w-full disabled:opacity-50"
              onClick={handleSend}
            >
              {isSubmitting ? "Sending..." : `Send ${assetType === "native" ? "MON" : "Tokens"}`}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  )
}
