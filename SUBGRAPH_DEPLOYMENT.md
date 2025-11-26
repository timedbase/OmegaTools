# Subgraph Deployment - OmegaTools

## ✅ Deployment Complete

The OmegaTools subgraph has been successfully deployed to The Graph Studio!

### Deployment Details

- **Subgraph Name**: omega-tools
- **Version**: v0.1.0
- **Network**: Monad (Chain ID: 143)
- **IPFS Hash**: QmRv8sDiB4RKuQWhuXqDAFebqfbcBaCBGPtD3eiHQoKNF2

### GraphQL Endpoint

```
https://api.studio.thegraph.com/query/1716126/omega-tools/v0.1.0
```

### Studio Dashboard

```
https://thegraph.com/studio/subgraph/omega-tools
```

## 📊 Indexed Contracts

The subgraph indexes events from all 8 OmegaTools contracts:

1. **StandardTokenFactory** - `0xE4D8cF581CaFc6E6A30DE12ebbE12EfD1EE3871a`
2. **AntiBotTokenFactory** - `0x322e4A64156E7ff5040C2e0cEa2AacAE9E83B420`
3. **LiquidityGenTokenFactory** - `0x68C1F787610E5311C48A634DB2DFCd5D007064db`
4. **AntiBotLiquidityGenFactory** - `0x45fCE82e66a2e453B7E89aE9C8835f1c3DB7f725`
5. **BuybackBabyTokenFactory** - `0xeBEe683f60840AF5Cb71E7f60c296888D343154C`
6. **AntiBotBuybackBabyFactory** - `0x36a172246ee20ab48523812e3d413fe09d807b64`
7. **LiquidityLocker** - `0xa36E03745d1dc28f5B56cb04980DB99e7c866Be4`
8. **Multisender** - `0x7789e88f8F49CC3Ca9C154591D525062A47a988C`

## 🔍 Queryable Entities

The subgraph exposes the following entities for querying:

### Token
- id: Token address
- name, symbol, decimals, totalSupply
- tokenType: standard | antibot | liquidityGen | antiBotLiquidityGen | buybackBaby | antiBotBuybackBaby
- creator: User address
- factory: Factory address
- createdAt, createdAtBlock
- transactionHash

### User
- id: Wallet address
- totalTokensCreated
- totalLocksCreated
- totalMultisends
- tokens: [Token]
- locks: [Lock]
- multisends: [MultisendTransaction]

### Lock
- id: Lock ID
- token: Token address
- owner: User address
- amount, unlockTime
- unlocked: boolean
- createdAt, unlockedAt

### MultisendTransaction
- id: Transaction hash
- sender: User address
- tokenAddress (null for native)
- isNative: boolean
- totalAmount, recipientCount, feeCharged
- timestamp

### GlobalStats
- id: "global"
- totalTokensCreated, totalLocksCreated, totalMultisends
- totalFeesPaid
- lastUpdated

### FactoryStats
- id: Factory address
- factoryType
- totalTokensCreated, totalFeesCollected
- lastUpdated

### DailyStats
- id: "day-{timestamp}"
- date
- tokensCreated, locksCreated, multisends
- activeUsers, feesPaid

## 📝 Example Queries

### Get Recent Tokens

```graphql
query GetRecentTokens {
  tokens(first: 10, orderBy: createdAt, orderDirection: desc) {
    id
    name
    symbol
    tokenType
    creator {
      id
    }
    createdAt
    transactionHash
  }
}
```

### Get User's Created Tokens

```graphql
query GetUserTokens($userAddress: String!) {
  user(id: $userAddress) {
    id
    totalTokensCreated
    tokens {
      id
      name
      symbol
      tokenType
      createdAt
    }
  }
}
```

### Get Platform Statistics

```graphql
query GetPlatformStats {
  globalStats(id: "global") {
    totalTokensCreated
    totalLocksCreated
    totalMultisends
    totalFeesPaid
  }
  factoryStats {
    factoryType
    totalTokensCreated
    totalFeesCollected
  }
}
```

### Get Active Locks

```graphql
query GetActiveLocks {
  locks(where: { unlocked: false }, orderBy: unlockTime) {
    id
    token
    owner {
      id
    }
    amount
    unlockTime
    createdAt
  }
}
```

### Get Daily Statistics

```graphql
query GetDailyStats($days: Int = 7) {
  dailyStats(first: $days, orderBy: date, orderDirection: desc) {
    date
    tokensCreated
    locksCreated
    multisends
    activeUsers
    feesPaid
  }
}
```

## 🔄 Deployment Commands

### Build & Deploy New Version

```bash
# Navigate to indexer directory
cd apps/indexer

# Generate types
pnpm run codegen

# Build subgraph
pnpm run build

# Deploy to Studio
pnpm exec graph deploy --studio omega-tools --version-label v0.2.0
```

### Authentication

```bash
pnpm exec graph auth --studio <YOUR_DEPLOY_KEY>
```

## 🌐 Frontend Integration

The web app is already configured to use the deployed subgraph:

**Environment Variable** (`.env.local`):
```env
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/1716126/omega-tools/v0.1.0
```

**GraphQL Client** ([apps/web/lib/graphql/client.ts](../apps/web/lib/graphql/client.ts)):
```typescript
import { GraphQLClient } from 'graphql-request'

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL!
export const graphQLClient = new GraphQLClient(SUBGRAPH_URL)
```

**Pre-built Queries** ([apps/web/lib/graphql/queries.ts](../apps/web/lib/graphql/queries.ts)):
- GET_RECENT_TOKENS
- GET_USER_TOKENS
- GET_USER_LOCKS
- GET_PLATFORM_STATS
- GET_DAILY_STATS
- GET_FACTORY_STATS
- GET_TOKEN_DETAILS

## 📊 Monitoring

Monitor your subgraph performance:
- **Sync Status**: Check if indexing is up to date
- **Query Performance**: Monitor query response times
- **Error Logs**: Review any indexing errors
- **API Keys**: Manage API keys for production use

Visit the dashboard: https://thegraph.com/studio/subgraph/omega-tools

## 🚀 Next Steps

1. ✅ Subgraph deployed and syncing
2. ✅ Frontend configured with endpoint
3. ⏳ Wait for initial sync (may take a few minutes)
4. 🔄 Test queries in the playground
5. 🎨 Build UI components to display indexed data

## 📚 Resources

- **The Graph Docs**: https://thegraph.com/docs/
- **GraphQL Playground**: https://thegraph.com/studio/subgraph/omega-tools/playground
- **Subgraph Schema**: [apps/indexer/schema/schema.graphql](../apps/indexer/schema/schema.graphql)
- **Mapping Code**: [apps/indexer/src/](../apps/indexer/src/)

---

**Deployed**: 2025-11-26
**Status**: ✅ Live on The Graph Studio
