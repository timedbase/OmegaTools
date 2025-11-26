# Monorepo Setup Complete ✅

## What Was Created

The project has been successfully restructured into a monorepo with the following workspaces:

### 📂 Structure

```
OmegaTools/
├── apps/
│   ├── web/              ✅ Next.js web application (migrated from root)
│   └── indexer/          ✅ The Graph subgraph (NEW)
├── packages/
│   └── contracts/        ✅ Foundry contracts workspace (NEW)
├── INTEGRATION.md        ✅ Contract addresses & ABIs (existing)
├── README.md             ✅ Monorepo documentation (NEW)
├── pnpm-workspace.yaml   ✅ Workspace configuration (NEW)
└── package.json          ✅ Root package.json (UPDATED)
```

---

## ✅ Completed Tasks

### 1. Monorepo Configuration
- ✅ Created `pnpm-workspace.yaml`
- ✅ Updated root `package.json` with workspace scripts
- ✅ Updated `.gitignore` for monorepo structure

### 2. Web App Migration (`apps/web/`)
- ✅ Moved all Next.js files to `apps/web/`
- ✅ Created `apps/web/package.json`
- ✅ Added GraphQL client dependencies (`graphql`, `graphql-request`)
- ✅ Created GraphQL client (`lib/graphql/client.ts`)
- ✅ Created GraphQL queries (`lib/graphql/queries.ts`)
- ✅ Created example components:
  - `components/platform-stats.tsx` - Display global platform statistics
  - `components/user-tokens-list.tsx` - Display user's created tokens
- ✅ Created `.env.local.example`

### 3. Indexer Setup (`apps/indexer/`)
- ✅ Created complete subgraph configuration
- ✅ Created schema (`schema/schema.graphql`) with 7 entities:
  - User
  - Token
  - Lock
  - MultisendTransaction
  - FactoryStats
  - GlobalStats
  - DailyStats
- ✅ Created ABIs for ALL 8 contracts:
  - StandardTokenFactory
  - AntiBotTokenFactory
  - LiquidityGenTokenFactory
  - AntiBotLiquidityGenFactory
  - BuybackBabyTokenFactory
  - AntiBotBuybackBabyFactory
  - LiquidityLocker
  - Multisender
- ✅ Created mapping handlers for all contracts
- ✅ Created utility functions (`src/utils.ts`)
- ✅ Created comprehensive README with deployment guide
- ✅ Created `package.json` with Graph CLI scripts

### 4. Contracts Workspace (`packages/contracts/`)
- ✅ Created Foundry configuration (`foundry.toml`)
- ✅ Created directory structure
- ✅ Created `package.json` with Foundry scripts

### 5. Documentation
- ✅ Created root README.md
- ✅ Created indexer README.md
- ✅ Maintained INTEGRATION.md (existing)

---

## 🚀 Next Steps

### 1. Install Dependencies

```bash
# From root directory
pnpm install
```

This will install dependencies for all workspaces.

### 2. Set Up Environment Variables

```bash
# For web app
cd apps/web
cp .env.local.example .env.local
# Edit .env.local with your values
```

### 3. Start Development

```bash
# From root
pnpm dev              # Starts web app

# Or from specific workspace
cd apps/web
pnpm dev

# Build indexer
cd apps/indexer
pnpm codegen
pnpm build
```

### 4. Deploy Indexer to The Graph

```bash
cd apps/indexer

# 1. Create subgraph in The Graph Studio
# Visit https://thegraph.com/studio/

# 2. Authenticate
graph auth --studio <YOUR_DEPLOY_KEY>

# 3. Deploy
pnpm deploy
```

### 5. Update Web App with Subgraph URL

After deploying the indexer, update `apps/web/.env.local`:
```
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/<YOUR_SUBGRAPH_ID>/omegatools/version/latest
```

### 6. Use GraphQL in Web App

The web app now has example components showing how to query the indexer:

