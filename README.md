# Block Racers 

Block Racers is a game demonstrating the features of the ChainSafe Gaming SDK

## Features

- Minting Cars as an ERC1155
- A token for minting cars, purchasing upgrades & wagering in PvP races
- An escrow contract for facilitating wagers in PvP races

## Contract flow 

### BlockRacers ERC20

This token is pretty simple for now, it allows for ERC2771 relayed transactions, but there are 2 minting functions, one which should only ever be included in deployment for Testnets, and another which requires a signature from an authorized developer signing wallet.

### BlockRacers ERC1155

This token is pretty simple, it allows for minting by approved BlockRacer contracts, the minting presently is to represent cars in the game, it has AccessControl to manage BlockRacer core contracts, this would allow a new version of the core contract to be deployed without affecting the assets. 

There are URI features for setting explicit URI strings for assets instead of implied, ID based, this allows for futureproofing.

### BlockRacers Core 

This is the core game asset management logic and facilitates all NFT related activities.

There are 4 items, represented by an enum, this means that the values of each one is an index starting at zero:
```solidity
    enum GameItem{ CAR, ENGINE, HANDLING, NOS }
```

- 0 = `GameItem.CAR`
- 1 = `GameItem.ENGINE`
- 2 = `GameItem.HANDLING`
- 3 = `GameItem.NOS`

The minting of cars uses a field called `_latestCarId` this both manages what ID is used to mint ERC1155 but also can infer the number of cars minted.

Cars are minted based on the car type ID thats set in the game settings field, the URI is set during the mint and the price is determined based on the car option settings.

#### Types

There is a struct representing game settings, this is published to a mapping to allow look up of previous settings for potentially valuing cars accurately if they have been upgraded prior to price changes.

Costs are denoted in `uint256` to be consistent with ERC20, but the levels have been limited to `uint16` for struct packing purposes.

Each minted car has an associated `CarStats` mapping, this is where the car's initial cost and current property levels are

Only the Owner of the contract can publish new game settings.

```solidity
    struct CarOption {
        uint256 carCost;
        string carUri;
    }

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
```

### Player actions

The players are able to mint a new car, upgrade it's engine, handling & NOS.

All of these actions require sending an `approve` transaction to the BlockRacers ERC20, to the `blockRacersFeeAccount`

### BlockRacers Wager

The wager contract allows for players to stake tokens from the Block Racers ERC20 to then race each other, the winner would then receive their staked tokens back as well as be transferred the tokens staked by their defeated opponent.

This contract also has ERC2771 for relaying transactions

There are 5 states a wager can be in
```solidity
    enum WagerState { NOT_STARTED, CREATED, ACCEPTED, COMPLETED, CANCELLED }
```
- 0 = `WagerState.NOT_STARTED`
- 1 = `WagerState.CREATED`
- 2 = `WagerState.ACCEPTED`
- 3 = `WagerState.COMPLETED`
- 4 = `WagerState.CANCELLED`

#### Mechanics 

A player can initiate a wager by staking tokens into the Wager contract. Their opponent can then accept the wager by staking tokens into the contract, these would both require approving the Wager contract for transfer of the Wager creators stake.

When a race is completed, both players would sign a message of the winner's address to then release the funds to the winner.

This sends the winner back their initial stake as well as their opponents stake.

Any account can submit the `completeWager` function as it uses signatures from both players as validation and not the transaction sender.

#### Potential issues

Wagers can be cancelled by either party prior to completion in order to not lock up funds.

This however introduces an incentive for the losing player to submit a cancellation before the `completeWager` function is called.

The impact of this is just that both players get their stake back, however this could then be used as a form of DDoS against races.

As such, a blacklisting feature has been added to prevent specified accounts from engaging in wagers.

If a user has been blacklisted, and they have already staked, an admin is able to cancel a wager manually, returning the funds.