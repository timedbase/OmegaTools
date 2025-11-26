# OmegaTools Monorepo

Complete DeFi toolkit for Monad blockchain - Lock liquidity, create tokens, and multisend with ease.

## 📁 Project Structure

```
OmegaTools/
├── apps/
│   ├── web/                    # Next.js web application
│   └── indexer/                # The Graph subgraph indexer
├── packages/
│   └── contracts/              # Smart contracts (Foundry)
├── INTEGRATION.md              # Contract addresses and ABIs
├── pnpm-workspace.yaml         # Monorepo configuration
└── package.json                # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **pnpm** 8+
- **Foundry** (for contracts, optional)

### Installation

```bash
# Install all dependencies
pnpm install
```

### Development

```bash
# Run web app
pnpm dev

# Run specific workspace
pnpm --filter web dev
pnpm --filter indexer build

# Run all tests
pnpm test
```

## 📦 Workspaces

### apps/web

Next.js 15 web application with:
- Token creation (6 different factory types)
- Liquidity locking
- Multisender
- Wallet integration (WalletConnect, MetaMask, Coinbase)
- The Graph indexer integration for on-chain data

**Tech Stack:**
- Next.js 15.5.6
- React 19
- wagmi v3 + viem v2
- Tailwind CSS v4
- shadcn/ui components

**Commands:**
```bash
cd apps/web
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
```

### apps/indexer

The Graph subgraph that indexes all OmegaTools smart contracts:
- StandardTokenFactory
- AntiBotTokenFactory
- LiquidityGenTokenFactory
- AntiBotLiquidityGenFactory
- BuybackBabyTokenFactory
- AntiBotBuybackBabyFactory
- LiquidityLocker
- Multisender

**Commands:**
```bash
cd apps/indexer
pnpm codegen      # Generate types from schema
pnpm build        # Build subgraph
pnpm deploy       # Deploy to The Graph Studio
```

**See [apps/indexer/README.md](apps/indexer/README.md) for full documentation.**

### packages/contracts

Smart contract workspace (Foundry setup).

**Commands:**
```bash
cd packages/contracts
forge build       # Compile contracts
forge test        # Run tests
```

## 🔗 Smart Contracts

All contract addresses and ABIs are documented in [INTEGRATION.md](INTEGRATION.md).

### Deployed Contracts on Monad

| Contract | Address |
|----------|---------|
| Liquidity Locker | `0xa36E03745d1dc28f5B56cb04980DB99e7c866Be4` |
| Multisender | `0x7789e88f8F49CC3Ca9C154591D525062A47a988C` |
| Standard Token Factory | `0xE4D8cF581CaFc6E6A30DE12ebbE12EfD1EE3871a` |
| AntiBot Token Factory | `0x322e4A64156E7ff5040C2e0cEa2AacAE9E83B420` |
| Liquidity Gen Factory | `0x68C1F787610E5311C48A634DB2DFCd5D007064db` |
| AntiBot Liquidity Gen Factory | `0x45fCE82e66a2e453B7E89aE9C8835f1c3DB7f725` |
| Buyback Baby Factory | `0xeBEe683f60840AF5Cb71E7f60c296888D343154C` |
| AntiBot Buyback Baby Factory | `0x36a172246ee20ab48523812e3d413fe09d807b64` |

## 📊 Features

### Token Creation
Create 6 types of tokens with different features:
- **Standard Token**: Basic ERC20 with customizable supply
- **AntiBot Token**: Protection against bot trading
- **Liquidity Generation Token**: Auto-liquidity + charity fees
- **AntiBot Liquidity Gen**: Combines antibot + liquidity generation
- **Buyback Baby Token**: Reward token holders with buybacks
- **AntiBot Buyback Baby**: Combines antibot + buyback rewards

### Liquidity Locking
- Lock ERC20 tokens with time-based unlock
- Lock ERC721 NFTs
- View all locks on-chain via indexer

### Multisender
- Send native MONAD to multiple addresses
- Send ERC20 tokens to multiple addresses
- Equal or custom amounts per recipient

## 🛠 Development

### Adding a New Workspace

1. Create directory in `apps/` or `packages/`
2. Add `package.json` with workspace name
3. Run `pnpm install` from root

### Environment Variables

#### Web App (.env.local)
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_SUBGRAPH_URL=your_subgraph_url
```

#### Indexer
No environment variables needed for development.

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start web dev server |
| `pnpm dev:web` | Start web app |
| `pnpm dev:indexer` | Start indexer (N/A - use build) |
| `pnpm build` | Build all workspaces |
| `pnpm build:web` | Build web app |
| `pnpm build:indexer` | Build subgraph |
| `pnpm build:contracts` | Build contracts |
| `pnpm test` | Run all tests |
| `pnpm test:contracts` | Test contracts |
| `pnpm lint` | Lint all workspaces |
| `pnpm clean` | Clean all build artifacts |

## 🚢 Deployment

### Web App (Vercel)

```bash
cd apps/web
pnpm build
# Deploy to Vercel
```

Or connect your GitHub repo to Vercel for auto-deployment.

### Indexer (The Graph)

1. Create subgraph in [The Graph Studio](https://thegraph.com/studio/)
2. Get deploy key
3. Deploy:
   ```bash
   cd apps/indexer
   graph auth --studio <DEPLOY_KEY>
   pnpm deploy
   ```

See full guide in [apps/indexer/README.md](apps/indexer/README.md).

## 📖 Documentation

- **Integration Guide**: [INTEGRATION.md](INTEGRATION.md)
- **Indexer Guide**: [apps/indexer/README.md](apps/indexer/README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🔍 Querying On-Chain Data

The web app uses The Graph to query on-chain data:

```typescript
import { querySubgraph, GET_RECENT_TOKENS } from '@/lib/graphql'

// Get recent tokens
const data = await querySubgraph(GET_RECENT_TOKENS, { first: 10 })
```

All GraphQL queries are in [apps/web/lib/graphql/queries.ts](apps/web/lib/graphql/queries.ts).

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## 🐛 Troubleshooting

### pnpm install fails

Try:
```bash
pnpm install --no-frozen-lockfile
```

### Web app won't start

1. Check Node version (must be 18+)
2. Delete `.next` and `node_modules`, reinstall
3. Check for port 3000 conflicts

### Subgraph deployment fails

1. Ensure you're authenticated: `graph auth --studio <KEY>`
2. Check network is supported
3. Verify contract addresses in `subgraph.yaml`

## 🔗 Links

- **Monad Explorer**: https://monadscan.com/
- **The Graph Studio**: https://thegraph.com/studio/
- **Website**: https://omegatools.dev
- **Docs**: https://docs.omegatools.dev
- **Twitter**: https://twitter.com/OmegaToolx

## 📄 License

See individual workspace licenses.

---

**Last Updated**: 2025-11-26
**Version**: 1.0.0
**Network**: Monad (Chain ID: 143)
