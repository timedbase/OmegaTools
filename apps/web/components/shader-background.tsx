"use client"

import { useEffect, useState } from "react"

export function ShaderBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-background will-change-transform">
      <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] animate-blob rounded-full bg-[var(--primary)] opacity-30 mix-blend-screen blur-[80px] filter will-change-transform" />
      <div className="animation-delay-2000 absolute -right-[10%] top-[20%] h-[40%] w-[40%] animate-blob rounded-full bg-[var(--accent)] opacity-30 mix-blend-screen blur-[80px] filter will-change-transform" />
      <div className="animation-delay-4000 absolute -bottom-[10%] left-[20%] h-[50%] w-[50%] animate-blob rounded-full bg-purple-500 opacity-20 mix-blend-screen blur-[80px] filter will-change-transform" />
    </div>
  )
}
