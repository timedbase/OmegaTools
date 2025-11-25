"use client"

import { useState, useEffect } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { MagneticButton } from './magnetic-button'

interface WalletConnectButtonProps {
  variant?: "primary" | "secondary" | "ghost"
  size?: "default" | "lg"
  className?: string
}

export function WalletConnectButton({
  variant = "secondary",
  size = "default",
  className = ""
}: WalletConnectButtonProps) {
  const { open } = useAppKit()
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const [showDisconnectMenu, setShowDisconnectMenu] = useState(false)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDisconnectMenu) setShowDisconnectMenu(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showDisconnectMenu])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (account.isConnected) {
      setShowDisconnectMenu(!showDisconnectMenu)
    } else {
      open()
    }
  }

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation()
    disconnect()
    setShowDisconnectMenu(false)
  }

  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation()
    open()
    setShowDisconnectMenu(false)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="relative">
      <MagneticButton
        variant={variant}
        size={size}
        onClick={handleClick}
        className={className}
      >
        {account.isConnected && account.address ? formatAddress(account.address) : 'Connect'}
      </MagneticButton>

      {/* Disconnect Menu */}
      {showDisconnectMenu && account.isConnected && (
        <div className="absolute right-0 top-full mt-2 min-w-[200px] rounded-lg border border-foreground/20 bg-background/95 backdrop-blur-md shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2">
            <div className="mb-2 border-b border-foreground/10 px-3 py-2">
              <p className="font-mono text-xs text-foreground/60">Connected</p>
              <p className="font-mono text-sm text-foreground">{formatAddress(account.address || '')}</p>
            </div>

            <button
              onClick={handleOpenModal}
              className="w-full rounded-lg px-3 py-2 text-left font-mono text-sm text-foreground transition-colors hover:bg-foreground/10"
            >
              View Account
            </button>

            <button
              onClick={handleDisconnect}
              className="w-full rounded-lg px-3 py-2 text-left font-mono text-sm text-red-400 transition-colors hover:bg-red-500/10"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
