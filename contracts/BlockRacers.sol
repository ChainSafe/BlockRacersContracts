// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "./BlockRacersToken.sol";
import "./BlockRacersAssets.sol";

// $$$$$$$\  $$\       $$$$$$\   $$$$$$\  $$\   $$\       $$$$$$$\   $$$$$$\   $$$$$$\  $$$$$$$$\ $$$$$$$\   $$$$$$\  
// $$  __$$\ $$ |     $$  __$$\ $$  __$$\ $$ | $$  |      $$  __$$\ $$  __$$\ $$  __$$\ $$  _____|$$  __$$\ $$  __$$\ 
// $$ |  $$ |$$ |     $$ /  $$ |$$ /  \__|$$ |$$  /       $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |      $$ |  $$ |$$ /  \__|
// $$$$$$$\ |$$ |     $$ |  $$ |$$ |      $$$$$  /        $$$$$$$  |$$$$$$$$ |$$ |      $$$$$\    $$$$$$$  |\$$$$$$\  
// $$  __$$\ $$ |     $$ |  $$ |$$ |      $$  $$<         $$  __$$< $$  __$$ |$$ |      $$  __|   $$  __$$<  \____$$\ 
// $$ |  $$ |$$ |     $$ |  $$ |$$ |  $$\ $$ |\$$\        $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |      $$ |  $$ |$$\   $$ |
// $$$$$$$  |$$$$$$$$\ $$$$$$  |\$$$$$$  |$$ | \$$\       $$ |  $$ |$$ |  $$ |\$$$$$$  |$$$$$$$$\ $$ |  $$ |\$$$$$$  |
// \_______/ \________|\______/  \______/ \__|  \__|      \__|  \__|\__|  \__| \______/ \________|\__|  \__| \______/ 
/// @title Block Racers NFT Contract
/// @author RyRy79261, Sneakz
/// @notice This contract holds functions used for the Block Racers NFTs used in the game at https://github.com/Chainsafe/BlockRacers
/// @dev All function calls are tested and have been implemented on the BlockRacers Game

