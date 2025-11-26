# Quick Start Guide

## 🚀 Getting Started (First Time Setup)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
```bash
cd apps/web
cp .env.local.example .env.local
# Edit .env.local with your WalletConnect Project ID
```

### 3. Start Development Server
```bash
# From root
pnpm dev

# Or from web directory
cd apps/web
pnpm dev
```

Visit http://localhost:3000

---

## 📝 Common Commands

### Development
```bash
# Start web app
pnpm dev                    # From root
cd apps/web && pnpm dev     # From web directory

# Build web app
pnpm build:web

# Lint code
pnpm lint
```

### Indexer (The Graph)
```bash
cd apps/indexer

# Generate types from schema
pnpm codegen

# Build subgraph
pnpm build

# Deploy to The Graph Studio
graph auth --studio <YOUR_KEY>
pnpm deploy
```

### Contracts
```bash
cd packages/contracts

# Build contracts
forge build

# Run tests
forge test
```

---

## 📂 Project Structure

```
apps/
├── web/              # Main web application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── lib/          # Utilities & GraphQL client
│   └── hooks/        # Custom React hooks
│
└── indexer/          # The Graph subgraph
    ├── schema/       # GraphQL schema
    ├── src/          # Mapping handlers
    └── abis/         # Contract ABIs
```

---

## 🔗 Contract Addresses (Monad Network)

All addresses documented in [INTEGRATION.md](INTEGRATION.md)

| Contract | Address |
|----------|---------|
| Standard Token Factory | `0xE4D8cF581CaFc6E6A30DE12ebbE12EfD1EE3871a` |
| AntiBot Token Factory | `0x322e4A64156E7ff5040C2e0cEa2AacAE9E83B420` |
| Liquidity Locker | `0xa36E03745d1dc28f5B56cb04980DB99e7c866Be4` |
| Multisender | `0x7789e88f8F49CC3Ca9C154591D525062A47a988C` |

---

## 🎯 Using The Graph Indexer

### 1. Deploy Subgraph
```bash
cd apps/indexer
graph auth --studio <YOUR_DEPLOY_KEY>
pnpm deploy
```

### 2. Get Subgraph URL
After deployment, copy the query URL from The Graph Studio

### 3. Update Web App
```bash
# In apps/web/.env.local
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/<ID>/omegatools/version/latest
```

### 4. Query in React Components
```typescript
import { querySubgraph, GET_PLATFORM_STATS } from '@/lib/graphql'

const data = await querySubgraph(GET_PLATFORM_STATS)
```

---

## 🧩 Example Components

### Display Platform Statistics
```typescript
import { PlatformStats } from '@/components/platform-stats'

export default function Dashboard() {
  return <PlatformStats />
}
```

### Display User's Tokens
```typescript
import { UserTokensList } from '@/components/user-tokens-list'

export default function MyTokens() {
  return <UserTokensList />
}
```

---

## 🐛 Troubleshooting

### Dependencies Won't Install
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Dev Server Won't Start
```bash
cd apps/web
rm -rf .next
pnpm dev
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
pnpm dev
```

### GraphQL Queries Fail
1. Check subgraph is deployed and synced
2. Verify `NEXT_PUBLIC_SUBGRAPH_URL` in `.env.local`
3. Test query in The Graph Studio playground

---

## 📚 Documentation

- **Monorepo Setup**: [MONOREPO_SETUP.md](MONOREPO_SETUP.md)
- **Integration Guide**: [INTEGRATION.md](INTEGRATION.md)
- **Indexer Guide**: [apps/indexer/README.md](apps/indexer/README.md)
- **Main README**: [README.md](README.md)

---

## 🔗 Links

- **Website**: https://omegatools.dev
- **Docs**: https://docs.omegatools.dev
- **Explorer**: https://monadscan.com
- **The Graph Studio**: https://thegraph.com/studio
- **Twitter**: https://twitter.com/OmegaToolx

---

**Need Help?** Check the full documentation in [README.md](README.md)
