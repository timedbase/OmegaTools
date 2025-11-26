# OmegaTools Interface

> Complete DeFi toolkit for Monad blockchain - Lock liquidity, create tokens, and multisend with ease

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Wagmi](https://img.shields.io/badge/Wagmi-3.0-purple)](https://wagmi.sh/)

## 🚀 Features

### 💧 Liquidity Locker
- Lock ERC20 LP tokens with customizable time periods
- Withdraw liquidity after unlock time expires
- Extend lock duration for existing locks
- View all locks or filter by user
- Real-time lock status tracking

### 🪙 Token Creator
- **Standard Token**: Basic ERC20 token with custom supply
- **Tax Token**: Built-in trading fees (liquify, marketing, dev)
- **Anti-Bot Token**: Owner-controlled trading activation
- Manage created tokens (update fees, enable trading, renounce ownership)

### 📤 Multisender (V2)
- Send native MON or ERC20 tokens to multiple addresses
- Support for variable or equal amounts
- **Fee**: 1 MON per recipient
- Atomic fee transfers to treasury
- Max 200 recipients per transaction
- Support for EIP-2612 permit (gasless approvals)

## 🌐 Live Contracts (Monad Mainnet)

| Contract | Address | Explorer |
|----------|---------|----------|
| Liquidity Locker | `0x28a6fe6AEfd6AA7E2476440a6088f844f89b78a5` | [View](https://explorer.monad.xyz/address/0x28a6fe6AEfd6AA7E2476440a6088f844f89b78a5) |
| MultisenderV2 | `0x494BB03fA823520486D7f8f802428B1cFf94cdE7` | [View](https://explorer.monad.xyz/address/0x494BB03fA823520486D7f8f802428B1cFf94cdE7) |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed contract information.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5.6 (App Router), React 19.2.0
- **Styling**: Tailwind CSS 4.1.9
- **Web3**: Wagmi 3.0.1, Viem 2.40.0
- **Wallet**: WalletConnect (Reown AppKit 1.8.14)
- **UI Components**: Radix UI, Lucide Icons
- **Animations**: Custom shaders, magnetic buttons
- **Blockchain**: Monad (EVM-compatible)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/omegatools/omegatools-interface.git
cd omegatools-interface

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your WalletConnect Project ID
```

## 🚀 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔑 Environment Variables

Create a `.env.local` file:

```env
# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── liquidity/         # Liquidity locker dialogs
│   ├── token/             # Token creator dialogs
│   ├── sections/          # Page sections
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts (Web3Provider)
├── hooks/                 # Custom React hooks
│   ├── use-liquidity-locker.ts
│   └── use-multisender.ts
├── lib/                   # Utility libraries
│   ├── contracts/         # Contract ABIs and addresses
│   └── web3-config.ts     # Wagmi configuration
├── Contracts/             # Solidity smart contracts
│   ├── LiquidityLocker.sol
│   └── MultisenderV2.sol
└── public/                # Static assets
```

## 🎨 Features Overview

### Liquidity Locker
Lock your LP tokens to build trust and prevent rug pulls. Features include:
- Customizable lock periods (30, 90, 180, 365 days or custom)
- View all locks with pagination
- Manage your locks (withdraw or extend)
- Lock fee displayed in real-time

### Token Creator
Create professional ERC20 tokens with advanced features:
- **Standard**: Simple ERC20 with fixed supply
- **Tax**: Automatic trading fees with customizable percentages
- **Anti-Bot**: Launch protection with owner-controlled trading

### Multisender
Efficiently distribute tokens to multiple wallets:
- Batch send to up to 200 addresses
- CSV-style input (address,amount)
- Real-time fee calculation
- Support for both native MON and any ERC20 token

## 🔗 Supported Wallets

- MetaMask
- Zerion
- Rabby Wallet
- OKX Wallet
- Coinbase Wallet
- WalletConnect compatible wallets

## 🌍 Network

**Monad Blockchain**
- Chain ID: `41454`
- RPC: `https://rpc.monad.xyz`
- Explorer: `https://explorer.monad.xyz`
- Native Token: MON

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- Website: [OmegaTools.dev](https://Omegatools.dev)
- Trading Bot: [@TradeonOmegaBot](https://t.me/TradeonOmegaBot)
- GitHub: [OmegaTools](https://github.com/omegatools)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Wallet integration via [Reown AppKit](https://reown.com/)
- Smart contracts powered by [Solidity](https://soliditylang.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)

---

**Made with Ω by the OmegaTools Team**
