"use client"

import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { CreateStandardTokenDialog } from "@/components/token/create-standard-token-dialog"
import { CreateAntibotTokenDialog } from "@/components/token/create-antibot-token-dialog"
import { CreateLiquidityGenTokenDialog } from "@/components/token/create-liquidity-gen-token-dialog"
import { CreateAntiBotLiquidityGenTokenDialog } from "@/components/token/create-antibot-liquidity-gen-token-dialog"
import { CreateBuybackBabyTokenDialog } from "@/components/token/create-buyback-baby-token-dialog"
import { CreateAntiBotBuybackBabyTokenDialog } from "@/components/token/create-antibot-buyback-baby-token-dialog"
import { ManageTokensDialog } from "@/components/token/manage-tokens-dialog"

export function ServicesSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [standardDialogOpen, setStandardDialogOpen] = useState(false)
  const [antibotDialogOpen, setAntibotDialogOpen] = useState(false)
  const [liquidityGenDialogOpen, setLiquidityGenDialogOpen] = useState(false)
  const [antibotLiquidityGenDialogOpen, setAntibotLiquidityGenDialogOpen] = useState(false)
  const [buybackBabyDialogOpen, setBuybackBabyDialogOpen] = useState(false)
  const [antibotBuybackBabyDialogOpen, setAntibotBuybackBabyDialogOpen] = useState(false)
  const [manageDialogOpen, setManageDialogOpen] = useState(false)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-6 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-1 font-sans text-3xl font-light tracking-tight text-foreground md:mb-2 md:text-6xl lg:text-7xl">
            Token
          </h2>
          <p className="font-mono text-[10px] text-foreground/60 md:text-sm lg:text-base">/ Create your own token</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-10">
          {[
            {
              title: "Standard Token",
              description: "Launch your own ERC20 token on Monad with customizable supply and decimals",
              direction: "top",
              onClick: () => setStandardDialogOpen(true),
            },
            {
              title: "Anti-Bot Token",
              description: "Protect your token launch with anti-bot and anti-sniper protection features",
              direction: "top",
              onClick: () => setAntibotDialogOpen(true),
            },
            {
              title: "Liquidity Gen Token",
              description: "Auto-generate liquidity with reflection, liquidity and charity fees",
              direction: "right",
              onClick: () => setLiquidityGenDialogOpen(true),
            },
            {
              title: "AntiBot Liquidity Gen",
              description: "Combine liquidity generation with anti-bot protection for safer launches",
              direction: "right",
              onClick: () => setAntibotLiquidityGenDialogOpen(true),
            },
            {
              title: "Buyback Baby Token",
              description: "Auto-buyback and reward holders with configurable fees and marketing wallet",
              direction: "left",
              onClick: () => setBuybackBabyDialogOpen(true),
            },
            {
              title: "AntiBot Buyback Baby",
              description: "Buyback and rewards combined with anti-bot protection for maximum security",
              direction: "left",
              onClick: () => setAntibotBuybackBabyDialogOpen(true),
            },
            {
              title: "Manage Tokens",
              description: "Control token settings, update fees, manage ownership and renounce contracts",
              direction: "bottom",
              onClick: () => setManageDialogOpen(true),
            },
          ].map((service, i) => (
            <ServiceCard key={i} service={service} index={i} isVisible={isVisible} />
          ))}
        </div>

        <CreateStandardTokenDialog isOpen={standardDialogOpen} onClose={() => setStandardDialogOpen(false)} />
        <CreateAntibotTokenDialog isOpen={antibotDialogOpen} onClose={() => setAntibotDialogOpen(false)} />
        <CreateLiquidityGenTokenDialog isOpen={liquidityGenDialogOpen} onClose={() => setLiquidityGenDialogOpen(false)} />
        <CreateAntiBotLiquidityGenTokenDialog isOpen={antibotLiquidityGenDialogOpen} onClose={() => setAntibotLiquidityGenDialogOpen(false)} />
        <CreateBuybackBabyTokenDialog isOpen={buybackBabyDialogOpen} onClose={() => setBuybackBabyDialogOpen(false)} />
        <CreateAntiBotBuybackBabyTokenDialog isOpen={antibotBuybackBabyDialogOpen} onClose={() => setAntibotBuybackBabyDialogOpen(false)} />
        <ManageTokensDialog isOpen={manageDialogOpen} onClose={() => setManageDialogOpen(false)} />
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  index,
  isVisible,
}: {
  service: { title: string; description: string; direction: string; onClick?: () => void }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      switch (service.direction) {
        case "left":
          return "-translate-x-16 opacity-0"
        case "right":
          return "translate-x-16 opacity-0"
        case "top":
          return "-translate-y-16 opacity-0"
        case "bottom":
          return "translate-y-16 opacity-0"
        default:
          return "translate-y-12 opacity-0"
      }
    }
    return "translate-x-0 translate-y-0 opacity-100"
  }

  return (
    <button
      onClick={service.onClick}
      className={`group text-left transition-all duration-700 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="mb-2 flex items-center gap-2 md:mb-3 md:gap-3">
        <div className="h-px w-6 bg-foreground/30 transition-all duration-300 group-hover:w-10 group-hover:bg-foreground/50 md:w-8 md:group-hover:w-12" />
        <span className="font-mono text-[10px] text-foreground/60 md:text-xs">0{index + 1}</span>
      </div>
      <h3 className="mb-1 font-sans text-lg font-light text-foreground md:mb-2 md:text-2xl lg:text-3xl">{service.title}</h3>
      <p className="max-w-sm text-xs leading-relaxed text-foreground/80 md:text-sm lg:text-base">{service.description}</p>
    </button>
  )
}
