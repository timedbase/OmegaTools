import { BigInt } from "@graphprotocol/graph-ts"
import {
  ERC20Locked as ERC20LockedEvent,
  ERC20Unlocked as ERC20UnlockedEvent
} from "../generated/LiquidityLocker/LiquidityLocker"
import { Lock, User, GlobalStats, DailyStats } from "../generated/schema"

export function handleERC20Locked(event: ERC20LockedEvent): void {
  let lockId = event.params.lockId.toString()
  let userId = event.params.owner.toHexString()
  let user = User.load(userId)

  // Create or update user
  if (user == null) {
    user = new User(userId)
    user.totalTokensCreated = BigInt.fromI32(0)
    user.totalLocksCreated = BigInt.fromI32(0)
    user.totalMultisends = BigInt.fromI32(0)
    user.createdAt = event.block.timestamp

    // Update global stats
    updateGlobalStats("newUser", BigInt.fromI32(1), BigInt.fromI32(0), BigInt.fromI32(0))
  }
  user.totalLocksCreated = user.totalLocksCreated.plus(BigInt.fromI32(1))
  user.lastActivityAt = event.block.timestamp
  user.save()

  // Create lock entity
  let lock = new Lock(lockId)
  lock.lockId = event.params.lockId
  lock.owner = user.id
  lock.token = event.params.token.toHexString()
  lock.amount = event.params.amount
  lock.unlockTime = event.params.unlockTime
  lock.lockTime = event.block.timestamp
  lock.unlocked = false
  lock.lockFee = BigInt.fromI32(0) // Fee not available in event
  lock.txHash = event.transaction.hash.toHexString()
  lock.blockNumber = event.block.number
  lock.save()

  // Update global stats
  updateGlobalStats("lockCreated", BigInt.fromI32(1), event.params.amount, BigInt.fromI32(0))

  // Update daily stats
  updateDailyStats(event.block.timestamp, "lockCreated", BigInt.fromI32(1), event.params.amount)
}

export function handleERC20Unlocked(event: ERC20UnlockedEvent): void {
  let lockId = event.params.lockId.toString()
  let lock = Lock.load(lockId)

  if (lock != null) {
    lock.unlocked = true
    lock.unlockTxHash = event.transaction.hash.toHexString()
    lock.unlockedAt = event.block.timestamp
    lock.save()
  }
}

function updateGlobalStats(updateType: string, count: BigInt, volume: BigInt, fees: BigInt): void {
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

  if (updateType == "lockCreated") {
    stats.totalLocks = stats.totalLocks.plus(count)
    stats.totalVolumeLocked = stats.totalVolumeLocked.plus(volume)
    stats.totalFeesCollected = stats.totalFeesCollected.plus(fees)
  } else if (updateType == "newUser") {
    stats.totalUsers = stats.totalUsers.plus(count)
  }

  stats.save()
}

function updateDailyStats(timestamp: BigInt, updateType: string, count: BigInt, volume: BigInt): void {
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

  if (updateType == "lockCreated") {
    dayStats.locksCreated = dayStats.locksCreated.plus(count)
    dayStats.volumeLocked = dayStats.volumeLocked.plus(volume)
  }

  dayStats.save()
}
