import { BigInt } from "@graphprotocol/graph-ts"
import {
  NativeMultisend as NativeMultisendEvent,
  ERC20Multisend as ERC20MultisendEvent
} from "../generated/Multisender/Multisender"
import { MultisendTransaction, User, GlobalStats, DailyStats } from "../generated/schema"

export function handleNativeMultisend(event: NativeMultisendEvent): void {
  let txId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let userId = event.params.sender.toHexString()
  let user = User.load(userId)

  // Create or update user
  if (user == null) {
    user = new User(userId)
    user.totalTokensCreated = BigInt.fromI32(0)
    user.totalLocksCreated = BigInt.fromI32(0)
    user.totalMultisends = BigInt.fromI32(0)
    user.createdAt = event.block.timestamp

    // Update global stats
    updateGlobalStats("newUser", BigInt.fromI32(1), BigInt.fromI32(0))
  }
  user.totalMultisends = user.totalMultisends.plus(BigInt.fromI32(1))
  user.lastActivityAt = event.block.timestamp
  user.save()

  // Create multisend transaction
  let multisend = new MultisendTransaction(txId)
  multisend.sender = user.id
  multisend.transactionType = "native"
  multisend.token = null
  multisend.totalAmount = event.params.totalAmount
  multisend.recipientCount = event.params.recipientCount
  multisend.feeCharged = event.params.feeCharged
  multisend.txHash = event.transaction.hash.toHexString()
  multisend.timestamp = event.block.timestamp
  multisend.blockNumber = event.block.number
  multisend.save()

  // Update global stats
  updateGlobalStats("multisend", BigInt.fromI32(1), event.params.feeCharged)

  // Update daily stats
  updateDailyStats(event.block.timestamp, "multisend", BigInt.fromI32(1), event.params.feeCharged)
}

export function handleERC20Multisend(event: ERC20MultisendEvent): void {
  let txId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let userId = event.params.sender.toHexString()
  let user = User.load(userId)

  // Create or update user
  if (user == null) {
    user = new User(userId)
    user.totalTokensCreated = BigInt.fromI32(0)
    user.totalLocksCreated = BigInt.fromI32(0)
    user.totalMultisends = BigInt.fromI32(0)
    user.createdAt = event.block.timestamp

    // Update global stats
    updateGlobalStats("newUser", BigInt.fromI32(1), BigInt.fromI32(0))
  }
  user.totalMultisends = user.totalMultisends.plus(BigInt.fromI32(1))
  user.lastActivityAt = event.block.timestamp
  user.save()

  // Create multisend transaction
  let multisend = new MultisendTransaction(txId)
  multisend.sender = user.id
  multisend.transactionType = "erc20"
  multisend.token = event.params.token.toHexString()
  multisend.totalAmount = event.params.totalAmount
  multisend.recipientCount = event.params.recipientCount
  multisend.feeCharged = event.params.feeCharged
  multisend.txHash = event.transaction.hash.toHexString()
  multisend.timestamp = event.block.timestamp
  multisend.blockNumber = event.block.number
  multisend.save()

  // Update global stats
  updateGlobalStats("multisend", BigInt.fromI32(1), event.params.feeCharged)

  // Update daily stats
  updateDailyStats(event.block.timestamp, "multisend", BigInt.fromI32(1), event.params.feeCharged)
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

  if (updateType == "multisend") {
    stats.totalMultisends = stats.totalMultisends.plus(count)
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

  if (updateType == "multisend") {
    dayStats.multisends = dayStats.multisends.plus(count)
    dayStats.feesCollected = dayStats.feesCollected.plus(fees)
  }

  dayStats.save()
}
