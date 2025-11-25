// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @custom:website https://Omegatools.dev
 * @title OmegaMultisenderV2
 * @notice Improved multisender with atomic fee transfers and better fee management
 */

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

interface IERC20Permit {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract OmegaMultisenderV2 {
    // State variables
    address public treasury;
    address public owner;
    uint256 public feePerRecipient;

    // Events
    event NativeMultisend(
        address indexed sender,
        uint256 totalAmount,
        uint256 recipientCount,
        uint256 feeCharged
    );

    event ERC20Multisend(
        address indexed sender,
        address indexed token,
        uint256 totalAmount,
        uint256 recipientCount,
        uint256 feeCharged
    );

    event FeeUpdated(uint256 indexed oldFee, uint256 indexed newFee);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Errors
    error ZeroAddress();
    error ZeroAmount();
    error InvalidArrayLength();
    error ArrayLengthMismatch();
    error InsufficientBalance();
    error InsufficientAllowance();
    error TransferFailed();
    error InsufficientFee();
    error Unauthorized();
    error MaxRecipientsExceeded();

    // Constants
    uint256 public constant MAX_RECIPIENTS = 200;
    uint256 public constant DEFAULT_FEE = 1 ether; // 1 MON per recipient

    /**
     * @notice Initialize the contract
     * @param _treasury Address to receive fees
     */
    constructor(address _treasury) {
        if (_treasury == address(0)) revert ZeroAddress();

        owner = msg.sender;
        treasury = _treasury;
        feePerRecipient = DEFAULT_FEE;

        emit OwnershipTransferred(address(0), msg.sender);
        emit TreasuryUpdated(address(0), _treasury);
        emit FeeUpdated(0, DEFAULT_FEE);
    }

    /**
     * @notice Modifier to check if caller is the owner
     */
    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    /**
     * @notice Update fee per recipient (only owner)
     * @param newFeePerRecipient New fee in wei per recipient
     */
    function updateFeePerRecipient(uint256 newFeePerRecipient) external onlyOwner {
        uint256 oldFee = feePerRecipient;
        feePerRecipient = newFeePerRecipient;
        emit FeeUpdated(oldFee, newFeePerRecipient);
    }

    /**
     * @notice Update treasury address (only owner)
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert ZeroAddress();
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    /**
     * @notice Transfer ownership to a new owner (only owner)
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /**
     * @notice Calculate total fee for multisend
     * @param recipientCount Number of recipients
     * @return totalFee Total fee in native token
     */
    function calculateFee(uint256 recipientCount) public view returns (uint256 totalFee) {
        totalFee = feePerRecipient * recipientCount;
    }

    /**
     * @notice Send native tokens to multiple recipients (atomic fee transfer)
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to send to each recipient
     */
    function multisendNative(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable {
        if (recipients.length == 0) revert InvalidArrayLength();
        if (recipients.length != amounts.length) revert ArrayLengthMismatch();
        if (recipients.length > MAX_RECIPIENTS) revert MaxRecipientsExceeded();

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            if (recipients[i] == address(0)) revert ZeroAddress();
            if (amounts[i] == 0) revert ZeroAmount();
            totalAmount += amounts[i];
        }

        uint256 totalFee = calculateFee(recipients.length);

        // Check if sender sent enough native tokens (total + fee)
        if (msg.value < totalAmount + totalFee) revert InsufficientBalance();

        // Send tokens to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            if (!success) revert TransferFailed();
        }

        // Atomically transfer fee to treasury
        if (totalFee > 0) {
            (bool feeSuccess, ) = treasury.call{value: totalFee}("");
            if (!feeSuccess) revert TransferFailed();
        }

        // Refund excess native tokens
        uint256 excess = msg.value - (totalAmount + totalFee);
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            if (!refundSuccess) revert TransferFailed();
        }

