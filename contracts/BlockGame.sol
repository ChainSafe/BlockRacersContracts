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
import {BlockGameAssets} from "./BlockGameAssets.sol";
import {IBlockGame} from "./IBlockGame.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

uint8 constant OBJECT_ITEM = 0;

/// @title Block Game core game Contract
/// @author ChainSafe Systems, RyRy79261, Sneakz, Oleksii Matiiasevych
/// @notice This contract holds functions used for the core game mechanices
contract BlockGame is IBlockGame, ERC2771Context, Ownable {
    using SafeERC20 for IERC20;

    /// @dev BlockGame ERC20 address
    IERC20 public immutable TOKEN;
    uint256 public immutable TOKEN_UNIT;

    /// @dev BlockGame ERC1155 address
    BlockGameAssets public immutable ASSETS;

    /// @dev How many types of items each object could have
    uint8 private immutable ITEMS_COUNT;

    /// @dev Wallet that tokens go to on purchases
    address public feeAccount;

    /// @dev Prices for each subsequent game item level
    uint16[][] private prices;

    /// @dev Mapping of object stats per NFT
    mapping(uint256 objectId => uint8[] stats) private objectStats;

    /// @dev Contract events
    event Purchase(address indexed wallet, uint256 objectId, uint8 item, uint8 level);
    event UpdateSettings();

    error InvalidObject(uint256 objectId);
    error NotObjectOwner(uint256 objectId);
    error InvalidItemType();
    error InvalidItemLevel(uint8 item, uint8 level);
    error TooManyOrZeroPrices();
    error ItemsCountChangeNotSupported();
    error ObjectTypeCountReductionNotSupported();

    modifier onlyObjectOwner(uint256 objectId) {
        if (!isObjectOwner(objectId, _msgSender())) {
            revert NotObjectOwner(objectId);
        }
        _;
    }

    modifier onlyMinted(uint256 objectId) {
        if (!ASSETS.exists(objectId)) revert InvalidObject(objectId);
        _;
    }

    /// @dev Constructor sets token to be used and nft info,
    /// input the RACE token address here on deployment
    /// @param trustedForwarder ERC2771 context forwarder for sponsored transactions
    /// @param admin_ Admin account for updating game settings
    /// @param token_ ERC20 token address
    /// @param feeAccount_ fees collection account
    /// @param baseUri_ URI base string for the Assets contract
    /// @param prices_ Settings for the max levels & upgrade costs
    constructor(
        address trustedForwarder,
        address admin_,
        address token_,
        address feeAccount_,
        string memory baseUri_,
        uint16[][] memory prices_
    ) ERC2771Context(trustedForwarder) Ownable(admin_) {
        TOKEN = IERC20(token_);
        TOKEN_UNIT = uint256(10) ** IERC20Metadata(token_).decimals();
        ASSETS = new BlockGameAssets(trustedForwarder, baseUri_);
        ITEMS_COUNT = uint8(prices_.length);
        feeAccount = feeAccount_;
        setPrices(prices_);
    }

    function setFeeAccount(
        address newFeeAccount
    ) external onlyOwner {
        feeAccount = newFeeAccount;
        emit UpdateSettings();
    }

    function setPrices(
        uint16[][] memory prices_
    ) public onlyOwner {
        if (prices_.length >= 32 || prices_.length == 0) revert TooManyOrZeroPrices();
        if (prices_.length != ITEMS_COUNT) {
            revert ItemsCountChangeNotSupported();
        }
        if (prices.length > 0 &&
            prices_[OBJECT_ITEM].length < prices[OBJECT_ITEM].length)
        {
            revert ObjectTypeCountReductionNotSupported();
        }
        prices = prices_;
        emit UpdateSettings();
    }

    function setPricesForItem(
        uint8 item,
        uint16[] memory prices_
    ) public onlyOwner {
        if (item == OBJECT_ITEM && prices_.length < prices[OBJECT_ITEM].length) {
            revert ObjectTypeCountReductionNotSupported();
        }
        prices[item] = prices_;
        emit UpdateSettings();
    }

    function setBaseUri(string memory uri) external onlyOwner {
        ASSETS.setBaseUri(uri);
        emit UpdateSettings();
    }

    /// @dev Contract functions
    /// @notice Mints an Nft to a users wallet
    function mintObject(uint8 objectType) external {
        uint256 price = getPrice(OBJECT_ITEM, objectType);
        address player = _msgSender();

        // Attempt payment
        TOKEN.safeTransferFrom(player, feeAccount, price);
        uint256 objectId = ASSETS.mint(player);

        objectStats[objectId] = new uint8[](ITEMS_COUNT);
        objectStats[objectId][OBJECT_ITEM] = objectType;
        emit Purchase(player, objectId, OBJECT_ITEM, objectType);
    }

    /// @notice Upgrades the object's engine level
    /// @param objectId The id of the object being upgraded
    function upgrade(uint256 objectId, uint8 item)
        external
        onlyObjectOwner(objectId)
    {
        if (item == OBJECT_ITEM) revert InvalidItemType();
        uint8 nextLevel = objectStats[objectId][uint256(item)] + 1;
        uint256 price = getPrice(item, nextLevel);
        address player = _msgSender();

        TOKEN.safeTransferFrom(player, feeAccount, price);
        objectStats[objectId][uint256(item)] = nextLevel;

        emit Purchase(player, objectId, item, nextLevel);
    }

    /// @notice Gets an array of objects owned by an address
    /// @return uint256[] The NFT ID array of objects owned by a given account
    function getUserObjects(address account) public view returns (uint256[] memory) {
        return ASSETS.getInventory(account);
    }

    function getNumberOfObjectsMinted() external view returns (uint256) {
        return ASSETS.totalSupply();
    }

    function getObjectStats(
        uint256 objectId
    ) external view onlyMinted(objectId) returns (uint8[] memory) {
        return objectStats[objectId];
    }

    function isObjectOwner(
        uint256 objectId,
        address account
    ) public view onlyMinted(objectId) returns (bool) {
        return ASSETS.balanceOf(account, objectId) == 1;
    }

    function getItemData(
        uint8 itemType
    ) public view returns (uint256[] memory itemPrices) {
        uint16[] memory localPrices = prices[itemType];
        itemPrices = new uint256[](localPrices.length);
        uint256 len = itemPrices.length;
        for (uint256 i = 0; i < len; ++i) {
            itemPrices[i] = uint256(localPrices[i]) * TOKEN_UNIT;
        }

        return itemPrices;
    }

    function getItemsData() external view returns (uint256[][] memory itemPrices) {
        itemPrices = new uint256[][](ITEMS_COUNT);
        for (uint8 i = 0; i < ITEMS_COUNT; ++i) {
            itemPrices[i] = getItemData(i);
        }

        return itemPrices;
    }

    function getPrice(
        uint8 item,
        uint8 level
    ) public view returns (uint256) {
        if (level >= prices[item].length) revert InvalidItemLevel(item, level);

        return prices[item][level] * TOKEN_UNIT;
    }

    function getItemsCount() public view returns (uint256) {
        return ITEMS_COUNT;
    }

    function serializeProperties(
        uint256 objectId
    ) external view override onlyMinted(objectId) returns (string memory) {
        uint256 statsValue = uint256(bytes32(abi.encodePacked(objectStats[objectId])));
        uint256 shift = (32 - ITEMS_COUNT) * 8;

        return Strings.toHexString((statsValue << shift) >> shift, ITEMS_COUNT);
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
