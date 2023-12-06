// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./BlockRacersToken.sol";

// $$$$$$$\  $$\       $$$$$$\   $$$$$$\  $$\   $$\       $$$$$$$\   $$$$$$\   $$$$$$\  $$$$$$$$\ $$$$$$$\   $$$$$$\  
// $$  __$$\ $$ |     $$  __$$\ $$  __$$\ $$ | $$  |      $$  __$$\ $$  __$$\ $$  __$$\ $$  _____|$$  __$$\ $$  __$$\ 
// $$ |  $$ |$$ |     $$ /  $$ |$$ /  \__|$$ |$$  /       $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |      $$ |  $$ |$$ /  \__|
// $$$$$$$\ |$$ |     $$ |  $$ |$$ |      $$$$$  /        $$$$$$$  |$$$$$$$$ |$$ |      $$$$$\    $$$$$$$  |\$$$$$$\  
// $$  __$$\ $$ |     $$ |  $$ |$$ |      $$  $$<         $$  __$$< $$  __$$ |$$ |      $$  __|   $$  __$$<  \____$$\ 
// $$ |  $$ |$$ |     $$ |  $$ |$$ |  $$\ $$ |\$$\        $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |      $$ |  $$ |$$\   $$ |
// $$$$$$$  |$$$$$$$$\ $$$$$$  |\$$$$$$  |$$ | \$$\       $$ |  $$ |$$ |  $$ |\$$$$$$  |$$$$$$$$\ $$ |  $$ |\$$$$$$  |
// \_______/ \________|\______/  \______/ \__|  \__|      \__|  \__|\__|  \__| \______/ \________|\__|  \__| \______/ 
/// @title Block Racers NFT Contract
/// @author Sneakz
/// @notice This contract holds functions used for the Block Racers NFTs used in the game at https://github.com/Chainsafe/BlockRacers
/// @dev All function calls are tested and have been implemented on the BlockRacers Game

