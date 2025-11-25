"use client"

import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { ViewLiquidityDialog } from "@/components/liquidity/view-liquidity-dialog"
import { LockLiquidityDialog } from "@/components/liquidity/lock-liquidity-dialog"
import { ManageLiquidityDialog } from "@/components/liquidity/manage-liquidity-dialog"

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [lockDialogOpen, setLockDialogOpen] = useState(false)
  const [manageDialogOpen, setManageDialogOpen] = useState(false)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-8 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-4xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Liquidity
          </h2>
          <p className="font-mono text-xs text-foreground/60 md:text-base">/ Secure your assets</p>
        </div>

        <div className="space-y-4 md:space-y-8">
          {[
            {
              number: "01",
              title: "View Locked Liquidity",
              category: "Interactive Experience",
              direction: "left",
              onClick: () => setViewDialogOpen(true),
            },
            {
              number: "02",
              title: "Lock Your Liquidity",
              category: "Secure your assets",
              direction: "right",
              onClick: () => setLockDialogOpen(true),
            },
            {
              number: "03",
              title: "Manage Liquidity",
              category: "Withdraw, extend locktime",
              direction: "left",
              onClick: () => setManageDialogOpen(true),
            },
          ].map((project, i) => (
            <ProjectCard key={i} project={project} index={i} isVisible={isVisible} />
          ))}
        </div>

        <ViewLiquidityDialog isOpen={viewDialogOpen} onClose={() => setViewDialogOpen(false)} />
        <LockLiquidityDialog isOpen={lockDialogOpen} onClose={() => setLockDialogOpen(false)} />
        <ManageLiquidityDialog isOpen={manageDialogOpen} onClose={() => setManageDialogOpen(false)} />
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: { number: string; title: string; category: string; direction: string; onClick?: () => void }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return project.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <button
      onClick={project.onClick}
      className={`group w-full border-b border-foreground/10 py-4 text-left transition-all duration-700 hover:border-foreground/20 md:py-8 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-8">
        <span className="font-mono text-xs text-foreground/30 transition-colors group-hover:text-foreground/50 md:text-base">
          {project.number}
        </span>
        <div className="flex-1">
          <h3 className="mb-1 font-sans text-xl font-light text-foreground transition-transform duration-300 group-hover:translate-x-2 md:text-3xl lg:text-4xl">
            {project.title}
          </h3>
          <p className="font-mono text-xs text-foreground/50 md:text-sm">{project.category}</p>
        </div>
      </div>
    </button>
  )
}
