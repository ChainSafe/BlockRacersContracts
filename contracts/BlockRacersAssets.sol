// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// $$$$$$$\  $$\       $$$$$$\   $$$$$$\  $$\   $$\       $$$$$$$\   $$$$$$\   $$$$$$\  $$$$$$$$\ $$$$$$$\   $$$$$$\  
// $$  __$$\ $$ |     $$  __$$\ $$  __$$\ $$ | $$  |      $$  __$$\ $$  __$$\ $$  __$$\ $$  _____|$$  __$$\ $$  __$$\ 
// $$ |  $$ |$$ |     $$ /  $$ |$$ /  \__|$$ |$$  /       $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |      $$ |  $$ |$$ /  \__|
// $$$$$$$\ |$$ |     $$ |  $$ |$$ |      $$$$$  /        $$$$$$$  |$$$$$$$$ |$$ |      $$$$$\    $$$$$$$  |\$$$$$$\  
// $$  __$$\ $$ |     $$ |  $$ |$$ |      $$  $$<         $$  __$$< $$  __$$ |$$ |      $$  __|   $$  __$$<  \____$$\ 
// $$ |  $$ |$$ |     $$ |  $$ |$$ |  $$\ $$ |\$$\        $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |      $$ |  $$ |$$\   $$ |
// $$$$$$$  |$$$$$$$$\ $$$$$$  |\$$$$$$  |$$ | \$$\       $$ |  $$ |$$ |  $$ |\$$$$$$  |$$$$$$$$\ $$ |  $$ |\$$$$$$  |
// \_______/ \________|\______/  \______/ \__|  \__|      \__|  \__|\__|  \__| \______/ \________|\__|  \__| \______/ 
/// @title Block Racers ERC1155 contract
/// @author RyRy79261
/// @notice This contract facilitates asset management in BlockRacers at https://github.com/Chainsafe/BlockRacers

contract BlockRacersAssets is ERC1155URIStorage, ERC1155, ReentrancyGuard {
    modifier onlyBlockracers {
        
    }
   
    /// @dev Constructor sets token to be used and nft info, input the RACE token address here on deployment
    constructor(string baseUri_) ERC1155(baseUri_) {
    }

    /// @dev Contract functions
    /// @notice Mints an Nft to a users wallet
    /// @param _amount The amount of token being sent
    /// @return true if successful
    function mint(address to, uint256 id, uint256 value, bytes memory data) external onlyBlockracers() returns(bool) {
       _mint(to, id, value, data);
       return true;
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory values, bytes memory data) external onlyBlockracers() returns(bool) {
        _mintBatch(to, ids, values, data);
        return true;
    }

}