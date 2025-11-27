"use client"

import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { ShaderBackground } from "@/components/shader-background"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { MultisenderSection } from "@/components/sections/multisender-section"
import { MagneticButton } from "@/components/magnetic-button"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { Footer } from "@/components/footer"
import { PlatformStatsHome } from "@/components/platform-stats-home"
import { useRef, useEffect, useState } from "react"

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const scrollThrottleRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Set loaded immediately since we're not using shader background
    setIsLoaded(true)
  }, [])

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 3) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "auto",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection <= 3) {
          setCurrentSection(newSection)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection <= 3) {
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      {/* <ShaderBackground /> */}

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-4 transition-opacity duration-700 md:px-12 md:py-6 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-foreground/25 md:h-10 md:w-10">
            <span className="font-sans text-lg font-bold text-foreground md:text-xl">Ω</span>
          </div>
          <span className="font-sans text-lg font-semibold tracking-tight text-foreground md:text-xl">OmegaTools</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {["Home", "Liquidity", "Token", "Multisender"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === index ? "text-foreground" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                  currentSection === index ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <WalletConnectButton variant="secondary" />
        </div>
      </nav>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hero Section */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-end px-4 pb-20 pt-20 md:px-12 md:pb-24 md:pt-24">
          <div className="max-w-3xl">
            <div className="mb-3 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-foreground/20 bg-foreground/15 px-3 py-1 backdrop-blur-md duration-700 md:mb-4 md:px-4 md:py-1.5">
              <p className="font-mono text-[10px] text-foreground/90 md:text-xs">Live on Monad</p>
            </div>
            <h1 className="mb-4 animate-in fade-in slide-in-from-bottom-8 font-sans text-4xl font-light leading-[1.15] tracking-tight text-foreground duration-1000 sm:text-5xl md:mb-6 md:text-7xl lg:text-8xl">
              <span className="text-balance">
                Your complete
                <br />
                DeFi toolkit
              </span>
            </h1>
            <p className="mb-6 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-base leading-relaxed text-foreground/90 duration-1000 delay-200 md:mb-8 md:text-lg lg:text-xl">
              <span className="text-pretty">
                Lock liquidity, create tokens, and manage your DeFi assets with ease on Monad blockchain.
                Professional tools built for the community.
              </span>
            </p>
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-3 duration-1000 delay-300 sm:flex-row sm:items-center sm:gap-4">
              <MagneticButton
                size="default"
                variant="primary"
                onClick={() => scrollToSection(1)}
                className="w-full sm:w-auto md:!px-8 md:!py-3.5 md:!text-base"
              >
                Get Started
              </MagneticButton>
              <MagneticButton
                size="default"
                variant="secondary"
                onClick={() => window.open("https://t.me/TradeonOmegaBot", "_blank")}
                className="w-full sm:w-auto md:!px-8 md:!py-3.5 md:!text-base"
              >
                Omega TradingBot
              </MagneticButton>
            </div>

            {/* Platform Stats */}
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 md:mt-12">
              <div className="mb-3 md:mb-4">
                <p className="font-mono text-[10px] text-foreground/60 md:text-xs">Platform Statistics</p>
              </div>
              <PlatformStatsHome />
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-in fade-in duration-1000 delay-700 md:block">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-foreground/80">Scroll to explore</p>
              <div className="flex h-6 w-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/15 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/80" />
              </div>
            </div>
          </div>
        </section>

        <WorkSection />
        <ServicesSection />
        <MultisenderSection />
      </div>

      <Footer />

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