contract BlockRacers is Ownable, ReentrancyGuard {
    enum GameItem{ CAR, ENGINE, HANDLING, NOS }
    struct CarStats {
        uint256 carCost;
        uint16 handlingLevel;
        uint16 engineLevel;
        uint16 nosLevel;
    }

    struct GameSettingsData {
        uint256 carCost;
        uint256 enginePrice;
        uint256 handlingPrice;
        uint256 nosPrice;
        uint16 handlingMaxLevel;
        uint16 engineMaxLevel;
        uint16 nosMaxLevel;
    }
    
    /// @dev BlockRacers ERC20 address
    BlockRacersToken public immutable token;

    /// @dev BlockRacers ERC1155 address
    BlockRacersAssets public immutable assets;
   
    /// @dev Wallet that tokens go to on purchases
    address public blockRacersFeeAccount;
    /// @dev Wallet that auth signatures come from
    address public issuerAccount;
   
    // @dev Current car ID, also used to determine number of cars minted
    uint256 private _latestCarId = 0;
    
    uint256 private _currentSettingsId = 0;

    /// @dev Base URI for NFTBoard ipfs image
    string constant public BASE_URI = "https://ipfs.chainsafe.io/ipfs/";
    string constant public URI1 = "QmdW2tRdCw2YERvhzbMHn2qcaBHPMNo5ofsoo8q9q9N3Qe";
    string constant public URI2 = "QmWavwGJgqxMP38a6cxn9ehJASqdXNNcRT4YD7sa3dDMST";
    string constant public URI3 = "QmevuY959udKfEYXJvLZmVqiNFVe6KfqqxMRprYbtRhncP";

    /// @dev Nonce to stop replay attacks
    mapping(address => uint256) private playerNonce;

    /// @dev Mapping of car stats per NFT
    mapping(uint256 => CarStats) private carStats;
    mapping(uint256 => GameSettingsData) private gameSettingsData;

    /// @dev Contract events
    event MintCar(address indexed wallet, uint256 carId);
    event UpgradeEngine(address indexed wallet, uint256 _amount, uint16 level);
    event UpgradeHandling(address indexed wallet, uint256 _amount, uint16 level);
    event UpgradeNos(address indexed wallet, uint256 _amount, uint16 level);

    error NotCarOwner(uint256 carId);
    error InvalidPermit(address permitSigner, bytes permit);
    error InvalidItemType();
    error UpgradeNotPossible(uint256 carId, GameItem gameItem, uint16 currentLevel, uint16 maxLevel);

    modifier onlyCarOwner(uint256 carId) {
        if (assets.balanceOf(_msgSender(), carId) != 1)
            revert NotCarOwner(carId);

        _;
    }

    modifier onlyValidPermit(bytes memory permit, GameItem itemType) {
        (uint256 price, uint16 maxLevel) = getItemData(itemType);

        // bytes32 messageHash = getMessageHash(abi.encodePacked(playerNonce[_msgSender()], _msgSender(), price, uint256(itemType)));
        // bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        // require(recover(ethSignedMessageHash, permit) == issuerAccount, "Sig not made by auth");
        require(SignatureChecker.isValidSignatureNow(
            issuerAccount, 
            MessageHashUtils.toEthSignedMessageHash(
                keccak256(
                    abi.encodePacked(playerNonce[_msgSender()], 
                    _msgSender(), 
                    price, 
                    uint256(itemType)
                ))),
            permit),
            "Sig not made by auth");
        _;
    }

    modifier levelNotMaxed(uint256 carId, GameItem itemType){
        (,uint16 maxLevel) = getItemData(itemType);
        uint16 currentLevel;
        if (itemType == GameItem.ENGINE) {
            currentLevel = carStats[carId].engineLevel;
        } else if (itemType == GameItem.HANDLING) {
            currentLevel = carStats[carId].handlingLevel;
        } else if (itemType == GameItem.NOS) {
            currentLevel = carStats[carId].nosLevel;
        } else {
            revert InvalidItemType();
        } 

        if (currentLevel >= maxLevel) 
            revert UpgradeNotPossible(carId, itemType, currentLevel, maxLevel);
        _;
    }

     /// @dev Constructor sets token to be used and nft info, input the RACE token address here on deployment
    constructor(
        address admin_,
        BlockRacersToken token_, 
        BlockRacersAssets assets_,
        address blockRacersFeeAccount_,
        address issuerAccount_,
        GameSettingsData memory gameSettingsData_
        ) Ownable(admin_) {
        token = token_;
        assets = assets_;
        blockRacersFeeAccount = blockRacersFeeAccount_;
        issuerAccount = issuerAccount_;
        gameSettingsData[_currentSettingsId] = gameSettingsData_;
    }

    function setNewGameSettings(GameSettingsData memory newSettings) external onlyOwner() {
        ++_currentSettingsId;
        gameSettingsData[_currentSettingsId] = newSettings;
    }

    /// @dev Contract functions
    /// @notice Mints an Nft to a users wallet
    /// @param permit The signed permit to allow for minting a car
    /// @return true if successful
    function mintCar(bytes memory permit) 
        external 
        onlyValidPermit(permit, GameItem.CAR) 
        nonReentrant() 
        returns (bool) {
        (uint256 price, ) = getItemData(GameItem.CAR);
        address player = _msgSender();

        // Attempt payment
        // TODO: ensure success
        playerNonce[player]++;
        token.transferFrom(player, blockRacersFeeAccount, price);

        ++_latestCarId;
        assets.mint(player, _latestCarId, 1);

        carStats[_latestCarId] = CarStats(price, 1, 1, 1);
        emit MintCar(player, _latestCarId);
        return true;
    }

    /// @notice Upgrades the car's engine level
    /// @param carId The id of the car being upgraded
    /// @param permit The permit authorizing the upgrade
    /// @return true if successful
    function upgradeEngine(uint256 carId, bytes memory permit)
        external
        onlyCarOwner(carId) 
        levelNotMaxed(carId, GameItem.ENGINE)
        onlyValidPermit(permit, GameItem.ENGINE) 
        nonReentrant() 
        returns (bool) {
        (uint256 price,) = getItemData(GameItem.ENGINE);
        address player = _msgSender();
        
        playerNonce[player]++;
        token.transferFrom(player, blockRacersFeeAccount, price);
        CarStats storage car = carStats[carId];
        ++car.engineLevel;

        emit UpgradeEngine(player, price, car.engineLevel);
        return true;
    }

    /// @notice Upgrades the car's handling level
    /// @param carId The id of the car being upgraded
    /// @param permit The permit authorizing the upgrade
    /// @return true if successful
    function upgradeHandling(uint256 carId, bytes memory permit) 
        external 
        onlyCarOwner(carId) 
        levelNotMaxed(carId, GameItem.HANDLING)
        onlyValidPermit(permit, GameItem.HANDLING) 
        nonReentrant() 
        returns (bool) {
        (uint256 price,) = getItemData(GameItem.HANDLING);
        address player = _msgSender();

        playerNonce[player]++;
        token.transferFrom(player, blockRacersFeeAccount, price);
        CarStats storage car = carStats[carId];
        ++car.handlingLevel;

        emit UpgradeHandling(player, price, car.handlingLevel);
        return true;
    }

    /// @notice Upgrades the car's Nos level
    /// @param carId The id of the car being upgraded
    /// @param permit The permit authorizing the upgrade
    /// @return true if successful
    function upgradeNos(uint256 carId, bytes memory permit) 
        external 
        onlyCarOwner(carId) 
        levelNotMaxed(carId, GameItem.NOS)
        onlyValidPermit(permit, GameItem.NOS) 
        nonReentrant() 
        returns (bool) {
        (uint256 price,) = getItemData(GameItem.NOS);
        address player = _msgSender();
        
        token.transferFrom(player, blockRacersFeeAccount, price);
        playerNonce[player]++;
        CarStats storage car = carStats[carId];
        car.nosLevel++;

        emit UpgradeNos(player, price, car.handlingLevel);
        return true;
    }

    /// @notice Gets an array of cars owned by an address
    /// @return uint256[] The NFT ID array of cars owned by a given account
    // function getUserCars(address _wallet) external view returns (uint256[] memory) {
    //     return ownerNftIds[_wallet];
    // }
    // TODO: get all NFT Ids from 1155

    function getUpgradeData() public view returns(GameSettingsData memory) {
        return gameSettingsData[_currentSettingsId];
    }

    function getItemData(GameItem itemType) public view returns (uint256 price, uint16 maxLevel) {
        if (itemType == GameItem.ENGINE) {
            price = gameSettingsData[_currentSettingsId].enginePrice;
            maxLevel = gameSettingsData[_currentSettingsId].engineMaxLevel;
        } else if (itemType == GameItem.HANDLING) {
            price = gameSettingsData[_currentSettingsId].handlingPrice;
            maxLevel = gameSettingsData[_currentSettingsId].handlingMaxLevel;
        } else if (itemType == GameItem.NOS) {
            price = gameSettingsData[_currentSettingsId].nosPrice;
            maxLevel = gameSettingsData[_currentSettingsId].nosMaxLevel;
        } else {
            price = gameSettingsData[_currentSettingsId].carCost;
        }  
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