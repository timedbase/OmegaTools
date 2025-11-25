// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @custom:website https://Omegatools.dev
 */

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
}

/**
 * @title OmegaLiquidityLocker
 * @notice A contract for locking both ERC20 LP tokens and NFT-based LP receipts (ERC721)
 * @dev Supports standard LP tokens and NFT positions like Uniswap V3
 */
contract OmegaLiquidityLocker {

    // Enums
    enum LockType {
        ERC20,
        ERC721
    }

    // Structs
    struct ERC20Lock {
        address token;
        address owner;
        uint256 amount;
        uint256 unlockTime;
        bool withdrawn;
    }

    struct ERC721Lock {
        address token;
        address owner;
        uint256 tokenId;
        uint256 unlockTime;
        bool withdrawn;
    }

    // State variables
    uint256 public erc20LockCount;
    uint256 public erc721LockCount;

    address public feeRecipient;
    uint256 public lockFee;

    mapping(uint256 => ERC20Lock) public erc20Locks;
    mapping(uint256 => ERC721Lock) public erc721Locks;

    // Mapping to track user's locks
    mapping(address => uint256[]) public userERC20Locks;
    mapping(address => uint256[]) public userERC721Locks;

    // Mapping to track locks by token
    mapping(address => uint256[]) public tokenERC20Locks;
    mapping(address => uint256[]) public tokenERC721Locks;

    // Events
    event ERC20Locked(
        uint256 indexed lockId,
        address indexed token,
        address indexed owner,
        uint256 amount,
        uint256 unlockTime
    );

    event ERC721Locked(
        uint256 indexed lockId,
        address indexed token,
        address indexed owner,
        uint256 tokenId,
        uint256 unlockTime
    );

    event ERC20Withdrawn(
        uint256 indexed lockId,
        address indexed token,
        address indexed owner,
        uint256 amount
    );

    event ERC721Withdrawn(
        uint256 indexed lockId,
        address indexed token,
        address indexed owner,
        uint256 tokenId
    );

    event LockExtended(
        uint256 indexed lockId,
        LockType lockType,
        uint256 newUnlockTime
    );

    event FeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address indexed newRecipient);
    event FeeCollected(address indexed payer, uint256 amount);

    // Errors
    error ZeroAddress();
    error ZeroAmount();
    error InvalidUnlockTime();
    error NotLockOwner();
    error LockNotExpired();
    error AlreadyWithdrawn();
    error InvalidLockId();
    error TransferFailed();
    error NewUnlockTimeTooEarly();
    error InsufficientFee();
    error NotFeeRecipient();

    /**
     * @notice Initialize the contract
     * @param _feeRecipient Address to receive fees
     * @param _lockFee Fee amount in wei for locking liquidity
     */
    constructor(address _feeRecipient, uint256 _lockFee) {
        if (_feeRecipient == address(0)) revert ZeroAddress();
        feeRecipient = _feeRecipient;
        lockFee = _lockFee;
    }

    /**
     * @notice Modifier to check if caller is the fee recipient
     */
    modifier onlyFeeRecipient() {
        if (msg.sender != feeRecipient) revert NotFeeRecipient();
        _;
    }

    /**
     * @notice Lock ERC20 LP tokens
     * @param token The LP token address
     * @param amount The amount to lock
     * @param unlockTime The timestamp when tokens can be withdrawn
     * @return lockId The ID of the created lock
     */
    function lockERC20Liquidity(
        address token,
        uint256 amount,
        uint256 unlockTime
    ) external payable returns (uint256 lockId) {
        if (msg.value < lockFee) revert InsufficientFee();
        if (token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (unlockTime <= block.timestamp) revert InvalidUnlockTime();

        // Transfer fee to recipient
        if (lockFee > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: lockFee}("");
            if (!feeSuccess) revert TransferFailed();
            emit FeeCollected(msg.sender, lockFee);
        }

        // Refund excess payment
        if (msg.value > lockFee) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - lockFee}("");
            if (!refundSuccess) revert TransferFailed();
        }

        lockId = erc20LockCount++;

        erc20Locks[lockId] = ERC20Lock({
            token: token,
            owner: msg.sender,
            amount: amount,
            unlockTime: unlockTime,
            withdrawn: false
        });

        userERC20Locks[msg.sender].push(lockId);
        tokenERC20Locks[token].push(lockId);

        bool transferSuccess = IERC20(token).transferFrom(msg.sender, address(this), amount);
        if (!transferSuccess) revert TransferFailed();

        emit ERC20Locked(lockId, token, msg.sender, amount, unlockTime);
    }

    /**
     * @notice Lock ERC721 NFT LP tokens
     * @param token The NFT LP token address (e.g., Uniswap V3 Position Manager)
     * @param tokenId The NFT token ID
     * @param unlockTime The timestamp when the NFT can be withdrawn
     * @return lockId The ID of the created lock
     */
    function lockERC721Liquidity(
        address token,
        uint256 tokenId,
        uint256 unlockTime
    ) external payable returns (uint256 lockId) {
        if (msg.value < lockFee) revert InsufficientFee();
        if (token == address(0)) revert ZeroAddress();
        if (unlockTime <= block.timestamp) revert InvalidUnlockTime();

        // Transfer fee to recipient
        if (lockFee > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: lockFee}("");
            if (!feeSuccess) revert TransferFailed();
            emit FeeCollected(msg.sender, lockFee);
        }

        // Refund excess payment
        if (msg.value > lockFee) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - lockFee}("");
            if (!refundSuccess) revert TransferFailed();
        }

        lockId = erc721LockCount++;

        erc721Locks[lockId] = ERC721Lock({
            token: token,
            owner: msg.sender,
            tokenId: tokenId,
            unlockTime: unlockTime,
            withdrawn: false
        });

        userERC721Locks[msg.sender].push(lockId);
        tokenERC721Locks[token].push(lockId);

        IERC721(token).transferFrom(msg.sender, address(this), tokenId);

        emit ERC721Locked(lockId, token, msg.sender, tokenId, unlockTime);
    }

    /**
     * @notice Withdraw ERC20 LP tokens after unlock time
     * @param lockId The ID of the lock
     */
    function withdrawERC20Liquidity(uint256 lockId) external {
        if (lockId >= erc20LockCount) revert InvalidLockId();

        ERC20Lock storage lock = erc20Locks[lockId];

        if (lock.owner != msg.sender) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();
        if (block.timestamp < lock.unlockTime) revert LockNotExpired();

        lock.withdrawn = true;

        bool success = IERC20(lock.token).transfer(lock.owner, lock.amount);
        if (!success) revert TransferFailed();

        emit ERC20Withdrawn(lockId, lock.token, lock.owner, lock.amount);
    }

    /**
     * @notice Withdraw ERC721 NFT LP tokens after unlock time
     * @param lockId The ID of the lock
     */
    function withdrawERC721Liquidity(uint256 lockId) external {
        if (lockId >= erc721LockCount) revert InvalidLockId();

        ERC721Lock storage lock = erc721Locks[lockId];

        if (lock.owner != msg.sender) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();
        if (block.timestamp < lock.unlockTime) revert LockNotExpired();

        lock.withdrawn = true;

        IERC721(lock.token).transferFrom(address(this), lock.owner, lock.tokenId);

        emit ERC721Withdrawn(lockId, lock.token, lock.owner, lock.tokenId);
    }

    /**
     * @notice Extend the unlock time for an ERC20 lock
     * @param lockId The ID of the lock
     * @param newUnlockTime The new unlock timestamp
     */
    function extendERC20LiquidityLock(uint256 lockId, uint256 newUnlockTime) external {
        if (lockId >= erc20LockCount) revert InvalidLockId();

        ERC20Lock storage lock = erc20Locks[lockId];

        if (lock.owner != msg.sender) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();
        if (newUnlockTime <= lock.unlockTime) revert NewUnlockTimeTooEarly();

        lock.unlockTime = newUnlockTime;

        emit LockExtended(lockId, LockType.ERC20, newUnlockTime);
    }

    /**
     * @notice Extend the unlock time for an ERC721 lock
     * @param lockId The ID of the lock
     * @param newUnlockTime The new unlock timestamp
     */
    function extendERC721LiquidityLock(uint256 lockId, uint256 newUnlockTime) external {
        if (lockId >= erc721LockCount) revert InvalidLockId();

        ERC721Lock storage lock = erc721Locks[lockId];

        if (lock.owner != msg.sender) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();
        if (newUnlockTime <= lock.unlockTime) revert NewUnlockTimeTooEarly();

        lock.unlockTime = newUnlockTime;

        emit LockExtended(lockId, LockType.ERC721, newUnlockTime);
    }

    /**
     * @notice Transfer ownership of an ERC20 lock
     * @param lockId The ID of the lock
     * @param newOwner The new owner address
     */
    function transferERC20LiquidityLockOwnership(uint256 lockId, address newOwner) external {
        if (lockId >= erc20LockCount) revert InvalidLockId();
        if (newOwner == address(0)) revert ZeroAddress();

        ERC20Lock storage lock = erc20Locks[lockId];

        if (lock.owner != msg.sender) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();

        lock.owner = newOwner;
        userERC20Locks[newOwner].push(lockId);
    }

    /**
     * @notice Transfer ownership of an ERC721 lock
     * @param lockId The ID of the lock
     * @param newOwner The new owner address
     */
    function transferERC721LiquidityLockOwnership(uint256 lockId, address newOwner) external {
        if (lockId >= erc721LockCount) revert InvalidLockId();
        if (newOwner == address(0)) revert ZeroAddress();

        ERC721Lock storage lock = erc721Locks[lockId];

        if (lock.owner != msg.sender) revert NotLockOwner();
        if (lock.withdrawn) revert AlreadyWithdrawn();

        lock.owner = newOwner;
        userERC721Locks[newOwner].push(lockId);
    }

    /**
     * @notice Get all ERC20 lock IDs for a user
     * @param user The user address
     * @return Array of lock IDs
     */
    function getUserERC20LiquidityLocks(address user) external view returns (uint256[] memory) {
        return userERC20Locks[user];
    }

    /**
     * @notice Get all ERC721 lock IDs for a user
     * @param user The user address
     * @return Array of lock IDs
     */
    function getUserERC721LiquidityLocks(address user) external view returns (uint256[] memory) {
        return userERC721Locks[user];
    }

    /**
     * @notice Get all ERC20 lock IDs for a token
     * @param token The token address
     * @return Array of lock IDs
     */
    function getTokenERC20LiquidityLocks(address token) external view returns (uint256[] memory) {
        return tokenERC20Locks[token];
    }

    /**
     * @notice Get all ERC721 lock IDs for a token
     * @param token The token address
     * @return Array of lock IDs
     */
    function getTokenERC721Locks(address token) external view returns (uint256[] memory) {
        return tokenERC721Locks[token];
    }

    /**
     * @notice Get detailed information about an ERC20 lock
     * @param lockId The lock ID
     * @return token Token address
     * @return owner Lock owner
     * @return amount Locked amount
     * @return unlockTime Unlock timestamp
     * @return withdrawn Whether withdrawn
     */
    function getERC20LockDetails(uint256 lockId) external view returns (
        address token,
        address owner,
        uint256 amount,
        uint256 unlockTime,
        bool withdrawn
    ) {
        if (lockId >= erc20LockCount) revert InvalidLockId();

        ERC20Lock storage lock = erc20Locks[lockId];
        return (
            lock.token,
            lock.owner,
            lock.amount,
            lock.unlockTime,
            lock.withdrawn
        );
    }

    /**
     * @notice Get detailed information about an ERC721 lock
     * @param lockId The lock ID
     * @return token Token address
     * @return owner Lock owner
     * @return tokenId NFT token ID
     * @return unlockTime Unlock timestamp
     * @return withdrawn Whether withdrawn
     */
    function getERC721LockDetails(uint256 lockId) external view returns (
        address token,
        address owner,
        uint256 tokenId,
        uint256 unlockTime,
        bool withdrawn
    ) {
        if (lockId >= erc721LockCount) revert InvalidLockId();

        ERC721Lock storage lock = erc721Locks[lockId];
        return (
            lock.token,
            lock.owner,
            lock.tokenId,
            lock.unlockTime,
            lock.withdrawn
        );
    }

    /**
     * @notice Check if an ERC20 lock is withdrawable
     * @param lockId The lock ID
     * @return Whether the lock can be withdrawn
     */
    function isERC20Withdrawable(uint256 lockId) external view returns (bool) {
        if (lockId >= erc20LockCount) return false;

        ERC20Lock storage lock = erc20Locks[lockId];
        return !lock.withdrawn && block.timestamp >= lock.unlockTime;
    }

    /**
     * @notice Check if an ERC721 lock is withdrawable
     * @param lockId The lock ID
     * @return Whether the lock can be withdrawn
     */
    function isERC721Withdrawable(uint256 lockId) external view returns (bool) {
        if (lockId >= erc721LockCount) return false;

        ERC721Lock storage lock = erc721Locks[lockId];
        return !lock.withdrawn && block.timestamp >= lock.unlockTime;
    }

    /**
     * @notice Update the lock fee
     * @param newFee The new fee amount in wei
     */
    function updateLockFee(uint256 newFee) external onlyFeeRecipient {
        lockFee = newFee;
        emit FeeUpdated(newFee);
    }

    /**
     * @notice Update the fee recipient address
     * @param newRecipient The new fee recipient address
     */
    function updateFeeRecipient(address newRecipient) external onlyFeeRecipient {
        if (newRecipient == address(0)) revert ZeroAddress();
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }
}