contract BlockRacersNfts is ERC1155, ERC1155URIStorage, ReentrancyGuard {
    /// @dev Initializes the ERC20 token
    BlockRacersToken immutable _token;
   
    /// @dev Mappings
    /// @dev Wallet that tokens go to on purchases
    address devWallet = 0x2dF3b328060A613DF0D9C9E12a34a670429D4648;
    /// @dev Wallet that auth signatures come from
    address authWallet = 0x0d9566FcE2513cBD388DCD7749a873900033401C;
   
    // @dev Nft id
    uint256 nftId = 1;
     // @dev Total Nfts
    uint256 totalNftCount;
    /// @dev The price of Nfts
    uint256 public nftPrice = 50*1e18;
    /// @dev The price of Nft upgrades
    uint256 public upgradePrice = 20*1e18;
    /// @dev Base URI for NFTBoard ipfs image
    string constant public BASE_URI = "https://ipfs.chainsafe.io/ipfs/";
    string constant public URI1 = "QmdW2tRdCw2YERvhzbMHn2qcaBHPMNo5ofsoo8q9q9N3Qe";
    string constant public URI2 = "QmWavwGJgqxMP38a6cxn9ehJASqdXNNcRT4YD7sa3dDMST";
    string constant public URI3 = "QmevuY959udKfEYXJvLZmVqiNFVe6KfqqxMRprYbtRhncP";

    /// @dev Nonce to stop cheaters
    mapping(address => uint256) public nonce;

    /// @dev Array of NFT IDs for an address
    mapping(address => uint256[]) public ownerNftIds;
    /// @dev Mapping of who owns what nftid
    mapping(uint256 => address) public carOwner;
    /// @dev Total NFTs an address owns
    mapping(address => uint256) public ownerCarCount;

    /// @dev Nft stats
    mapping(uint256 => uint256) public nftType;
    mapping(uint256 => uint256) public engineLevel;
    mapping(uint256 => uint256) public handlingLevel;
    mapping(uint256 => uint256) public nosLevel;

    /// @dev Contract events
    event MintNft(address indexed wallet, uint256 nftId);
    event UpgradeEngine(address indexed wallet, uint256 _amount);
    event UpgradeHandling(address indexed wallet, uint256 _amount);
    event UpgradeNos(address indexed wallet, uint256 _amount);

     /// @dev Constructor sets token to be used and nft info, input the RACE token address here on deployment
    constructor(BlockRacersToken token, string memory baseUri) ERC1155(baseUri) {
        _token = token;
    }

    /// @dev Contract functions
    /// @notice Mints an Nft to a users wallet
    /// @param _amount The amount of token being sent
    /// @return true if successful
    function mintNft(uint _amount, uint256 _nftType, bytes memory _sig) external nonReentrant() returns (bool) {
        require (_amount == nftPrice, "You need to pay more tokens");
        bytes32 messageHash = getMessageHash(abi.encodePacked(nonce[msg.sender], msg.sender, _amount, _nftType));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        require(recover(ethSignedMessageHash, _sig) == authWallet, "Sig not made by auth");
        nonce[msg.sender]++;
        _token.transferFrom(msg.sender, devWallet, _amount);
        ownerNftIds[msg.sender].push(nftId);
        carOwner[nftId] = msg.sender;
        engineLevel[nftId] = 1;
        handlingLevel[nftId] = 1;
        nosLevel[nftId] = 1;
        if (_nftType == 1) {
            nftType[nftId] = 1;
        }
        else if (_nftType == 2) {
            nftType[nftId] = 2;
        }
        else {
            nftType[nftId] = 3;
        }
        ++nftId;
        ++totalNftCount;
        emit MintNft(msg.sender, nftId);
        return true;
    }

    /// @notice Upgrades the Nfts engine level
    /// @param _amount The amount of token being sent
    /// @param _nftId The id of the nft being upgraded
    /// @return true if successful
    function upgradeEngine(uint _amount, uint _nftId, bytes memory _sig) external nonReentrant() returns (bool) {
        require (carOwner[_nftId] == msg.sender, "You dont own this nft");
        bytes32 messageHash = getMessageHash(abi.encodePacked(nonce[msg.sender], msg.sender, _amount));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        require(recover(ethSignedMessageHash, _sig) == authWallet, "Sig not made by auth");
        require (_amount == upgradePrice, "You need to pay more tokens");
        require (engineLevel[_nftId] <= 2, "Upgrade level max");
        nonce[msg.sender]++;
        _token.transferFrom(msg.sender, devWallet, _amount);
        engineLevel[_nftId] += 1;
        emit UpgradeEngine(msg.sender, _amount);
        return true;
    }

    /// @notice Upgrades the Nfts handling level
    /// @param _amount The amount of token being sents
    /// @param _nftId The id of the nft being upgraded
    /// @return true if successful
    function upgradeHandling(uint _amount, uint _nftId, bytes memory _sig) external nonReentrant() returns (bool) {
        require (carOwner[_nftId] == msg.sender, "You dont own this nft");
        require (handlingLevel[_nftId] <= 2, "Upgrade level max");
        require (_amount == upgradePrice, "You need to pay more tokens");
        bytes32 messageHash = getMessageHash(abi.encodePacked(nonce[msg.sender], msg.sender, _amount));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        require(recover(ethSignedMessageHash, _sig) == authWallet, "Sig not made by auth");
        nonce[msg.sender]++;
        _token.transferFrom(msg.sender, devWallet, _amount);
        handlingLevel[_nftId] += 1;
        emit UpgradeHandling(msg.sender, _amount);
        return true;
    }

    /// @notice Upgrades the Nfts Nos level
    /// @param _amount The amount of token being sent
    /// @param _nftId The id of the nft being upgraded
    /// @return true if successful
    function upgradeNos(uint _amount, uint _nftId, bytes memory _sig) external nonReentrant() returns (bool) {
        require (carOwner[_nftId] == msg.sender, "You dont own this nft");
        require (nosLevel[_nftId] <= 2, "Upgrade level max");
        require (_amount == upgradePrice, "You need to pay more tokens");
        bytes32 messageHash = getMessageHash(abi.encodePacked(nonce[msg.sender], msg.sender, _amount));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        require(recover(ethSignedMessageHash, _sig) == authWallet, "Sig not made by auth");
        nonce[msg.sender]++;
        _token.transferFrom(msg.sender, devWallet, _amount);
        nosLevel[_nftId] += 1;
        emit UpgradeNos(msg.sender, _amount);
        return true;
    }

    /// @notice Gets an array of NFTs owned by an address
    /// @return uint256[] The NFTIDs owned by an address
    function getOwnerNftIds(address _wallet) external view returns (uint256[] memory) {
        return ownerNftIds[_wallet];
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

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function uri(uint256 tokenId) public view override(ERC1155URIStorage, ERC1155) returns (string memory) {
        return super.uri(tokenId);
    }
}