# OmegaTools - Smart Contract Integration

Contract addresses and ABIs for integrating OmegaTools with your frontend.

---

## 📋 Table of Contents
- [Contract Addresses](#contract-addresses)
- [Contract ABIs](#contract-abis)
- [Important Notes](#important-notes)

---


---

## 📍 Contract Addresses

```javascript
const CONTRACT_ADDRESSES = {
  // Liquidity Locker
  LIQUIDITY_LOCKER: '0xa36E03745d1dc28f5B56cb04980DB99e7c866Be4',

  // Multisender
  MULTISENDER: '0x7789e88f8F49CC3Ca9C154591D525062A47a988C',

  // Token Factories
  STANDARD_TOKEN_FACTORY: '0xE4D8cF581CaFc6E6A30DE12ebbE12EfD1EE3871a',
  ANTIBOT_TOKEN_FACTORY: '0x322e4A64156E7ff5040C2e0cEa2AacAE9E83B420',
  LIQUIDITY_GEN_TOKEN_FACTORY: '0x68C1F787610E5311C48A634DB2DFCd5D007064db',
  ANTIBOT_LIQUIDITY_GEN_FACTORY: '0x45fCE82e66a2e453B7E89aE9C8835f1c3DB7f725',
  BUYBACK_BABY_TOKEN_FACTORY: '0xeBEe683f60840AF5Cb71E7f60c296888D343154C',
  ANTIBOT_BUYBACK_BABY_FACTORY: '0x36a172246ee20ab48523812e3d413fe09d807b64'
};
```

---

## 📝 Contract ABIs

### StandardTokenFactory ABI

```javascript
const STANDARD_TOKEN_FACTORY_ABI = [
  "function createToken(string _name, string _symbol, uint8 _decimals, uint256 _initialSupply, bytes32 _salt) external payable returns (address)",
  "function creationFee() external view returns (uint256)",
  "function totalCreations() external view returns (uint256)",
  "function getUserTokens(address user) external view returns (address[])",
  "function getAllTokens() external view returns (address[])",
  "event TokenCreated(address indexed creator, address indexed tokenAddress, string name, string symbol, uint256 initialSupply, uint256 fee, uint256 timestamp)"
];
```

### AntiBotStandardTokenFactory ABI

```javascript
const ANTIBOT_TOKEN_FACTORY_ABI = [
  "function createToken(string name, string symbol, uint256 totalSupply, uint256 maxTxPercent, uint256 maxWalletPercent, uint256 maxAntiWhalePercent) external payable returns (address)",
  "function creationFee() external view returns (uint256)",
  "function getTokenCount() external view returns (uint256)",
  "function getUserTokens(address user) external view returns (address[])",
  "function getTokenAtIndex(uint256 index) external view returns (address)",
  "event TokenCreated(address indexed token, address indexed creator, string name, string symbol, uint256 totalSupply)"
];
```

### AntiBotLiquidityGenerationTokenFactory ABI

```javascript
const ANTIBOT_LIQUIDITY_GEN_FACTORY_ABI = [
  "function createToken(string name, string symbol, uint256 totalSupply, address charityWallet, address router, uint256 maxTxPercent, uint256 maxWalletPercent, uint256 maxAntiWhalePercent) external payable returns (address)",
  "function creationFee() external view returns (uint256)",
  "function getAllTokens() external view returns (address[])",
  "function getTokensByCreator(address creator) external view returns (address[])",
  "function getTokenCount() external view returns (uint256)",
  "event TokenCreated(address indexed token, address indexed creator, string name, string symbol, uint256 totalSupply, uint256 reflectionFee, uint256 liquidityFee, uint256 charityFee)"
];
```

### AntiBotBuybackBabyTokenFactory ABI

```javascript
const ANTIBOT_BUYBACK_BABY_FACTORY_ABI = [
  "function createToken(string name, string symbol, uint256 totalSupply, address rewardToken, address router, address marketingWallet, uint256 maxTxPercent, uint256 maxWalletPercent, uint256 maxAntiWhalePercent) external payable returns (address)",
  "function creationFee() external view returns (uint256)",
  "function getAllTokens() external view returns (address[])",
  "function getTokensByCreator(address creator) external view returns (address[])",
  "function getTokenCount() external view returns (uint256)",
  "event TokenCreated(address indexed token, address indexed creator, string name, string symbol, uint256 totalSupply, address rewardToken)"
];
```

### LiquidityLocker ABI

```javascript
const LIQUIDITY_LOCKER_ABI = [
  "function lockERC20(address token, uint256 amount, uint256 unlockTime) external payable",
  "function lockERC721(address token, uint256 tokenId, uint256 unlockTime) external payable",
  "function unlockERC20(uint256 lockId) external",
  "function unlockERC721(uint256 lockId) external",
  "function lockFee() external view returns (uint256)",
  "function getERC20LockDetails(uint256 lockId) external view returns (address token, address lockOwner, uint256 amount, uint256 unlockTime, bool unlocked)",
  "event ERC20Locked(uint256 indexed lockId, address indexed token, address indexed owner, uint256 amount, uint256 unlockTime)",
  "event ERC20Unlocked(uint256 indexed lockId, address indexed token, address indexed owner, uint256 amount)"
];
```

### Multisender ABI

```javascript
const MULTISENDER_ABI = [
  "function multisendNative(address[] recipients, uint256[] amounts) external payable",
  "function multisendToken(address token, address[] recipients, uint256[] amounts) external payable",
  "function multisendNativeEqual(address[] recipients, uint256 amount) external payable",
  "function multisendTokenEqual(address token, address[] recipients, uint256 amount) external payable",
  "function calculateFee(uint256 recipientCount) external view returns (uint256)",
  "function feePerRecipient() external view returns (uint256)",
  "event NativeMultisend(address indexed sender, uint256 totalAmount, uint256 recipientCount, uint256 feeCharged)",
  "event ERC20Multisend(address indexed sender, address indexed token, uint256 totalAmount, uint256 recipientCount, uint256 feeCharged)"
];
```

### Token Control ABI (for created tokens)

```javascript
const TOKEN_CONTROL_ABI = [
  "function enableTrading() external",
  "function setFees(uint256 _reflectionFee, uint256 _liquidityFee, uint256 _charityFee) external",
  "function setAntiBotEnabled(bool enabled) external",
  "function setAntiWhaleEnabled(bool enabled) external",
  "function updateMaxTransactionAmount(uint256 _maxPercent) external",
  "function updateMaxWalletAmount(uint256 _maxPercent) external",
  "function owner() external view returns (address)",
  "function tradingEnabledTimestamp() external view returns (uint256)"
];
```

---

## 💡 Integration Examples

### 1. Create Anti-Bot Standard Token

```javascript
async function createAntiBotToken(signer, params) {
  const factory = new ethers.Contract(
    CONTRACT_ADDRESSES.ANTIBOT_TOKEN_FACTORY,
    ANTIBOT_TOKEN_FACTORY_ABI,
    signer
  );

  // Get creation fee (in ether)
  const creationFee = await factory.creationFee();

  // Prepare parameters
  const {
    name,           // "MyToken"
    symbol,         // "MTK"
    totalSupply,    // 1000000 (without decimals)
    maxTxPercent,   // 50 = 5%
    maxWalletPercent,   // 100 = 10%
    maxAntiWhalePercent // 5 = 0.5%
  } = params;

  // Create token
  const tx = await factory.createToken(
    name,
    symbol,
    totalSupply,
    maxTxPercent,
    maxWalletPercent,
    maxAntiWhalePercent,
    { value: ethers.parseEther(creationFee.toString()) }
  );

  const receipt = await tx.wait();

  // Get token address from event
  const event = receipt.logs.find(
    log => log.topics[0] === ethers.id("TokenCreated(address,address,string,string,uint256)")
  );
  const tokenAddress = ethers.getAddress('0x' + event.topics[1].slice(26));

  return { tokenAddress, txHash: receipt.hash };
}
```

### 2. Create Liquidity Generation Token with Anti-Bot

```javascript
async function createLiquidityGenToken(signer, params) {
  const factory = new ethers.Contract(
    CONTRACT_ADDRESSES.ANTIBOT_LIQUIDITY_GEN_FACTORY,
    ANTIBOT_LIQUIDITY_GEN_FACTORY_ABI,
    signer
  );

  const creationFee = await factory.creationFee();

  const {
    name,
    symbol,
    totalSupply,
    charityWallet,
    router,              // Uniswap V2 Router address
    maxTxPercent,
    maxWalletPercent,
    maxAntiWhalePercent
  } = params;

  const tx = await factory.createToken(
    name,
    symbol,
    totalSupply,
    charityWallet,
    router,
    maxTxPercent,
    maxWalletPercent,
    maxAntiWhalePercent,
    { value: ethers.parseEther(creationFee.toString()) }
  );

  const receipt = await tx.wait();
  const tokenAddress = getTokenAddressFromReceipt(receipt);

  return { tokenAddress, txHash: receipt.hash };
}
```

### 3. Create Buyback Baby Token with Anti-Bot

```javascript
async function createBuybackBabyToken(signer, params) {
  const factory = new ethers.Contract(
    CONTRACT_ADDRESSES.ANTIBOT_BUYBACK_BABY_FACTORY,
    ANTIBOT_BUYBACK_BABY_FACTORY_ABI,
    signer
  );

  const creationFee = await factory.creationFee();

  const {
    name,
    symbol,
    totalSupply,
    rewardToken,         // Address of reward token (e.g., BUSD, USDT)
    router,              // Uniswap V2 Router address
    marketingWallet,
    maxTxPercent,
    maxWalletPercent,
    maxAntiWhalePercent
  } = params;

  const tx = await factory.createToken(
    name,
    symbol,
    totalSupply,
    rewardToken,
    router,
    marketingWallet,
    maxTxPercent,
    maxWalletPercent,
    maxAntiWhalePercent,
    { value: ethers.parseEther(creationFee.toString()) }
  );

  const receipt = await tx.wait();
  const tokenAddress = getTokenAddressFromReceipt(receipt);

  return { tokenAddress, txHash: receipt.hash };
}
```

### 4. Configure Token After Creation

```javascript
async function configureToken(signer, tokenAddress) {
  const token = new ethers.Contract(
    tokenAddress,
    TOKEN_CONTROL_ABI,
    signer
  );

  // Set fees (in tenths of percent: 10 = 1%)
  await token.setFees(
    20,  // reflectionFee: 2%
    30,  // liquidityFee: 3%
    10   // charityFee: 1%
  );

  // Enable trading (PERMANENT - cannot be disabled!)
  await token.enableTrading();

  console.log('Token configured and trading enabled!');
}
```

### 5. Lock Liquidity Tokens

```javascript
async function lockLiquidity(signer, params) {
  const locker = new ethers.Contract(
    CONTRACT_ADDRESSES.LIQUIDITY_LOCKER,
    LIQUIDITY_LOCKER_ABI,
    signer
  );

  const lockFee = await locker.lockFee();

  const {
    tokenAddress,
    amount,          // Amount in wei
    lockDuration     // Duration in seconds
  } = params;

  // Approve locker to spend tokens
  const token = new ethers.Contract(
    tokenAddress,
    ["function approve(address spender, uint256 amount) external returns (bool)"],
    signer
  );
  await token.approve(CONTRACT_ADDRESSES.LIQUIDITY_LOCKER, amount);

  // Lock tokens
  const unlockTime = Math.floor(Date.now() / 1000) + lockDuration;
  const tx = await locker.lockERC20(
    tokenAddress,
    amount,
    unlockTime,
    { value: ethers.parseEther(lockFee.toString()) }
  );

  const receipt = await tx.wait();
  const lockId = receipt.logs[0].topics[1]; // Get lock ID from event

  return { lockId, txHash: receipt.hash };
}
```

### 6. Multisend Tokens

```javascript
async function multisendTokens(signer, params) {
  const multisender = new ethers.Contract(
    CONTRACT_ADDRESSES.MULTISENDER,
    MULTISENDER_ABI,
    signer
  );

  const {
    tokenAddress,
    recipients,      // Array of addresses
    amounts          // Array of amounts (in wei)
  } = params;

  // Calculate fee
  const feePerRecipient = await multisender.feePerRecipient();
  const totalFee = await multisender.calculateFee(recipients.length);

  // Approve tokens
  const totalAmount = amounts.reduce((a, b) => a + b, 0n);
  const token = new ethers.Contract(
    tokenAddress,
    ["function approve(address spender, uint256 amount) external returns (bool)"],
    signer
  );
  await token.approve(CONTRACT_ADDRESSES.MULTISENDER, totalAmount);

  // Multisend
  const tx = await multisender.multisendToken(
    tokenAddress,
    recipients,
    amounts,
    { value: totalFee }
  );

  const receipt = await tx.wait();
  return { txHash: receipt.hash };
}
```

### 7. Get User's Created Tokens

```javascript
async function getUserTokens(provider, userAddress, factoryAddress) {
  const factory = new ethers.Contract(
    factoryAddress,
    ["function getUserTokens(address user) external view returns (address[])"],
    provider
  );

  const tokens = await factory.getUserTokens(userAddress);
  return tokens;
}
```

### 8. Listen for Token Creation Events

```javascript
async function listenForTokenCreation(provider, factoryAddress) {
  const factory = new ethers.Contract(
    factoryAddress,
    ANTIBOT_TOKEN_FACTORY_ABI,
    provider
  );

  factory.on("TokenCreated", (token, creator, name, symbol, totalSupply) => {
    console.log('New token created!');
    console.log('Address:', token);
    console.log('Creator:', creator);
    console.log('Name:', name);
    console.log('Symbol:', symbol);
    console.log('Supply:', totalSupply.toString());
  });
}
```

---

## 🎨 React Component Examples

### Token Creation Form

```jsx
import { useState } from 'react';
import { ethers } from 'ethers';

function TokenCreationForm() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    maxTxPercent: '50',      // 5%
    maxWalletPercent: '100', // 10%
    maxAntiWhalePercent: '5' // 0.5%
  });
  const [loading, setLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const result = await createAntiBotToken(signer, formData);
      setTokenAddress(result.tokenAddress);
      alert(`Token created! Address: ${result.tokenAddress}`);
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Failed to create token: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Token Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Symbol"
        value={formData.symbol}
        onChange={(e) => setFormData({...formData, symbol: e.target.value})}
        required
      />
      <input
        type="number"
        placeholder="Total Supply"
        value={formData.totalSupply}
        onChange={(e) => setFormData({...formData, totalSupply: e.target.value})}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Token'}
      </button>

      {tokenAddress && (
        <div>
          <p>Token Address: {tokenAddress}</p>
          <a href={`https://monadscan.com/address/${tokenAddress}`} target="_blank">
            View on Explorer
          </a>
        </div>
      )}
    </form>
  );
}
```

---

## ⚠️ Error Handling

### Common Errors

```javascript
async function handleTransaction(txFunction) {
  try {
    const tx = await txFunction();
    const receipt = await tx.wait();
    return { success: true, receipt };
  } catch (error) {
    // User rejected transaction
    if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
      return { success: false, error: 'Transaction rejected by user' };
    }

    // Insufficient funds
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return { success: false, error: 'Insufficient funds for gas + value' };
    }

    // Contract revert
    if (error.reason) {
      return { success: false, error: error.reason };
    }

    return { success: false, error: error.message };
  }
}
```

### Custom Error Messages

```javascript
const ERROR_MESSAGES = {
  'InsufficientFee': 'Please send the required creation fee',
  'TradingNotEnabled': 'Trading has not been enabled yet',
  'ExceedsMaxTransaction': 'Amount exceeds maximum transaction limit',
  'ExceedsMaxWallet': 'Amount would exceed maximum wallet limit',
  'AlreadyInitialized': 'Token has already been initialized',
  'NotOwner': 'Only the owner can perform this action'
};
```

---

## 🧪 Testing

### Test Token Creation

```javascript
async function testTokenCreation() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const params = {
    name: 'Test Token',
    symbol: 'TEST',
    totalSupply: 1000000,
    maxTxPercent: 50,
    maxWalletPercent: 100,
    maxAntiWhalePercent: 5
  };

  console.log('Creating token with params:', params);
  const result = await createAntiBotToken(signer, params);
  console.log('Token created:', result);

  // Verify token
  const token = new ethers.Contract(
    result.tokenAddress,
    ["function name() view returns (string)", "function symbol() view returns (string)"],
    provider
  );

  const name = await token.name();
  const symbol = await token.symbol();
  console.log('Verified:', name, symbol);
}
```

---

## 📊 Fee Structure Reference

### Creation Fees (in ether)
- Check `creationFee()` on each factory contract
- Fees are automatically converted to wei internally
- Example: If fee is 1, send `1 ether` not `1000000000000000000 wei`

### Percentage Format
- All percentages are in **tenths of percent**
- `10` = 1%
- `50` = 5%
- `100` = 10%
- `250` = 25% (maximum for most contracts)

### Lock Fees
- Check `lockFee()` on LiquidityLocker contract
- Paid in native currency per lock operation

### Multisend Fees
- Check `feePerRecipient()` on Multisender contract
- Multiplied by number of recipients
- Use `calculateFee(recipientCount)` for exact amount

---

## 🔗 Useful Links

- **Block Explorer**: https://monadscan.com/
- **Contract Source Code**: [GitHub Repository]
- **Support**: [Discord/Telegram]

---

## 📝 Notes

1. **Always enable optimizer** when compiling contracts (runs=200)
2. **Test on testnet first** before mainnet deployment
3. **Fees are in ETHER**, not wei - the contract handles conversion
4. **Trading enable is permanent** - cannot be paused once enabled
5. **Configure fees after creation** - all token fees default to 0
6. **Approve tokens before locking** - always call `approve()` first

---

**Last Updated:** 2025-11-26
**Version:** 1.0.0
