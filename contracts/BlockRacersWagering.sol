// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// $$$$$$$\  $$\       $$$$$$\   $$$$$$\  $$\   $$\       $$$$$$$\   $$$$$$\   $$$$$$\  $$$$$$$$\ $$$$$$$\   $$$$$$\  
// $$  __$$\ $$ |     $$  __$$\ $$  __$$\ $$ | $$  |      $$  __$$\ $$  __$$\ $$  __$$\ $$  _____|$$  __$$\ $$  __$$\ 
// $$ |  $$ |$$ |     $$ /  $$ |$$ /  \__|$$ |$$  /       $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |      $$ |  $$ |$$ /  \__|
// $$$$$$$\ |$$ |     $$ |  $$ |$$ |      $$$$$  /        $$$$$$$  |$$$$$$$$ |$$ |      $$$$$\    $$$$$$$  |\$$$$$$\  
// $$  __$$\ $$ |     $$ |  $$ |$$ |      $$  $$<         $$  __$$< $$  __$$ |$$ |      $$  __|   $$  __$$<  \____$$\ 
// $$ |  $$ |$$ |     $$ |  $$ |$$ |  $$\ $$ |\$$\        $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |      $$ |  $$ |$$\   $$ |
// $$$$$$$  |$$$$$$$$\ $$$$$$  |\$$$$$$  |$$ | \$$\       $$ |  $$ |$$ |  $$ |\$$$$$$  |$$$$$$$$\ $$ |  $$ |\$$$$$$  |
// \_______/ \________|\______/  \______/ \__|  \__|      \__|  \__|\__|  \__| \______/ \________|\__|  \__| \______/ 

/// @title Block Racers Wagering Contract
/// @author RyRy79261
/// @notice This contract holds functions used for the Block Racers wagering used in the game at https://github.com/Chainsafe/BlockRacers
/// @dev All function calls are tested and have been implemented on the BlockRacers Game

