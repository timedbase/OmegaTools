import { gql } from 'graphql-request'

export const GET_RECENT_TOKENS = gql`
  query RecentTokens($first: Int = 10) {
    tokens(first: $first, orderBy: createdAt, orderDirection: desc) {
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
      blockNumber
    }
  }
`

export const GET_USER_TOKENS = gql`
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
        creationTxHash
      }
    }
  }
`

export const GET_USER_LOCKS = gql`
  query UserLocks($userAddress: String!) {
    user(id: $userAddress) {
      id
      locksCreated(orderBy: lockTime, orderDirection: desc) {
        id
        lockId
        token
        amount
        unlockTime
        lockTime
        unlocked
        unlockTxHash
        txHash
      }
    }
  }
`

export const GET_ACTIVE_LOCKS = gql`
  query ActiveLocks($first: Int = 20) {
    locks(
      where: { unlocked: false }
      first: $first
      orderBy: lockTime
      orderDirection: desc
    ) {
      id
      lockId
      owner {
        id
      }
      token
      amount
      unlockTime
      lockTime
      txHash
    }
  }
`

export const GET_PLATFORM_STATS = gql`
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
`

export const GET_DAILY_STATS = gql`
  query DailyStats($startDate: BigInt!, $first: Int = 30) {
    dailyStats(
      where: { date_gte: $startDate }
      orderBy: date
      orderDirection: desc
      first: $first
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
`

export const GET_FACTORY_STATS = gql`
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
`

export const GET_USER_MULTISENDS = gql`
  query UserMultisends($userAddress: String!) {
    user(id: $userAddress) {
      id
      multisendTransactions(orderBy: timestamp, orderDirection: desc) {
        id
        transactionType
        token
        totalAmount
        recipientCount
        feeCharged
        timestamp
        txHash
      }
    }
  }
`

export const GET_RECENT_MULTISENDS = gql`
  query RecentMultisends($first: Int = 20) {
    multisendTransactions(
      first: $first
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
`

export const GET_TOKEN_DETAILS = gql`
  query TokenDetails($tokenAddress: String!) {
    token(id: $tokenAddress) {
      id
      name
      symbol
      tokenType
      decimals
      totalSupply
      initialSupply
      creator {
        id
        totalTokensCreated
      }
      factory
      creationFee
      createdAt
      creationTxHash
      blockNumber
      maxTxPercent
      maxWalletPercent
      maxAntiWhalePercent
      charityWallet
      router
      rewardToken
      marketingWallet
    }
  }
`
