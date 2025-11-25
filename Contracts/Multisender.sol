// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @custom:website https://Omegatools.dev
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

/**
 * @title OmegaMultisender
 * @notice A contract for batch sending native tokens and ERC20 tokens to multiple recipients
 * @dev Supports EIP-2612 permit for gasless approvals and safe transfers
 */
contract OmegaMultisender {

    // State variables
    address public feeRecipient;
    uint256 public feePerRecipient; // Fee in native token per recipient

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

    event FeeUpdated(uint256 newFeePerRecipient);
    event FeeRecipientUpdated(address indexed newRecipient);

    // Errors
    error ZeroAddress();
    error ZeroAmount();
    error InvalidArrayLength();
    error ArrayLengthMismatch();
    error InsufficientBalance();
    error InsufficientAllowance();
    error TransferFailed();
    error InsufficientFee();
    error NotFeeRecipient();
    error MaxRecipientsExceeded();

    // Constants
    uint256 public constant MAX_RECIPIENTS = 200;

    /**
     * @notice Initialize the contract
     * @param _feeRecipient Address to receive fees
     * @param _feePerRecipient Fee in native token per recipient (in wei)
     */
    constructor(address _feeRecipient, uint256 _feePerRecipient) {
        if (_feeRecipient == address(0)) revert ZeroAddress();

        feeRecipient = _feeRecipient;
        feePerRecipient = _feePerRecipient;
    }

    /**
     * @notice Modifier to check if caller is the fee recipient
     */
    modifier onlyFeeRecipient() {
        if (msg.sender != feeRecipient) revert NotFeeRecipient();
        _;
    }

    /**
     * @notice Send native tokens to multiple recipients
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

        // Calculate native token fee (feePerRecipient * number of recipients)
        uint256 totalFee = feePerRecipient * recipients.length;

        // Check if sender sent enough native tokens (total + fee)
        if (msg.value < totalAmount + totalFee) revert InsufficientBalance();

        // Send tokens to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            if (!success) revert TransferFailed();
        }

        // Transfer fee to fee recipient
        if (totalFee > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: totalFee}("");
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
     * @notice Send ERC20 tokens to multiple recipients
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

        // Calculate native token fee (feePerRecipient * number of recipients)
        uint256 totalFee = feePerRecipient * recipients.length;

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

        // Transfer fee to fee recipient
        if (totalFee > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: totalFee}("");
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
     * @notice Send ERC20 tokens with permit (gasless approval)
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

        // Calculate native token fee (feePerRecipient * number of recipients)
        uint256 totalFee = feePerRecipient * recipients.length;

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

        // Transfer fee to fee recipient
        if (totalFee > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: totalFee}("");
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

        // Calculate native token fee (feePerRecipient * number of recipients)
        uint256 totalFee = feePerRecipient * recipients.length;

        // Check if sender sent enough native tokens (total + fee)
        if (msg.value < totalAmount + totalFee) revert InsufficientBalance();

        // Send tokens to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) revert ZeroAddress();
            (bool success, ) = recipients[i].call{value: amount}("");
            if (!success) revert TransferFailed();
        }

        // Transfer fee to fee recipient
        if (totalFee > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: totalFee}("");
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

        // Calculate native token fee (feePerRecipient * number of recipients)
        uint256 totalFee = feePerRecipient * recipients.length;

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

        // Transfer fee to fee recipient
        if (totalFee > 0) {
            (bool feeSuccess, ) = feeRecipient.call{value: totalFee}("");
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
     * @notice Calculate total native token fee for multisend
     * @param recipientCount Number of recipients
     * @return totalFee Total native token fee
     */
    function calculateFee(uint256 recipientCount) external view returns (uint256 totalFee) {
        totalFee = feePerRecipient * recipientCount;
    }

    /**
     * @notice Update fee per recipient
     * @param newFeePerRecipient New fee per recipient in native token (wei)
     */
    function updateFeePerRecipient(uint256 newFeePerRecipient) external onlyFeeRecipient {
        feePerRecipient = newFeePerRecipient;
        emit FeeUpdated(newFeePerRecipient);
    }

    /**
     * @notice Update fee recipient
     * @param newRecipient New fee recipient address
     */
    function updateFeeRecipient(address newRecipient) external onlyFeeRecipient {
        if (newRecipient == address(0)) revert ZeroAddress();
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }
}
