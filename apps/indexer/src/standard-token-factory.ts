import { BigInt } from "@graphprotocol/graph-ts"
import { TokenCreated as TokenCreatedEvent } from "../generated/StandardTokenFactory/StandardTokenFactory"
import { Token, User, FactoryStats, GlobalStats, DailyStats } from "../generated/schema"

export function handleStandardTokenCreated(event: TokenCreatedEvent): void {
  let token = new Token(event.params.tokenAddress.toHexString())
  let userId = event.params.creator.toHexString()
  let user = User.load(userId)

  // Create or update user
  if (user == null) {
    user = new User(userId)
    user.totalTokensCreated = BigInt.fromI32(0)
    user.totalLocksCreated = BigInt.fromI32(0)
    user.totalMultisends = BigInt.fromI32(0)
    user.createdAt = event.block.timestamp

    // Update global stats for new user
    updateGlobalStats("newUser", BigInt.fromI32(1), BigInt.fromI32(0))
  }
  user.totalTokensCreated = user.totalTokensCreated.plus(BigInt.fromI32(1))
  user.lastActivityAt = event.block.timestamp
  user.save()

  // Create token entity
  token.creator = user.id
  token.factory = event.address.toHexString()
  token.tokenType = "standard"
  token.name = event.params.name
  token.symbol = event.params.symbol
  token.decimals = 18 // Standard ERC20 decimals
  token.totalSupply = event.params.initialSupply
  token.initialSupply = event.params.initialSupply
  token.creationFee = event.params.fee
  token.creationTxHash = event.transaction.hash.toHexString()
  token.createdAt = event.params.timestamp
  token.blockNumber = event.block.number
  token.save()

  // Update factory stats
  updateFactoryStats(event.address.toHexString(), "standard", event.params.fee, event.params.timestamp)

  // Update global stats
  updateGlobalStats("tokenCreated", BigInt.fromI32(1), event.params.fee)

  // Update daily stats
  updateDailyStats(event.block.timestamp, "tokenCreated", BigInt.fromI32(1), event.params.fee)
}

function updateFactoryStats(factoryAddress: string, factoryType: string, fee: BigInt, timestamp: BigInt): void {
  let stats = FactoryStats.load(factoryAddress)
  if (stats == null) {
    stats = new FactoryStats(factoryAddress)
    stats.factoryType = factoryType
    stats.totalTokensCreated = BigInt.fromI32(0)
    stats.totalCreators = BigInt.fromI32(0)
    stats.totalFeesCollected = BigInt.fromI32(0)
  }
  stats.totalTokensCreated = stats.totalTokensCreated.plus(BigInt.fromI32(1))
  stats.totalFeesCollected = stats.totalFeesCollected.plus(fee)
  stats.lastTokenCreatedAt = timestamp
  stats.save()
}

function updateGlobalStats(updateType: string, count: BigInt, fees: BigInt): void {
  let stats = GlobalStats.load("global")
  if (stats == null) {
    stats = new GlobalStats("global")
    stats.totalTokens = BigInt.fromI32(0)
    stats.totalLocks = BigInt.fromI32(0)
    stats.totalMultisends = BigInt.fromI32(0)
    stats.totalUsers = BigInt.fromI32(0)
    stats.totalVolumeLocked = BigInt.fromI32(0)
    stats.totalFeesCollected = BigInt.fromI32(0)
  }

  if (updateType == "tokenCreated") {
    stats.totalTokens = stats.totalTokens.plus(count)
    stats.totalFeesCollected = stats.totalFeesCollected.plus(fees)
  } else if (updateType == "newUser") {
    stats.totalUsers = stats.totalUsers.plus(count)
  }

  stats.save()
}

function updateDailyStats(timestamp: BigInt, updateType: string, count: BigInt, fees: BigInt): void {
  let dayId = timestamp.div(BigInt.fromI32(86400))
  let dayStats = DailyStats.load(dayId.toString())

  if (dayStats == null) {
    dayStats = new DailyStats(dayId.toString())
    dayStats.date = dayId.times(BigInt.fromI32(86400))
    dayStats.tokensCreated = BigInt.fromI32(0)
    dayStats.locksCreated = BigInt.fromI32(0)
    dayStats.multisends = BigInt.fromI32(0)
    dayStats.newUsers = BigInt.fromI32(0)
    dayStats.volumeLocked = BigInt.fromI32(0)
    dayStats.feesCollected = BigInt.fromI32(0)
  }

  if (updateType == "tokenCreated") {
    dayStats.tokensCreated = dayStats.tokensCreated.plus(count)
    dayStats.feesCollected = dayStats.feesCollected.plus(fees)
  }

  dayStats.save()
}
