import { BigInt } from "@graphprotocol/graph-ts"
import { User, FactoryStats, GlobalStats, DailyStats } from "../generated/schema"

export function getOrCreateUser(userId: string, timestamp: BigInt): User {
  let user = User.load(userId)

  if (user == null) {
    user = new User(userId)
    user.totalTokensCreated = BigInt.fromI32(0)
    user.totalLocksCreated = BigInt.fromI32(0)
    user.totalMultisends = BigInt.fromI32(0)
    user.createdAt = timestamp

    // Update global stats for new user
    updateGlobalStats("newUser", BigInt.fromI32(1), BigInt.fromI32(0), BigInt.fromI32(0))
  }

  return user
}

export function updateFactoryStats(factoryAddress: string, factoryType: string, fee: BigInt, timestamp: BigInt): void {
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

export function updateGlobalStats(updateType: string, count: BigInt, fees: BigInt, volume: BigInt): void {
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
  } else if (updateType == "lockCreated") {
    stats.totalLocks = stats.totalLocks.plus(count)
    stats.totalVolumeLocked = stats.totalVolumeLocked.plus(volume)
    stats.totalFeesCollected = stats.totalFeesCollected.plus(fees)
  } else if (updateType == "multisend") {
    stats.totalMultisends = stats.totalMultisends.plus(count)
    stats.totalFeesCollected = stats.totalFeesCollected.plus(fees)
  }

  stats.save()
}

export function updateDailyStats(timestamp: BigInt, updateType: string, count: BigInt, fees: BigInt, volume: BigInt = BigInt.fromI32(0)): void {
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
  } else if (updateType == "lockCreated") {
    dayStats.locksCreated = dayStats.locksCreated.plus(count)
    dayStats.volumeLocked = dayStats.volumeLocked.plus(volume)
  } else if (updateType == "multisend") {
    dayStats.multisends = dayStats.multisends.plus(count)
    dayStats.feesCollected = dayStats.feesCollected.plus(fees)
  }

  dayStats.save()
}
