# OmegaTools Contract Deployments

## Monad Mainnet

### MultisenderV2
- **Address**: `0x494BB03fA823520486D7f8f802428B1cFf94cdE7`
- **Version**: V2 (Improved)
- **Fee**: 1 MON per recipient (default)
- **Features**:
  - Atomic fee transfers to treasury
  - Updatable fee (owner only)
  - Updatable treasury address (owner only)
  - Emergency withdraw function
  - Support for native MON and ERC20 tokens
  - Support for EIP-2612 permit (gasless approvals)
  - Max recipients: 200 per transaction

**Key Improvements from V1**:
- Default fee set to 1 MON (1 ether) per recipient
- Fee is updatable by owner
- Treasury address is updatable by owner
- All fee transfers are atomic (happen in same transaction as multisend)
- Separate owner and treasury roles for better access control
- Emergency withdraw function for stuck tokens

### Liquidity Locker
- **Address**: `0x28a6fe6AEfd6AA7E2476440a6088f844f89b78a5`
- **Features**:
  - Lock ERC20 LP tokens with time lock
  - Withdraw after unlock time
  - Extend lock duration
  - View all locks and user locks

## Contract Functions

### MultisenderV2 Public Functions

**View Functions**:
- `feePerRecipient()` - Get current fee per recipient
- `treasury()` - Get treasury address
- `owner()` - Get owner address
- `calculateFee(uint256 recipientCount)` - Calculate total fee for N recipients
- `MAX_RECIPIENTS()` - Get maximum recipients allowed (200)
- `DEFAULT_FEE()` - Get default fee (1 ether)

**Send Functions**:
- `multisendNative(address[] recipients, uint256[] amounts)` - Send different amounts of MON
- `multisendNativeEqual(address[] recipients, uint256 amount)` - Send equal amounts of MON
- `multisendToken(address token, address[] recipients, uint256[] amounts)` - Send different amounts of ERC20
- `multisendTokenEqual(address token, address[] recipients, uint256 amount)` - Send equal amounts of ERC20
- `multisendTokenWithPermit(...)` - Send ERC20 with gasless approval

**Owner-Only Functions**:
- `updateFeePerRecipient(uint256 newFee)` - Update fee per recipient
- `updateTreasury(address newTreasury)` - Update treasury address
- `transferOwnership(address newOwner)` - Transfer ownership
- `emergencyWithdraw(address token, uint256 amount)` - Withdraw stuck tokens

## Usage Examples

### Multisend Native MON
```javascript
const recipients = ['0x...', '0x...', '0x...']
const amounts = [parseEther('1'), parseEther('2'), parseEther('3')]
const totalAmount = parseEther('6') // Sum of amounts
const totalFee = parseEther('3') // 1 MON × 3 recipients

await multisendNative(recipients, amounts, {
  value: totalAmount + totalFee
})
```

### Multisend ERC20 Tokens
```javascript
const token = '0x...' // ERC20 token address
const recipients = ['0x...', '0x...']
const amounts = [parseUnits('100', 18), parseUnits('200', 18)]
const totalFee = parseEther('2') // 1 MON × 2 recipients

// First approve token
await approve(token, MULTISENDER_ADDRESS, totalAmount)

// Then multisend (pay fee in MON)
await multisendToken(token, recipients, amounts, {
  value: totalFee
})
```

## Events

### MultisenderV2 Events
- `NativeMultisend(address indexed sender, uint256 totalAmount, uint256 recipientCount, uint256 feeCharged)`
- `ERC20Multisend(address indexed sender, address indexed token, uint256 totalAmount, uint256 recipientCount, uint256 feeCharged)`
- `FeeUpdated(uint256 indexed oldFee, uint256 indexed newFee)`
- `TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury)`
- `OwnershipTransferred(address indexed previousOwner, address indexed newOwner)`

## Error Codes

- `ZeroAddress()` - Zero address provided
- `ZeroAmount()` - Zero amount provided
- `InvalidArrayLength()` - Empty array provided
- `ArrayLengthMismatch()` - Recipients and amounts arrays have different lengths
- `InsufficientBalance()` - Insufficient token or native balance
- `InsufficientAllowance()` - Insufficient token allowance
- `TransferFailed()` - Token or native transfer failed
- `InsufficientFee()` - Insufficient fee payment
- `Unauthorized()` - Caller is not authorized
- `MaxRecipientsExceeded()` - More than 200 recipients provided

## Migration from V1 to V2

**Breaking Changes**:
1. Constructor now takes `_treasury` instead of `_feeRecipient` and `_feePerRecipient`
2. Default fee is always 1 MON (1 ether) per recipient
3. `feeRecipient` renamed to `treasury`
4. New owner management functions

**Frontend Updates**:
- Updated contract address to V2: `0x494BB03fA823520486D7f8f802428B1cFf94cdE7`
- Updated ABI to include new functions and events
- No changes needed to existing multisend function calls
- Fee is now always 1 MON per recipient (displayed correctly in UI)