```typescript
// Example: Display platform stats
import { PlatformStats } from '@/components/platform-stats'

export default function Page() {
  return (
    <div>
      <PlatformStats />
    </div>
  )
}
```

```typescript
// Example: Display user's tokens
import { UserTokensList } from '@/components/user-tokens-list'

export default function Page() {
  return (
    <div>
      <UserTokensList />
    </div>
  )
}
```

---

## 📊 Indexer Features

The subgraph indexes:

### All 8 OmegaTools Contracts ✅
1. **StandardTokenFactory** (`0xE4D8cF581CaFc6E6A30DE12ebbE12EfD1EE3871a`)
2. **AntiBotTokenFactory** (`0x322e4A64156E7ff5040C2e0cEa2AacAE9E83B420`)
3. **LiquidityGenTokenFactory** (`0x68C1F787610E5311C48A634DB2DFCd5D007064db`)
4. **AntiBotLiquidityGenFactory** (`0x45fCE82e66a2e453B7E89aE9C8835f1c3DB7f725`)
5. **BuybackBabyTokenFactory** (`0xeBEe683f60840AF5Cb71E7f60c296888D343154C`)
6. **AntiBotBuybackBabyFactory** (`0x36a172246ee20ab48523812e3d413fe09d807b64`)
7. **LiquidityLocker** (`0xa36E03745d1dc28f5B56cb04980DB99e7c866Be4`)
8. **Multisender** (`0x7789e88f8F49CC3Ca9C154591D525062A47a988C`)

### Data Tracked
- ✅ All token creations with full metadata
- ✅ User activity and statistics
- ✅ Liquidity locks and unlocks
- ✅ Multisend transactions (native + ERC20)
- ✅ Per-factory statistics
- ✅ Global platform statistics
- ✅ Daily aggregated metrics

---

## 🎯 Available GraphQL Queries

See `apps/web/lib/graphql/queries.ts` for all available queries:

- `GET_RECENT_TOKENS` - Get recently created tokens
- `GET_USER_TOKENS` - Get all tokens created by a user
- `GET_USER_LOCKS` - Get all locks created by a user
- `GET_ACTIVE_LOCKS` - Get all active (not unlocked) locks
- `GET_PLATFORM_STATS` - Get global platform statistics
- `GET_DAILY_STATS` - Get daily aggregated statistics
- `GET_FACTORY_STATS` - Get statistics per factory
- `GET_USER_MULTISENDS` - Get multisend transactions by user
- `GET_RECENT_MULTISENDS` - Get recent multisend transactions
- `GET_TOKEN_DETAILS` - Get detailed information about a specific token

---

## 📝 Important Files

### Indexer
- `apps/indexer/subgraph.yaml` - Subgraph manifest with all contract configurations
- `apps/indexer/schema/schema.graphql` - GraphQL schema
- `apps/indexer/abis/*.json` - Contract ABIs
- `apps/indexer/src/*.ts` - Event mapping handlers

### Web App
- `apps/web/lib/graphql/client.ts` - GraphQL client setup
- `apps/web/lib/graphql/queries.ts` - All GraphQL queries
- `apps/web/components/platform-stats.tsx` - Example component
- `apps/web/components/user-tokens-list.tsx` - Example component

---

## 🐛 Troubleshooting

### Web App Won't Start
1. Ensure you're in the correct directory: `cd apps/web`
2. Install dependencies: `pnpm install`
3. Check Node version: `node -v` (must be 18+)

### Indexer Build Fails
1. Run codegen first: `pnpm codegen`
2. Then build: `pnpm build`
3. Check that all ABI files are present

### GraphQL Queries Return No Data
1. Ensure subgraph is deployed and synced
2. Check subgraph URL in `.env.local`
3. Verify contract addresses in `subgraph.yaml`

---

## 📚 Additional Resources

- **The Graph Docs**: https://thegraph.com/docs/
- **Monad Explorer**: https://monadscan.com/
- **Integration Guide**: See `INTEGRATION.md` in root

---

**Created**: 2025-11-26
**Status**: ✅ Complete and ready for deployment
