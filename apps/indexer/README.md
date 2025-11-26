# OmegaTools Subgraph Indexer

This subgraph indexes all OmegaTools smart contract events on the Monad blockchain, providing a GraphQL API for querying token creations, liquidity locks, and multisend transactions.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [Querying](#querying)
- [Schema](#schema)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Features

The subgraph indexes the following contracts:

- **StandardTokenFactory** (`0xE4D8cF581CaFc6E6A30DE12ebbE12EfD1EE3871a`)
- **AntiBotTokenFactory** (`0x322e4A64156E7ff5040C2e0cEa2AacAE9E83B420`)
- **LiquidityLocker** (`0xa36E03745d1dc28f5B56cb04980DB99e7c866Be4`)
- **Multisender** (`0x7789e88f8F49CC3Ca9C154591D525062A47a988C`)

### Data Tracked

- ✅ Token creations with metadata
- ✅ User activity and statistics
- ✅ Liquidity locks and unlocks
- ✅ Multisend transactions
- ✅ Factory statistics
- ✅ Global platform statistics
- ✅ Daily aggregated stats

---

## 📦 Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** (v8 or higher)
3. **The Graph CLI**
   ```bash
   npm install -g @graphprotocol/graph-cli
   ```
4. **The Graph Studio Account** (for hosted deployment)
   - Create account at https://thegraph.com/studio/

---

## 🚀 Installation

From the monorepo root:

```bash
# Install dependencies for the entire monorepo
pnpm install

# Or install only indexer dependencies
cd apps/indexer
pnpm install
```

---

## 🛠 Development

### 1. Generate Code from Schema

```bash
cd apps/indexer
pnpm codegen
```

This generates TypeScript types from your GraphQL schema and ABIs.

### 2. Build the Subgraph

```bash
pnpm build
```

This compiles your AssemblyScript mappings to WebAssembly.

### 3. Test Locally (Optional)

To run a local Graph Node for testing:

```bash
# Clone graph-node repo (one-time setup)
git clone https://github.com/graphprotocol/graph-node
cd graph-node/docker

# Start local node
docker-compose up

# In another terminal, create and deploy locally
cd apps/indexer
pnpm create-local
pnpm deploy-local
```

---

## 🌐 Deployment

### Deploy to The Graph Studio (Recommended)

1. **Authenticate with The Graph Studio**:
   ```bash
   graph auth --studio <YOUR_DEPLOY_KEY>
   ```
   Get your deploy key from https://thegraph.com/studio/

2. **Initialize Your Subgraph** (first time only):
   ```bash
   graph init --studio omegatools
   ```

3. **Deploy**:
   ```bash
   pnpm deploy
   ```

4. **Publish** (make it queryable):
   - Go to The Graph Studio dashboard
   - Click "Publish" on your subgraph
   - Follow the prompts to publish to the decentralized network

### Deploy to Hosted Service (Legacy)

1. **Authenticate**:
   ```bash
   graph auth --product hosted-service <ACCESS_TOKEN>
   ```

2. **Create Subgraph** (first time only):
   ```bash
   graph create --node https://api.thegraph.com/deploy/ <GITHUB_USERNAME>/omegatools
   ```

3. **Deploy**:
   ```bash
   pnpm deploy:hosted
   ```
   Update the script in `package.json` with your GitHub username.

---

## 🔍 Querying

### GraphQL Endpoint

After deployment, your subgraph will be available at:
- **Studio**: `https://api.studio.thegraph.com/query/<SUBGRAPH_ID>/omegatools/version/latest`
- **Hosted**: `https://api.thegraph.com/subgraphs/name/<GITHUB_USERNAME>/omegatools`

### Example Queries

#### 1. Get Recent Tokens

```graphql
query RecentTokens {
  tokens(first: 10, orderBy: createdAt, orderDirection: desc) {
    id
    name
    symbol
    tokenType
    creator {
      id
      totalTokensCreated
    }
    totalSupply
    createdAt
    creationTxHash
  }
}
```

#### 2. Get User's Tokens

```graphql
query UserTokens($userAddress: String!) {
  user(id: $userAddress) {
    id
    totalTokensCreated
    totalLocksCreated
    totalMultisends
    tokensCreated(orderBy: createdAt, orderDirection: desc) {
      id
      name
      symbol
      tokenType
      totalSupply
      createdAt
    }
  }
}
```

#### 3. Get Active Locks

```graphql
query ActiveLocks {
  locks(where: { unlocked: false }, orderBy: lockTime, orderDirection: desc) {
    id
    lockId
    owner {
      id
    }
    token
    amount
    unlockTime
    lockTime
  }
}
```

#### 4. Get Platform Statistics

```graphql
query PlatformStats {
  globalStats(id: "global") {
    totalTokens
    totalLocks
    totalMultisends
    totalUsers
    totalVolumeLocked
    totalFeesCollected
  }
}
```

#### 5. Get Daily Stats (Last 7 Days)

```graphql
query DailyStats($startDate: BigInt!) {
  dailyStats(
    where: { date_gte: $startDate }
    orderBy: date
    orderDirection: desc
    first: 7
  ) {
    date
    tokensCreated
    locksCreated
    multisends
    newUsers
    volumeLocked
    feesCollected
  }
}
```

#### 6. Get Factory Statistics

```graphql
query FactoryStats {
  factoryStats(orderBy: totalTokensCreated, orderDirection: desc) {
    id
    factoryType
    totalTokensCreated
    totalCreators
    totalFeesCollected
    lastTokenCreatedAt
  }
}
```

#### 7. Get Multisend Transactions

```graphql
query RecentMultisends {
  multisendTransactions(
    first: 20
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    sender {
      id
    }
    transactionType
    token
    totalAmount
    recipientCount
    feeCharged
    timestamp
    txHash
  }
}
```

---

## 📊 Schema

### Entities

#### User
- User wallet addresses
- Aggregated statistics (tokens created, locks, multisends)
- Activity timestamps

#### Token
- Full token metadata
- Creator information
- Token type (standard, antibot, liquidityGen, buybackBaby)
- Creation details and fees

#### Lock
- Liquidity lock details
- Lock/unlock status
- Token and amount information
- Time-based unlock tracking

#### MultisendTransaction
- Native and ERC20 multisends
- Recipient count and amounts
- Fee information

#### FactoryStats
- Per-factory statistics
- Total tokens created
- Fees collected

#### GlobalStats
- Platform-wide statistics
- Total users, tokens, locks, multisends
- Total value locked and fees

#### DailyStats
- Daily aggregated metrics
- Historical tracking
- Growth analytics

---

## 🐛 Troubleshooting

### Build Errors

**Error**: `AssemblyScript compilation failed`

**Solution**: Run `pnpm codegen` first, then `pnpm build`

### Deployment Errors

**Error**: `Invalid access token`

**Solution**: Re-authenticate with `graph auth --studio <YOUR_DEPLOY_KEY>`

**Error**: `Network 'monad' not supported`

**Solution**: The Graph might not support Monad yet. Options:
1. Deploy your own Graph Node
2. Use a different indexing solution
3. Wait for official Monad support

### Query Errors

**Error**: `Subgraph not found`

**Solution**: Wait a few minutes after deployment for the subgraph to sync

**Error**: `Entity not found`

**Solution**: The subgraph might still be syncing. Check sync status in The Graph Studio dashboard

---

## 📁 File Structure

```
apps/indexer/
├── abis/                          # Contract ABIs
│   ├── StandardTokenFactory.json
│   ├── AntiBotTokenFactory.json
│   ├── LiquidityLocker.json
│   └── Multisender.json
├── schema/                        # GraphQL schema
│   └── schema.graphql
├── src/                           # Mapping handlers
│   ├── standard-token-factory.ts
│   ├── antibot-token-factory.ts
│   ├── liquidity-locker.ts
│   └── multisender.ts
├── subgraph.yaml                  # Subgraph manifest
├── package.json
└── README.md
```

---

## 🔗 Useful Links

- **The Graph Docs**: https://thegraph.com/docs/
- **The Graph Studio**: https://thegraph.com/studio/
- **AssemblyScript Docs**: https://www.assemblyscript.org/
- **Monad Explorer**: https://monadscan.com/

---

## 📝 Notes

1. **Sync Time**: Initial sync can take several hours depending on blockchain size
2. **Query Limits**: Free tier has rate limits (see The Graph pricing)
3. **Updates**: After code changes, increment version in subgraph.yaml before redeploying
4. **Costs**: Decentralized network deployment requires GRT tokens for querying

---

## 🤝 Contributing

When making changes to the subgraph:

1. Update schema in `schema/schema.graphql`
2. Run `pnpm codegen` to regenerate types
3. Update mapping files in `src/`
4. Run `pnpm build` to compile
5. Test locally before deploying to production
6. Increment version number in `subgraph.yaml`

---

**Last Updated**: 2025-11-26
**Version**: 1.0.0
**Network**: Monad (Chain ID: 143)
