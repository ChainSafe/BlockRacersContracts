// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

// $$$$$$$\  $$\       $$$$$$\   $$$$$$\  $$\   $$\       $$$$$$$\   $$$$$$\   $$$$$$\  $$$$$$$$\ $$$$$$$\   $$$$$$\  
// $$  __$$\ $$ |     $$  __$$\ $$  __$$\ $$ | $$  |      $$  __$$\ $$  __$$\ $$  __$$\ $$  _____|$$  __$$\ $$  __$$\ 
// $$ |  $$ |$$ |     $$ /  $$ |$$ /  \__|$$ |$$  /       $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |      $$ |  $$ |$$ /  \__|
// $$$$$$$\ |$$ |     $$ |  $$ |$$ |      $$$$$  /        $$$$$$$  |$$$$$$$$ |$$ |      $$$$$\    $$$$$$$  |\$$$$$$\  
// $$  __$$\ $$ |     $$ |  $$ |$$ |      $$  $$<         $$  __$$< $$  __$$ |$$ |      $$  __|   $$  __$$<  \____$$\ 
// $$ |  $$ |$$ |     $$ |  $$ |$$ |  $$\ $$ |\$$\        $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |      $$ |  $$ |$$\   $$ |
// $$$$$$$  |$$$$$$$$\ $$$$$$  |\$$$$$$  |$$ | \$$\       $$ |  $$ |$$ |  $$ |\$$$$$$  |$$$$$$$$\ $$ |  $$ |\$$$$$$  |
// \_______/ \________|\______/  \______/ \__|  \__|      \__|  \__|\__|  \__| \______/ \________|\__|  \__| \______/ 

/// @title Block Racers Token Contract
/// @author RyRy79261, Sneakz
/// @notice This contract manages the ERC20 token used within the Block Racers game at https://github.com/Chainsafe/BlockRacers
contract BlockRacersToken is ERC20, ERC2771Context, Ownable, ReentrancyGuard {
    /// @dev Wallet that auth signatures come from
    address public issuerAccount;
    
    /// @dev Nonce to stop replay attacks
    mapping(address => uint256) private playerNonce;

    event NewIssuer(address newIssuer);

    error InvalidIssuer(address proposedIssuer);

    modifier onlyValidPermit(bytes memory permit, address player, uint256 amount) {
        require(SignatureChecker.isValidSignatureNow(
            issuerAccount, 
            MessageHashUtils.toEthSignedMessageHash(keccak256(abi.encodePacked(playerNonce[player], player, amount))),
            permit),
            "Sig not made by auth");
        _;
    }

    constructor(
        address trustedForwarder,
        address owner,
        address issuerAccount_, 
        uint256 initialMint_
    ) ERC20("BlockRacersToken", "RACE") ERC2771Context(trustedForwarder) Ownable(owner) {
        issuerAccount = issuerAccount_;

        // TODO: If migrated to a mainnet, this logic should be expanded depending on distribution 
        if (initialMint_ > 0) {
            _mint(issuerAccount_, initialMint_);
        }
    }

    /// @dev Used to mint tokens to an address
    /// @param to The address to mint tokens to
    /// @param amount The amount of tokens to mint to the address
    /// @param permit The signed permit to allow for minting tokens
    /// @return true if  mint is successful
    function mint(address to, uint256 amount, bytes memory permit) 
        external 
        onlyValidPermit(permit, to, amount) 
        nonReentrant() 
        returns (bool) {
        playerNonce[_msgSender()]++;
        _mint(to, amount);
        return true;
    }

    function setNewIssuerAccount(address newIssuer) external onlyOwner() {
        if (newIssuer == address(0) || newIssuer == issuerAccount) 
            revert InvalidIssuer(newIssuer);

        issuerAccount = newIssuer;
        emit NewIssuer(issuerAccount);
    }

    function getPlayerNonce(address player) external view returns(uint256) {
        return playerNonce[player];
    }

    /**
     * @dev Override required as inheritance was indeterminant for which function to use
     */
    function _msgSender() internal view override(ERC2771Context, Context) returns (address sender) {
        return ERC2771Context._msgSender();
    }

    /**
     * @dev Override required as inheritance was indeterminant for which function to use
     */
    function _msgData() internal view override(ERC2771Context, Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}