// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
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
contract BlockRacers is ERC2771Context, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    enum GameItem{ CAR, ENGINE, HANDLING, NOS }

    struct CarOption {
        uint256 carCost;
        string carUri;
    }

    struct CarStats {
        uint256 carTypeId;
        CarOption carOptionData;
        uint16 handlingLevel;
        uint16 engineLevel;
        uint16 nosLevel;
    }

    struct GameSettingsData {
        uint256 enginePrice;
        uint256 handlingPrice;
        uint256 nosPrice;
        uint16 handlingMaxLevel;
        uint16 engineMaxLevel;
        uint16 nosMaxLevel;
        CarOption[] carOptions;
    }
    
    /// @dev BlockRacers ERC20 address
    IERC20 public immutable token;

    /// @dev BlockRacers ERC1155 address
    address public immutable assets;
   
    /// @dev Wallet that tokens go to on purchases
    address public blockRacersFeeAccount;
   
    // @dev Current car ID, also used to determine number of cars minted
    uint256 private _latestCarId = 0;
    
    uint256 private _currentSettingsId = 0;

    /// @dev Mapping of car stats per NFT
    mapping(uint256 => CarStats) private carStats;
    mapping(uint256 => GameSettingsData) private gameSettingsData;

    /// @dev Contract events
    event MintCar(address indexed wallet, uint256 carId);
    event UpgradeEngine(address indexed wallet, uint256 _amount, uint16 level);
    event UpgradeHandling(address indexed wallet, uint256 _amount, uint16 level);
    event UpgradeNos(address indexed wallet, uint256 _amount, uint16 level);

    error CarTypeDoesNotExist(uint256 carTypeId);
    error NotCarOwner(uint256 carId);
    error InvalidItemType();
    error UpgradeNotPossible(uint256 carId, GameItem gameItem, uint16 currentLevel, uint16 maxLevel);

    modifier onlyCarOwner(uint256 carId) {
        if (IERC1155(assets).balanceOf(_msgSender(), carId) != 1)
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

    /// TODO: View function to see all of a users cars, however, presently, I could keep an array, but if this is transfered, that array would be incorrect for both accounts involved in the transfer

    /// @dev Constructor sets token to be used and nft info, input the RACE token address here on deployment
    /// 
    /// @param trustedForwarder ERC2771 context forwarder for sponsored transactions
    /// @param admin_ Admin account for updating game settings
    /// @param token_ ERC20 token address
    /// @param assets_ 1155 token address
    /// @param blockRacersFeeAccount_ fees collection account
    /// @param gameSettingsData_ First settings for the max levels & upgrade costs
    constructor(
        address trustedForwarder,
        address admin_,
        IERC20 token_, 
        address assets_,
        address blockRacersFeeAccount_,
        GameSettingsData memory gameSettingsData_
        ) ERC2771Context(trustedForwarder) Ownable(admin_) {
        token = token_;
        assets = assets_;
        blockRacersFeeAccount = blockRacersFeeAccount_;
        gameSettingsData[_currentSettingsId] = gameSettingsData_;
    }

    function setBlockRacersFeeAccount(address newBlockRacersFeeAccount) external onlyOwner() {
        blockRacersFeeAccount = newBlockRacersFeeAccount;
    }

    function setNewGameSettings(GameSettingsData memory newSettings) external onlyOwner() {
        ++_currentSettingsId;
        gameSettingsData[_currentSettingsId] = newSettings;
    }

    /// @dev Contract functions
    /// @notice Mints an Nft to a users wallet
    /// @return true if successful
    function mintCar(uint256 carTypeId) 
        external 
        nonReentrant() 
        returns (bool) {
        (uint256 price, string memory carUri) = getCarOption(carTypeId);
        if (price == 0) 
            revert CarTypeDoesNotExist(carTypeId);

        address player = _msgSender();

        // Attempt payment
        token.safeTransferFrom(player, blockRacersFeeAccount, price);

        ++_latestCarId;
        BlockRacersAssets(assets).mint(player, _latestCarId, 1, carUri);

        carStats[_latestCarId] = CarStats(carTypeId, CarOption(price, carUri), 1, 1, 1);
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
    function getUpgradeData() external view returns(GameSettingsData memory) {
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
        } 
    }

    function getCarOption(uint256 carTypeId) public view returns(uint256, string memory) {
        CarOption memory option = gameSettingsData[_currentSettingsId].carOptions[carTypeId];
        return (option.carCost, option.carUri);
    }

    function getNumberOfCarsMinted() external view returns(uint256) {
        return _latestCarId;
    }

    function getCarStats(uint256 carId) external view returns(CarStats memory) {
        return carStats[carId];
    }

    function getCarOwner(uint256 carId, address account) external view returns(bool) {
        return IERC1155(assets).balanceOf(account, carId) == 1;
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