# Block Game 

Block Game is a game demonstrating the features of the ChainSafe Gaming SDK

### Installation

    nvm use
    npx yarn
    npx yarn run compile

Copy `.env-example` into `.env`.

### Integration development

    npx yarn run node

Then in another terminal.

    npx yarn run deploy-dev

### Preparation

1. Create a copy of one of the `scripts/metadata/gameId` example projects.
2. Set `GAME_ID` in the `.env` to match your project folder name.
3. Add enough images of game objects.
4. Upload `images` to IPFS and get their resource identifiers.
5. Update your game `config.ts` with item names and object specs.
6. Set `PRICES` in the `.env` file in the following template: `Object0Price,Object1Price,...|Item0Level0Price,Item1Level1Price,...|Item1Level0Price,...`. Making sure that it is compatible with the configuration. The prices should be in full tokens, meaning that if your token has 18 decimals, then price specified at 10 will result in `10 * 10**18`. Fractional prices are not supported.
7. Run `npm run generate-metadata`.
8. Upload `jsons` to IPFS and get its base resource identifier.
9. Update `BASE_URI` in the `.env`.
10. If you already have a token, set it's address in `GAME_TOKEN` in the `.env`.
11. Proceed to deployment.

### Testnet deployment

Make required changes to the `.env` file, paying attention to a `PUBLIC_MINT` option that will let anyone mint 1000 tokens at a time.

    npx yarn run deploy-mumbai

Or

    npx yarn run deploy-sepolia

## Features

- Minting Objects as an ERC1155
- A token for minting objects, purchasing upgrades & wagering in PvP races
- An escrow contract for facilitating wagers in PvP races

### BlockGame ERC20

This token is pretty simple for now, it allows for ERC2771 relayed transactions, but there are 2 minting functions, one which should only ever be included in deployment for Testnets, and another which requires a signature from an authorized developer signing wallet.

### BlockGame ERC1155

This token is pretty simple, it allows for minting by approved BlockGame contracts, the minting presently is to represent objects in the game, it has AccessControl to manage BlockGame core contracts, this would allow a new version of the core contract to be deployed without affecting the assets. 

There are URI features for setting explicit URI strings for assets instead of implied, ID based, this allows for futureproofing.

### BlockGame Core 

This is the core game asset management logic and facilitates all NFT related activities.

There are up to 31 items plus the game object type, each having a value up to 255, for each NFT, represented as an array of type/levels:
```solidity
    uint8[] items
```

- 0 = `OBJECT_TYPE`
- 1 = `ITEM1`
- 2 = `ITEM2`
- 3 = `ITEM3`
- ...

Minting and upgrades require payments in GAME token. Different objects and upgrade levels could have varying prices. To get pricelist call: BlockGame.getItemsData() which will return a list of lists of prices for each item/level.

#### Types

Costs are denoted in `uint256` to be consistent with ERC20, but the levels have been limited to 255 elements.

Each minted object has an associated `objectStats` mapping which is just a list of up to 32 integer values.

### Player actions

The players are able to mint a new object, upgrade it's items.

All of these actions require sending an `approve` transaction to the BlockGame ERC20, for the `BlockGame` address.

### BlockGame Wager

The wager contract allows for players to stake tokens from the Block Game ERC20 to then race each other, the winner would then receive their staked tokens back as well as be transferred the tokens staked by their defeated opponent.

This contract also has ERC2771 for relaying transactions

#### Mechanics 

A player can initiate a wager by sending a signed message to an opponent. Their opponent can then accept the wager by staking tokens into the contract, these would both require approving the Wager contract for transfer of the Wager creators and opponents stake.

When a race is completed, server would sign a message confirming the winner, then this message is passed to the contract by winner. This sends the winner back their initial stake as well as their opponents stake.

Or server could sign a cancellation message for a particular player, then this player could cancel the match.

#### Black listing

Blacklisting feature has been added to prevent specified accounts from engaging in wagers.

If a user has been blacklisted, and they have already staked, they could still finish their wager, and would not be able to create new ones.