contract BlockRacersWagering is Context, ReentrancyGuard {
    enum WagerState { NOT_STARTED, CREATED, ACCEPTED, COMPLETED, CANCELLED }
    struct Wager {
        uint256 prize;
        address opponent;
        WagerState state;
    }

    /// @dev Initializes the ERC20 token
    IERC20 public immutable token;
    
    /// @dev Wallet that auth signatures come from
    address private issuerAccount;
    
    // @dev Pvp wager amount
    mapping(address => mapping (uint256 => uint) name) private pvpWager;
    mapping(address => uint256) private playerWagerNonce;
    
    /// @dev Contract events
    event WagerCreated(address indexed player, uint256 indexed wagerNonce, uint256 prize);
    event WagerAccepted(address indexed player, uint256 indexed wagerNonce, address indexed opponent, uint256 prize);
    event WagerCancelled(address indexed player, uint256 indexed wagerNonce, address indexed opponent, uint256 prize);
    event WagerCompleted(address indexed player, uint256 indexed wagerNonce, address indexed opponent, uint256 prize);

    modifier validCreateWagerPermit(bytes memory permit, uint256 amount) {
        // bytes32 messageHash = getMessageHash(abi.encodePacked(nonce[msg.sender], amount, msg.sender));
        // bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        // require(recover(ethSignedMessageHash, permit) == issuerAccount, "Sig not made by auth");
        require(SignatureChecker.isValidSignatureNow(
            issuerAccount, 
            MessageHashUtils.toEthSignedMessageHash(keccak256(amount, _msgSender())),
            permit),
            "Sig not made by auth");
        _;
    }

    modifier validAcceptWagerPermit(bytes memory permit, address wagerCreator, uint256 wagerNonce) {
        // bytes32 messageHash = getMessageHash(abi.encodePacked(nonce[msg.sender], amount, msg.sender));
        // bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        // require(recover(ethSignedMessageHash, permit) == issuerAccount, "Sig not made by auth");
        // This Permit follows the format of:
        // wagerCreator, wager nonce, opponent
        require(SignatureChecker.isValidSignatureNow(
            issuerAccount, 
            MessageHashUtils.toEthSignedMessageHash(keccak256(abi.encodePacked(wagerCreator, wagerNonce, _msgSender()))),
            permit),
            "Sig not made by auth");
        _;
    }

    modifier onlyWagerState(WagerState state) {
        i
    }

    /// @dev Constructor sets token to be used and nft info, input the RACE token address here on deployment
    constructor(
        IERC20 token_, 
        address issuerAccount_
    ) {
        token = token_;
        issuerAccount = issuerAccount_;
    }

    
    /// @notice PVP and wager tokens
    /// @param prize The amount of tokens being wagered
    /// @param permit The signature from the authorization wallet
    /// @return true if successful
    function createPvpWager(uint256 prize, bytes memory permit) 
        external 
        validCreateWagerPermit(permit, prize) 
        nonReentrant() 
        returns (bool) {
        address player = _msgSender();

        require (token.balanceOf(player) >= prize, "Not enough balance to do that");
        // TODO: Check success
        token.transferFrom(player, address(this), prize);
        playerWagerNonce[player]++;
        pvpWager[player][playerWagerNonce[player]] = Wager(prize, address(0), WagerState.CREATED);
        emit WagerCreated(msg.sender, playerWagerNonce[player], prize);
        return true;
    }

    /// @notice PVP and wager tokens
    /// @param permit The signature from the authorization wallet
    /// @return true if successful
    function acceptWager(address wagerCreator, uint256 wagerNonce, bytes memory permit) 
        external 
        validAcceptWagerPermit(permit, wagerCreator, wagerNonce) 
        nonReentrant() 
        returns (bool) {
        address opponentAddress = _msgSender();
        Wager storage wager = pvpWager[wagerCreator][playerWagerNonce[wagerCreator]];

        // TODO: Check success
        token.transferFrom(opponentAddress, address(this), wager.prize);

        wager.opponent = opponentAddress;
        wager.state = Wager.WagerAccepted;
       
        emit WagerAccepted(msg.sender, _opponent, _amount);
        return true;
    }

    /// @notice Claim PVP Winnings
    /// @param _opponent The address of the challenging opponent
    /// @param _amount The amount of tokens being wagered
    /// @param _sig The signature from the authorization wallet
    /// @return true if successful
    function pvpWagerClaim(address _opponent, uint256 _amount, bytes memory _sig) external nonReentrant() returns (bool) {
        require(pvpWager[msg.sender] == _amount, "Wager amount wrong");
        bytes32 messageHash = getMessageHash(abi.encodePacked(_amount, msg.sender, _opponent));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        require(recover(ethSignedMessageHash, _sig) == authWallet, "Sig not made by auth");

        _token.transferFrom(_opponent, msg.sender, _amount);
        emit ClaimedPVPWinnings(msg.sender, _opponent, _amount);
        return true;
    }

    /// @dev Used for authentication to check if values came from inside the Block Racers game following solidity standards
    // function VerifySig(address _signer, bytes memory _message, bytes memory _sig) external pure returns (bool) {
    //     bytes32 messageHash = getMessageHash(_message);
    //     bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
    //     return recover(ethSignedMessageHash, _sig) == _signer;
    // }
    // function getMessageHash(bytes memory _message) internal pure returns (bytes32) {
    //     return keccak256(_message);
    // }
    // function getEthSignedMessageHash(bytes32 _messageHash) internal pure returns (bytes32) {
    //     return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",_messageHash));
    // }
    // function recover(bytes32 _ethSignedMessageHash, bytes memory _sig) internal pure returns (address) {
    //     (bytes32 r, bytes32 s, uint8 v) = _split(_sig);
    //     return ecrecover(_ethSignedMessageHash, v, r, s);
    // }
    // function _split (bytes memory _sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
    //     require(_sig.length == 65, "Invalid signature length");
    //     assembly {
    //         r := mload(add(_sig, 32))
    //         s := mload(add(_sig, 64))
    //         v := byte(0, mload(add(_sig, 96)))
    //     }
    // }
}