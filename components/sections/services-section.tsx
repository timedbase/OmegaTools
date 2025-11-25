"use client"

import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { CreateStandardTokenDialog } from "@/components/token/create-standard-token-dialog"
import { CreateTaxTokenDialog } from "@/components/token/create-tax-token-dialog"
import { CreateAntibotTokenDialog } from "@/components/token/create-antibot-token-dialog"
import { ManageTokensDialog } from "@/components/token/manage-tokens-dialog"

export function ServicesSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [standardDialogOpen, setStandardDialogOpen] = useState(false)
  const [taxDialogOpen, setTaxDialogOpen] = useState(false)
  const [antibotDialogOpen, setAntibotDialogOpen] = useState(false)
  const [manageDialogOpen, setManageDialogOpen] = useState(false)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-12 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Token
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Create your own token</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-x-12 md:gap-y-10 lg:gap-x-20">
          {[
            {
              title: "Create Standard Token",
              description: "Launch your own ERC20 token on Monad with customizable supply and decimals",
              direction: "top",
              onClick: () => setStandardDialogOpen(true),
            },
            {
              title: "Create Tax/Fee Tokens",
              description: "Deploy tokens with built-in transaction fees and tax mechanisms for your project",
              direction: "right",
              onClick: () => setTaxDialogOpen(true),
            },
            {
              title: "Create Anti-Bot Tokens",
              description: "Protect your token launch with anti-bot and anti-sniper protection features",
              direction: "left",
              onClick: () => setAntibotDialogOpen(true),
            },
            {
              title: "Manage Created Tokens",
              description: "Control token settings, update fees, manage ownership and renounce contracts",
              direction: "bottom",
              onClick: () => setManageDialogOpen(true),
            },
          ].map((service, i) => (
            <ServiceCard key={i} service={service} index={i} isVisible={isVisible} />
          ))}
        </div>

        <CreateStandardTokenDialog isOpen={standardDialogOpen} onClose={() => setStandardDialogOpen(false)} />
        <CreateTaxTokenDialog isOpen={taxDialogOpen} onClose={() => setTaxDialogOpen(false)} />
        <CreateAntibotTokenDialog isOpen={antibotDialogOpen} onClose={() => setAntibotDialogOpen(false)} />
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
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px w-8 bg-foreground/30 transition-all duration-300 group-hover:w-12 group-hover:bg-foreground/50" />
        <span className="font-mono text-xs text-foreground/60">0{index + 1}</span>
      </div>
      <h3 className="mb-2 font-sans text-2xl font-light text-foreground md:text-3xl">{service.title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-foreground/80 md:text-base">{service.description}</p>
    </button>
  )
}
