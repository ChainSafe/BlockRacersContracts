// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {
    ReentrancyGuard
} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {
    SafeERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {
    IERC20,
    IERC20Metadata
} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {
    ERC2771Context,
    Context
} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {BlockRacersAssets} from "./BlockRacersAssets.sol";
import {IBlockRacers} from "./IBlockRacers.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title Block Racers core game Contract
/// @author ChainSafe Systems, RyRy79261, Sneakz, Oleksii Matiiasevych
/// @notice This contract holds functions used for the Block Racers core game mechanices
contract BlockRacers is IBlockRacers, ERC2771Context, Ownable {
    using SafeERC20 for IERC20;

    enum GameItem {
        CAR,
        ENGINE,
        HANDLING,
        NOS
    }

    /// @dev BlockRacers ERC20 address
    IERC20 public immutable TOKEN;
    uint256 public immutable TOKEN_UNIT;

    /// @dev BlockRacers ERC1155 address
    BlockRacersAssets public immutable ASSETS;

    /// @dev Wallet that tokens go to on purchases
    address public blockRacersFeeAccount;

    /// @dev Prices for each subsequent game item level
    mapping(GameItem item => uint16[] price) private prices;

    /// @dev Mapping of car stats per NFT
    mapping(uint256 carId => uint8[4] stats) private carStats;

    /// @dev Contract events
    event Purchase(address indexed wallet, uint256 carId, GameItem item, uint8 level);
    event UpdateSettings();

    error InvalidCar(uint256 carId);
    error NotCarOwner(uint256 carId);
    error InvalidItemType();
    error InvalidItemLevel(GameItem item, uint8 level);

    modifier onlyCarOwner(uint256 carId) {
        if (!isCarOwner(carId, _msgSender())) {
            revert NotCarOwner(carId);
        }
        _;
    }

    modifier onlyMinted(uint256 carId) {
        if (!ASSETS.exists(carId)) revert InvalidCar(carId);
        _;
    }

    /// @dev Constructor sets token to be used and nft info,
    /// input the RACE token address here on deployment
    /// @param trustedForwarder ERC2771 context forwarder for sponsored transactions
    /// @param admin_ Admin account for updating game settings
    /// @param token_ ERC20 token address
    /// @param blockRacersFeeAccount_ fees collection account
    /// @param baseUri_ URI base string for the Assets contract
    /// @param prices_ Settings for the max levels & upgrade costs
    constructor(
        address trustedForwarder,
        address admin_,
        address token_,
        address blockRacersFeeAccount_,
        string memory baseUri_,
        uint16[][4] memory prices_
    ) ERC2771Context(trustedForwarder) Ownable(admin_) {
        TOKEN = IERC20(token_);
        TOKEN_UNIT = uint256(10) ** IERC20Metadata(token_).decimals();
        ASSETS = new BlockRacersAssets(trustedForwarder, baseUri_);
        blockRacersFeeAccount = blockRacersFeeAccount_;
        setPrices(prices_);
    }

    function setBlockRacersFeeAccount(
        address newBlockRacersFeeAccount
    ) external onlyOwner {
        blockRacersFeeAccount = newBlockRacersFeeAccount;
        emit UpdateSettings();
    }

    function setPrices(
        uint16[][4] memory prices_
    ) public onlyOwner {
        prices[GameItem.CAR] = prices_[0];
        prices[GameItem.ENGINE] = prices_[1];
        prices[GameItem.HANDLING] = prices_[2];
        prices[GameItem.NOS] = prices_[3];
        emit UpdateSettings();
    }

    function setBaseUri(string memory uri) external onlyOwner {
        ASSETS.setBaseUri(uri);
        emit UpdateSettings();
    }

    /// @dev Contract functions
    /// @notice Mints an Nft to a users wallet
    function mintCar(uint8 carLevel) external {
        uint256 price = getPrice(GameItem.CAR, carLevel);
        address player = _msgSender();

        // Attempt payment
        TOKEN.safeTransferFrom(player, blockRacersFeeAccount, price);
        uint256 carId = ASSETS.mint(player);

        carStats[carId][uint256(GameItem.CAR)] = carLevel;
        emit Purchase(player, carId, GameItem.CAR, carLevel);
    }

    /// @notice Upgrades the car's engine level
    /// @param carId The id of the car being upgraded
    function upgrade(uint256 carId, GameItem item)
        external
        onlyCarOwner(carId)
    {
        if (item == GameItem.CAR) revert InvalidItemType();
        uint8 nextLevel = carStats[carId][uint256(item)] + 1;
        uint256 price = getPrice(item, nextLevel);
        address player = _msgSender();

        TOKEN.safeTransferFrom(player, blockRacersFeeAccount, price);
        carStats[carId][uint256(item)] = nextLevel;

        emit Purchase(player, carId, item, nextLevel);
    }

    /// @notice Gets an array of cars owned by an address
    /// @return uint256[] The NFT ID array of cars owned by a given account
    function getUserCars(address account) public view returns (uint256[] memory) {
        return ASSETS.getInventory(account);
    }

    function getNumberOfCarsMinted() external view returns (uint256) {
        return ASSETS.totalSupply();
    }

    function getCarStats(
        uint256 carId
    ) external view onlyMinted(carId) returns (uint8[4] memory) {
        return carStats[carId];
    }

    function isCarOwner(
        uint256 carId,
        address account
    ) public view onlyMinted(carId) returns (bool) {
        return ASSETS.balanceOf(account, carId) == 1;
    }

    function getItemData(
        GameItem itemType
    ) public view returns (uint256[] memory itemPrices) {
        uint16[] memory localPrices = prices[itemType];
        itemPrices = new uint256[](localPrices.length);
        uint256 len = itemPrices.length;
        for (uint256 i = 0; i < len; ++i) {
            itemPrices[i] = uint256(localPrices[i]) * TOKEN_UNIT;
        }

        return itemPrices;
    }

    function getItemsData() external view returns (uint256[][4] memory itemPrices) {
        itemPrices[0] = getItemData(GameItem.CAR);
        itemPrices[1] = getItemData(GameItem.ENGINE);
        itemPrices[2] = getItemData(GameItem.HANDLING);
        itemPrices[3] = getItemData(GameItem.NOS);

        return itemPrices;
    }

    function getPrice(
        GameItem item,
        uint8 level
    ) public view returns (uint256) {
        if (level >= prices[item].length) revert InvalidItemLevel(item, level);

        return prices[item][level] * TOKEN_UNIT;
    }

    function serializeProperties(
        uint256 carId
    ) external view override onlyMinted(carId) returns (string memory) {
        return Strings.toHexString(
            uint32(bytes4(abi.encodePacked(carStats[carId]))),
            4
        );
    }

    /**
     * @dev Override required as inheritance was indeterminant for which function to use
     */
    function _msgSender()
        internal
        view
        override(ERC2771Context, Context)
        returns (address sender)
    {
        return ERC2771Context._msgSender();
    }

    /**
     * @dev Override required as inheritance was indeterminant for which function to use
     */
    function _msgData()
        internal
        view
        override(ERC2771Context, Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }
}
