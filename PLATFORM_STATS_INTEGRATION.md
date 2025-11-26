# Platform Stats Integration - Complete

## ✅ Implementation Complete

Real-time platform statistics from The Graph subgraph are now displayed on the OmegaTools homepage!

### What Was Implemented

#### 1. TanStack Query Setup
Added React Query (TanStack Query) for optimal data fetching with SSR support:

- **Providers** ([apps/web/app/providers.tsx](apps/web/app/providers.tsx))
  - Client-side query client with proper SSR handling
  - 60-second stale time to reduce unnecessary refetches
  - Separate query clients for server/browser

- **Layout Integration** ([apps/web/app/layout.tsx](apps/web/app/layout.tsx))
  - Wrapped app with `Providers` component
  - Maintains existing Web3Provider and Analytics

#### 2. GraphQL Client Updates
Enhanced the GraphQL client to support production API keys:

**File**: [apps/web/lib/graphql/client.ts](apps/web/lib/graphql/client.ts)

```typescript
// Auto-detects production vs development URL
const SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL ||          // Production
  process.env.NEXT_PUBLIC_SUBGRAPH_URL_DEV ||      // Development
  'https://api.studio.thegraph.com/...'            // Fallback

// Adds API key if available
const headers = API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}
```

#### 3. Platform Stats Component
Created a beautiful, real-time stats dashboard:

**File**: [apps/web/components/platform-stats-home.tsx](apps/web/components/platform-stats-home.tsx)

**Features**:
- Displays 4 key metrics in a responsive grid
- Auto-refetches every 30 seconds
- Smooth loading states with skeleton UI
- Hover effects and animations
- Error handling with user-friendly messages

**Metrics Displayed**:
1. 🪙 **Tokens Created** - Total tokens deployed across all factories
2. 🔒 **Liquidity Locks** - Total active liquidity locks
3. 📤 **Multisends** - Total multisend transactions
4. 💰 **Total Fees (MON)** - Platform fees collected in MONAD

#### 4. Homepage Integration
Added stats to the hero section:

**File**: [apps/web/app/page.tsx](apps/web/app/page.tsx)

- Positioned below the CTA buttons
- Animated entrance (delay-500)
- Labeled as "Platform Statistics"
- Fully responsive (4 columns on desktop, stacks on mobile)

### Environment Configuration

**File**: [apps/web/.env.local](apps/web/.env.local)

```env
# Development URL (The Graph Studio - for testing)
NEXT_PUBLIC_SUBGRAPH_URL_DEV=https://api.studio.thegraph.com/query/1716126/omega-tools/version/latest

# Production URL (Decentralized Network - with API key)
NEXT_PUBLIC_SUBGRAPH_URL=YOUR_PRODUCTION_QUERY_URL_HERE
NEXT_PUBLIC_GRAPH_API_KEY=YOUR_API_KEY_HERE
```

**To use production**:
1. Replace `YOUR_PRODUCTION_QUERY_URL_HERE` with your Gateway URL
2. Replace `YOUR_API_KEY_HERE` with your API key from The Graph

### GraphQL Query

The component fetches data using this query:

```graphql
query GetPlatformStats {
  globalStats(id: "global") {
    totalTokensCreated
    totalLocksCreated
    totalMultisends
    totalFeesPaid
  }
  factoryStats(orderBy: totalTokensCreated, orderDirection: desc) {
    factoryType
    totalTokensCreated
    totalFeesCollected
  }
}
```

### Dependencies Added

```json
{
  "@tanstack/react-query": "latest",
  "graphql-request": "latest"
}
```

## 🎨 UI Design

### Stats Cards
Each stat card features:
- **Large, readable numbers** - 3xl font size with light weight
- **Icon indicators** - Emoji icons for visual identification
- **Hover effects** - Border color, background, and gradient changes
- **Loading states** - Animated skeleton during data fetch
- **Gradient accents** - Purple to blue gradient on hover

### Responsive Layout
- **Desktop (lg)**: 4 columns
- **Tablet (md)**: 2 columns
- **Mobile**: Stacked single column

## 🔄 Data Flow

1. **Server-Side** (Initial Load):
   - Query client created on server
   - Data pre-fetched during SSR
   - Serialized and sent to client

2. **Client-Side** (After Hydration):
   - Uses pre-fetched data immediately (no loading state)
   - Background refetch every 30 seconds
   - Updates UI automatically when new data arrives

3. **Error Handling**:
   - Network errors display red error card
   - Fallback to "0" values if data unavailable
   - Graceful degradation

## 📊 Real-Time Updates

Stats automatically update when:
- New tokens are created
- Liquidity is locked/unlocked
- Multisend transactions occur
- Any fees are paid

**Refetch Interval**: 30 seconds (configurable)

## 🚀 Performance

- **SSR-friendly**: Data pre-fetched on server
- **Optimized queries**: Only fetches necessary fields
- **Smart caching**: 60s stale time prevents over-fetching
- **Minimal bundle**: Uses existing graphql-request client

## 🎯 Next Steps (Optional Enhancements)

1. **Recent Tokens Section**
   - Show last 5 created tokens
   - Display token name, symbol, type
   - Link to MonadScan

2. **User Dashboard**
   - Show connected wallet's tokens
   - Display user's locks
   - Personal multisend history

3. **Charts & Graphs**
   - Daily token creation chart
   - Fee collection over time
   - Factory distribution pie chart

4. **Live Activity Feed**
   - Real-time token creations
   - Recent locks
   - Latest multisends

## 📝 Code Example: Adding More Stats

To add additional stats to the homepage:

```tsx
// In platform-stats-home.tsx

const EXTENDED_STATS_QUERY = gql`
  query GetExtendedStats {
    globalStats(id: "global") {
      totalTokensCreated
      totalLocksCreated
      totalMultisends
      totalFeesPaid
    }
    tokens(first: 5, orderBy: createdAt, orderDirection: desc) {
      id
      name
      symbol
      tokenType
      createdAt
    }
  }
`

// Add to component
const recentTokens = data?.tokens || []
```

## 🌐 Live URL

After setting production credentials:
- **Production Endpoint**: Set via `NEXT_PUBLIC_SUBGRAPH_URL`
- **API Key Auth**: Set via `NEXT_PUBLIC_GRAPH_API_KEY`
- **Auto-fallback**: Uses dev URL if production not configured

---

**Implemented**: 2025-11-26
**Status**: ✅ Live on Homepage
**Subgraph**: https://thegraph.com/studio/subgraph/omega-tools
