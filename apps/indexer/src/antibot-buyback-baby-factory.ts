import { BigInt } from "@graphprotocol/graph-ts"
import { TokenCreated as TokenCreatedEvent } from "../generated/AntiBotBuybackBabyFactory/AntiBotBuybackBabyFactory"
import { Token } from "../generated/schema"
import { getOrCreateUser, updateFactoryStats, updateGlobalStats, updateDailyStats } from "./utils"

export function handleAntiBotBuybackBabyTokenCreated(event: TokenCreatedEvent): void {
  let userId = event.params.creator.toHexString()
  let user = getOrCreateUser(userId, event.block.timestamp)
  
  user.totalTokensCreated = user.totalTokensCreated.plus(BigInt.fromI32(1))
  user.lastActivityAt = event.block.timestamp
  user.save()

  // Create token entity
  let token = new Token(event.params.token.toHexString())
  token.creator = user.id
  token.factory = event.address.toHexString()
  token.tokenType = "antiBotBuybackBaby"
  token.name = event.params.name
  token.symbol = event.params.symbol
  token.decimals = 18
  token.totalSupply = event.params.totalSupply
  token.initialSupply = event.params.totalSupply
  token.creationFee = BigInt.fromI32(0)
  token.rewardToken = event.params.rewardToken.toHexString()
  token.creationTxHash = event.transaction.hash.toHexString()
  token.createdAt = event.block.timestamp
  token.blockNumber = event.block.number
  token.save()

  // Update stats
  updateFactoryStats(event.address.toHexString(), "antiBotBuybackBaby", BigInt.fromI32(0), event.block.timestamp)
  updateGlobalStats("tokenCreated", BigInt.fromI32(1), BigInt.fromI32(0), BigInt.fromI32(0))
  updateDailyStats(event.block.timestamp, "tokenCreated", BigInt.fromI32(1), BigInt.fromI32(0))
}
