// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "/contracts/BlockRacersToken.sol";

// $$$$$$$\  $$\       $$$$$$\   $$$$$$\  $$\   $$\       $$$$$$$\   $$$$$$\   $$$$$$\  $$$$$$$$\ $$$$$$$\   $$$$$$\  
// $$  __$$\ $$ |     $$  __$$\ $$  __$$\ $$ | $$  |      $$  __$$\ $$  __$$\ $$  __$$\ $$  _____|$$  __$$\ $$  __$$\ 
// $$ |  $$ |$$ |     $$ /  $$ |$$ /  \__|$$ |$$  /       $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |      $$ |  $$ |$$ /  \__|
// $$$$$$$\ |$$ |     $$ |  $$ |$$ |      $$$$$  /        $$$$$$$  |$$$$$$$$ |$$ |      $$$$$\    $$$$$$$  |\$$$$$$\  
// $$  __$$\ $$ |     $$ |  $$ |$$ |      $$  $$<         $$  __$$< $$  __$$ |$$ |      $$  __|   $$  __$$<  \____$$\ 
// $$ |  $$ |$$ |     $$ |  $$ |$$ |  $$\ $$ |\$$\        $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |      $$ |  $$ |$$\   $$ |
// $$$$$$$  |$$$$$$$$\ $$$$$$  |\$$$$$$  |$$ | \$$\       $$ |  $$ |$$ |  $$ |\$$$$$$  |$$$$$$$$\ $$ |  $$ |\$$$$$$  |
// \_______/ \________|\______/  \______/ \__|  \__|      \__|  \__|\__|  \__| \______/ \________|\__|  \__| \______/ 

/// @title Block Racers Wagering Contract
/// @author Sneakz
/// @notice This contract holds functions used for the Block Racers wagering used in the game at https://github.com/Chainsafe/BlockRacers
/// @dev All function calls are tested and have been implemented on the BlockRacers Game

contract BlockRacersWagering is ReentrancyGuard {
    
    /// @dev Initializes the ERC20 token
    BlockRacersToken immutable _token;
    /// @dev Constructor sets token to be used and nft info, input the RACE token address here on deployment
    constructor(BlockRacersToken token) {
        _token = token;
    }

    /// @dev Mappings
    /// @dev Wallet that tokens go to on purchases
    address devWallet = 0xb74C9e663914722914b9D7AeE3C26eD2A94261e6;
    /// @dev Wallet that auth signatures come from
    address authWallet = 0x0d9566FcE2513cBD388DCD7749a873900033401C;
    // @dev Pvp wager amount
    mapping(address => uint256) public pvpWager;
    /// @dev Nonce to stop cheaters
    mapping(address => uint256) public nonce;
    
    /// @dev Contract events
    event SetPVPWager(address indexed wallet, uint256 amount);
    event AcceptPVPWager(address indexed wallet, address indexed opponent, uint256 amount);
    event ClaimedPVPWinnings(address indexed wallet, address indexed opponent, uint256 amount);

    /// @dev Contract functions

    /// @notice PVP and wager tokens
    /// @param _amount The amount of tokens being wagered
    /// @param _sig The signature from the authorization wallet
    /// @return true if successful
    function setPvpWager(uint256 _amount, bytes memory _sig) external nonReentrant() returns (bool) {
        bytes32 messageHash = getMessageHash(abi.encodePacked(nonce[msg.sender], _amount, msg.sender));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        require(recover(ethSignedMessageHash, _sig) == authWallet, "Sig not made by auth");
        require (_token.balanceOf(address(msg.sender)) >= _amount, "Not enough balance to do that");
        nonce[msg.sender]++;
        pvpWager[msg.sender] = _amount;
        emit SetPVPWager(msg.sender, _amount);
        return true;
    }

    /// @notice PVP and wager tokens
    /// @param _opponent The address of the challenging opponent
    /// @param _amount The amount of tokens being wagered
    /// @param _sig The signature from the authorization wallet
    /// @return true if successful
    function acceptPvpWager(address _opponent, uint256 _amount, bytes memory _sig) external nonReentrant() returns (bool) {
        bytes32 messageHash = getMessageHash(abi.encodePacked(nonce[msg.sender], _amount, msg.sender, _opponent));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        require(recover(ethSignedMessageHash, _sig) == authWallet, "Sig not made by auth");
        require (_token.balanceOf(address(msg.sender)) >= _amount, "Not enough balance to do that");
        nonce[msg.sender]++;
        pvpWager[msg.sender] = _amount;
        emit AcceptPVPWager(msg.sender, _opponent, _amount);
        return true;
    }

    /// @notice Claim PVP Winnings
    /// @param _opponent The address of the challenging opponent
    /// @param _amount The amount of tokens being wagered
    /// @param _sig The signature from the authorization wallet
    /// @return true if successful
    function pvpWagerClaim(address _opponent, uint256 _amount, bytes memory _sig) external nonReentrant() returns (bool) {
        require(pvpWager[msg.sender] == _amount, "Wager amount wrong");
        bytes32 messageHash = getMessageHash(abi.encodePacked(nonce[msg.sender], _amount, msg.sender, _opponent));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        require(recover(ethSignedMessageHash, _sig) == authWallet, "Sig not made by auth");
        nonce[msg.sender]++;
        _token.transferFrom(_opponent, msg.sender, _amount);
        emit ClaimedPVPWinnings(msg.sender, _opponent, _amount);
        return true;
    }

    /// @dev Used for authentication to check if values came from inside the Block Racers game following solidity standards
    function VerifySig(address _signer, bytes memory _message, bytes memory _sig) external pure returns (bool) {
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        return recover(ethSignedMessageHash, _sig) == _signer;
    }
    function getMessageHash(bytes memory _message) internal pure returns (bytes32) {
        return keccak256(_message);
    }
    function getEthSignedMessageHash(bytes32 _messageHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",_messageHash));
    }
    function recover(bytes32 _ethSignedMessageHash, bytes memory _sig) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = _split(_sig);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }
    function _split (bytes memory _sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(_sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(_sig, 32))
            s := mload(add(_sig, 64))
            v := byte(0, mload(add(_sig, 96)))
        }
    }
}