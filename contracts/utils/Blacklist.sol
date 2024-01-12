// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

// $$$$$$$\  $$\       $$$$$$\   $$$$$$\  $$\   $$\       $$$$$$$\   $$$$$$\   $$$$$$\  $$$$$$$$\ $$$$$$$\   $$$$$$\  
// $$  __$$\ $$ |     $$  __$$\ $$  __$$\ $$ | $$  |      $$  __$$\ $$  __$$\ $$  __$$\ $$  _____|$$  __$$\ $$  __$$\ 
// $$ |  $$ |$$ |     $$ /  $$ |$$ /  \__|$$ |$$  /       $$ |  $$ |$$ /  $$ |$$ /  \__|$$ |      $$ |  $$ |$$ /  \__|
// $$$$$$$\ |$$ |     $$ |  $$ |$$ |      $$$$$  /        $$$$$$$  |$$$$$$$$ |$$ |      $$$$$\    $$$$$$$  |\$$$$$$\  
// $$  __$$\ $$ |     $$ |  $$ |$$ |      $$  $$<         $$  __$$< $$  __$$ |$$ |      $$  __|   $$  __$$<  \____$$\ 
// $$ |  $$ |$$ |     $$ |  $$ |$$ |  $$\ $$ |\$$\        $$ |  $$ |$$ |  $$ |$$ |  $$\ $$ |      $$ |  $$ |$$\   $$ |
// $$$$$$$  |$$$$$$$$\ $$$$$$  |\$$$$$$  |$$ | \$$\       $$ |  $$ |$$ |  $$ |\$$$$$$  |$$$$$$$$\ $$ |  $$ |\$$$$$$  |
// \_______/ \________|\______/  \______/ \__|  \__|      \__|  \__|\__|  \__| \______/ \________|\__|  \__| \______/ 

/// @title Block Racers blacklisting contract
/// @author RyRy79261
/// @notice This contract allows admins to block specific accounts used in the game at https://github.com/Chainsafe/BlockRacers
contract Blacklist is ERC2771Context, Ownable {
    mapping(address => bool) private blacklisted;
    event AddedToBlacklist(address indexed wallet);
    event RemovedFromBlacklisted(address indexed wallet);

    error AccountBlacklisted(address wallet);
    error AccountAlreadyBlacklisted(address wallet);
    error AccountNotBlacklisted(address wallet);

    modifier isNotBlacklisted(address account) {
        if (blacklisted[account])
            revert AccountBlacklisted(account);

        _;
    }

    constructor(
        address admin_,
        address trustedForwarder
        ) Ownable(admin_)ERC2771Context(trustedForwarder) {}

    function addToBlackList(address account) external onlyOwner() {
        if (blacklisted[account])
            revert AccountAlreadyBlacklisted(account);

        blacklisted[account] = true;
        emit AddedToBlacklist(account);
    }

    function removeFromBlackList(address account) external onlyOwner() {
         if (!blacklisted[account])
            revert AccountNotBlacklisted(account);

        blacklisted[account] = false;
        emit RemovedFromBlacklisted(account);
    }

    function isBlackListed(address account) public view returns(bool) {
        return blacklisted[account];
    }

    /**
     * @dev Override required as inheritance was indeterminant for which function to use
     */
    function _msgSender() internal view virtual override(ERC2771Context, Context) returns (address sender) {
        return ERC2771Context._msgSender();
    }

    /**
     * @dev Override required as inheritance was indeterminant for which function to use
     */
    function _msgData() internal view virtual override(ERC2771Context, Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}
