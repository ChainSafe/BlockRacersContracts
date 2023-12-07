// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BlockRacersAssets.sol";

// $$$$$$$\  $$\       $$$$$$\   $$$$$$\  $$\   $$\       $$$$$$$\   $$$$$$\   $$$$$$\  $$$$$$$$\ $$$$$$$\   $$$$$$\  
// $$  __$$\ $$ |     $$  __$$\ $$  __$$\ $$ | $$  |      $$  __$$\ $$  __$$\ $$  __$$\ $$  _____|$$  __$$\ $$  __$$\ 
// $$ |  $$ |$$ |     $$ /  $$ |$$ /  \__|$$ |$$  /       $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |      $$ |  $$ |$$ /  \__|
// $$$$$$$\ |$$ |     $$ |  $$ |$$ |      $$$$$  /        $$$$$$$  |$$$$$$$$ |$$ |      $$$$$\    $$$$$$$  |\$$$$$$\  
// $$  __$$\ $$ |     $$ |  $$ |$$ |      $$  $$<         $$  __$$< $$  __$$ |$$ |      $$  __|   $$  __$$<  \____$$\ 
// $$ |  $$ |$$ |     $$ |  $$ |$$ |  $$\ $$ |\$$\        $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |      $$ |  $$ |$$\   $$ |
// $$$$$$$  |$$$$$$$$\ $$$$$$  |\$$$$$$  |$$ | \$$\       $$ |  $$ |$$ |  $$ |\$$$$$$  |$$$$$$$$\ $$ |  $$ |\$$$$$$  |
// \_______/ \________|\______/  \______/ \__|  \__|      \__|  \__|\__|  \__| \______/ \________|\__|  \__| \______/ 

/// @title Block Racers core game Contract
/// @author RyRy79261, Sneakz
/// @notice This contract holds functions used for the Block Racers core game mechanices used in the game at https://github.com/Chainsafe/BlockRacers
contract BlockRacers is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
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
    IERC20 public immutable token;

    /// @dev BlockRacers ERC1155 address
    BlockRacersAssets public immutable assets;
   
    /// @dev Wallet that tokens go to on purchases
    address public blockRacersFeeAccount;
    /// @dev Wallet that auth signatures come from
    address public issuerAccount;
   
    // @dev Current car ID, also used to determine number of cars minted
    uint256 private _latestCarId = 0;
    
    uint256 private _currentSettingsId = 0;

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

    // TODO: View function to see all of a users cars, however, presently, I could keep an array, but if this is transfered, that array would be incorrect for both accounts involved in the transfer

     /// @dev Constructor sets token to be used and nft info, input the RACE token address here on deployment
    constructor(
        address admin_,
        IERC20 token_, 
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

    function setBlockRacersFeeAccount(address newBlockRacersFeeAccount) external onlyOwner() {
        blockRacersFeeAccount = newBlockRacersFeeAccount;
    }

    function setIssuerAccount(address newIssuerAccount) external onlyOwner() {
        issuerAccount = newIssuerAccount;
    }

    function setNewGameSettings(GameSettingsData memory newSettings) external onlyOwner() {
        ++_currentSettingsId;
        gameSettingsData[_currentSettingsId] = newSettings;
    }

    /// @dev Contract functions
    /// @notice Mints an Nft to a users wallet
    /// @return true if successful
    function mintCar() 
        external 
        nonReentrant() 
        returns (bool) {
        (uint256 price, ) = getItemData(GameItem.CAR);
        address player = _msgSender();

        // Attempt payment
        // TODO: ensure success
        playerNonce[player]++;
        token.safeTransferFrom(player, blockRacersFeeAccount, price);

        ++_latestCarId;
        assets.mint(player, _latestCarId, 1);

        carStats[_latestCarId] = CarStats(price, 1, 1, 1);
        emit MintCar(player, _latestCarId);
        return true;
    }

    /// @notice Upgrades the car's engine level
    /// @param carId The id of the car being upgraded
    /// @return true if successful
    function upgradeEngine(uint256 carId)
        external
        onlyCarOwner(carId) 
        levelNotMaxed(carId, GameItem.ENGINE)
        nonReentrant() 
        returns (bool) {
        (uint256 price,) = getItemData(GameItem.ENGINE);
        address player = _msgSender();
        
        playerNonce[player]++;
        token.safeTransferFrom(player, blockRacersFeeAccount, price);
        CarStats storage car = carStats[carId];
        ++car.engineLevel;

        emit UpgradeEngine(player, price, car.engineLevel);
        return true;
    }

    /// @notice Upgrades the car's handling level
    /// @param carId The id of the car being upgraded
    /// @return true if successful
    function upgradeHandling(uint256 carId) 
        external 
        onlyCarOwner(carId) 
        levelNotMaxed(carId, GameItem.HANDLING)
        nonReentrant() 
        returns (bool) {
        (uint256 price,) = getItemData(GameItem.HANDLING);
        address player = _msgSender();

        playerNonce[player]++;
        token.safeTransferFrom(player, blockRacersFeeAccount, price);
        CarStats storage car = carStats[carId];
        ++car.handlingLevel;

        emit UpgradeHandling(player, price, car.handlingLevel);
        return true;
    }

    /// @notice Upgrades the car's Nos level
    /// @param carId The id of the car being upgraded
    /// @return true if successful
    function upgradeNos(uint256 carId) 
        external 
        onlyCarOwner(carId) 
        levelNotMaxed(carId, GameItem.NOS)
        nonReentrant() 
        returns (bool) {
        (uint256 price,) = getItemData(GameItem.NOS);
        address player = _msgSender();
        
        token.safeTransferFrom(player, blockRacersFeeAccount, price);
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
}