        emit NativeMultisend(msg.sender, totalAmount, recipients.length, totalFee);
    }

    /**
     * @notice Send same amount of native tokens to multiple recipients
     * @param recipients Array of recipient addresses
     * @param amount Amount to send to each recipient
     */
    function multisendNativeEqual(
        address[] calldata recipients,
        uint256 amount
    ) external payable {
        if (recipients.length == 0) revert InvalidArrayLength();
        if (recipients.length > MAX_RECIPIENTS) revert MaxRecipientsExceeded();
        if (amount == 0) revert ZeroAmount();

        uint256 totalAmount = amount * recipients.length;
        uint256 totalFee = calculateFee(recipients.length);

        // Check if sender sent enough native tokens (total + fee)
        if (msg.value < totalAmount + totalFee) revert InsufficientBalance();

        // Send tokens to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) revert ZeroAddress();
            (bool success, ) = recipients[i].call{value: amount}("");
            if (!success) revert TransferFailed();
        }

        // Atomically transfer fee to treasury
        if (totalFee > 0) {
            (bool feeSuccess, ) = treasury.call{value: totalFee}("");
            if (!feeSuccess) revert TransferFailed();
        }

        // Refund excess
        uint256 excess = msg.value - (totalAmount + totalFee);
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            if (!refundSuccess) revert TransferFailed();
        }

        emit NativeMultisend(msg.sender, totalAmount, recipients.length, totalFee);
    }

    /**
     * @notice Send ERC20 tokens to multiple recipients (atomic fee transfer)
     * @param token The ERC20 token address
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to send to each recipient
     */
    function multisendToken(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable {
        if (token == address(0)) revert ZeroAddress();
        if (recipients.length == 0) revert InvalidArrayLength();
        if (recipients.length != amounts.length) revert ArrayLengthMismatch();
        if (recipients.length > MAX_RECIPIENTS) revert MaxRecipientsExceeded();

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            if (recipients[i] == address(0)) revert ZeroAddress();
            if (amounts[i] == 0) revert ZeroAmount();
            totalAmount += amounts[i];
        }

        uint256 totalFee = calculateFee(recipients.length);

        // Check native token fee payment
        if (msg.value < totalFee) revert InsufficientFee();

        // Check token allowance
        uint256 tokenAllowance = IERC20(token).allowance(msg.sender, address(this));
        if (tokenAllowance < totalAmount) revert InsufficientAllowance();

        // Check sender balance
        uint256 senderBalance = IERC20(token).balanceOf(msg.sender);
        if (senderBalance < totalAmount) revert InsufficientBalance();

        // Transfer tokens to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            bool transferSuccess = IERC20(token).transferFrom(msg.sender, recipients[i], amounts[i]);
            if (!transferSuccess) revert TransferFailed();
        }

        // Atomically transfer fee to treasury
        if (totalFee > 0) {
            (bool feeSuccess, ) = treasury.call{value: totalFee}("");
            if (!feeSuccess) revert TransferFailed();
        }

        // Refund excess native token
        uint256 excess = msg.value - totalFee;
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            if (!refundSuccess) revert TransferFailed();
        }

        emit ERC20Multisend(msg.sender, token, totalAmount, recipients.length, totalFee);
    }

    /**
     * @notice Send same amount of ERC20 tokens to multiple recipients
     * @param token The ERC20 token address
     * @param recipients Array of recipient addresses
     * @param amount Amount to send to each recipient
     */
    function multisendTokenEqual(
        address token,
        address[] calldata recipients,
        uint256 amount
    ) external payable {
        if (token == address(0)) revert ZeroAddress();
        if (recipients.length == 0) revert InvalidArrayLength();
        if (recipients.length > MAX_RECIPIENTS) revert MaxRecipientsExceeded();
        if (amount == 0) revert ZeroAmount();

        uint256 totalAmount = amount * recipients.length;
        uint256 totalFee = calculateFee(recipients.length);

        // Check native token fee payment
        if (msg.value < totalFee) revert InsufficientFee();

        // Check token allowance
        uint256 tokenAllowance = IERC20(token).allowance(msg.sender, address(this));
        if (tokenAllowance < totalAmount) revert InsufficientAllowance();

        // Check sender balance
        uint256 senderBalance = IERC20(token).balanceOf(msg.sender);
        if (senderBalance < totalAmount) revert InsufficientBalance();

        // Transfer tokens to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) revert ZeroAddress();
            bool transferSuccess = IERC20(token).transferFrom(msg.sender, recipients[i], amount);
            if (!transferSuccess) revert TransferFailed();
        }

        // Atomically transfer fee to treasury
        if (totalFee > 0) {
            (bool feeSuccess, ) = treasury.call{value: totalFee}("");
            if (!feeSuccess) revert TransferFailed();
        }

        // Refund excess native token
        uint256 excess = msg.value - totalFee;
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            if (!refundSuccess) revert TransferFailed();
        }

        emit ERC20Multisend(msg.sender, token, totalAmount, recipients.length, totalFee);
    }

    /**
     * @notice Send ERC20 tokens with permit (gasless approval + atomic fee transfer)
     * @param token The ERC20 token address (must support EIP-2612)
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to send to each recipient
     * @param deadline Permit deadline timestamp
     * @param v Permit signature v
     * @param r Permit signature r
     * @param s Permit signature s
     */
    function multisendTokenWithPermit(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external payable {
        if (token == address(0)) revert ZeroAddress();
        if (recipients.length == 0) revert InvalidArrayLength();
        if (recipients.length != amounts.length) revert ArrayLengthMismatch();
        if (recipients.length > MAX_RECIPIENTS) revert MaxRecipientsExceeded();

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            if (recipients[i] == address(0)) revert ZeroAddress();
            if (amounts[i] == 0) revert ZeroAmount();
            totalAmount += amounts[i];
        }

        uint256 totalFee = calculateFee(recipients.length);

        // Check native token fee payment
        if (msg.value < totalFee) revert InsufficientFee();

        // Execute permit for token
        IERC20Permit(token).permit(
            msg.sender,
            address(this),
            totalAmount,
            deadline,
            v,
            r,
            s
        );

        // Check sender balance
        uint256 senderBalance = IERC20(token).balanceOf(msg.sender);
        if (senderBalance < totalAmount) revert InsufficientBalance();

        // Transfer tokens to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            bool transferSuccess = IERC20(token).transferFrom(msg.sender, recipients[i], amounts[i]);
            if (!transferSuccess) revert TransferFailed();
        }

        // Atomically transfer fee to treasury
        if (totalFee > 0) {
            (bool feeSuccess, ) = treasury.call{value: totalFee}("");
            if (!feeSuccess) revert TransferFailed();
        }

        // Refund excess native token
        uint256 excess = msg.value - totalFee;
        if (excess > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: excess}("");
            if (!refundSuccess) revert TransferFailed();
        }

        emit ERC20Multisend(msg.sender, token, totalAmount, recipients.length, totalFee);
    }

    /**
     * @notice Emergency function to withdraw stuck tokens (only owner)
     * @param token Token address (address(0) for native tokens)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (amount == 0) revert ZeroAmount();

        if (token == address(0)) {
            // Withdraw native tokens
            (bool success, ) = owner.call{value: amount}("");
            if (!success) revert TransferFailed();
        } else {
            // Withdraw ERC20 tokens
            bool success = IERC20(token).transfer(owner, amount);
            if (!success) revert TransferFailed();
        }
    }

    /**
     * @notice Allow contract to receive native tokens
     */
    receive() external payable {}
}
