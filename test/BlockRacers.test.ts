import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { CarTypeOption, GameItem, blockRacersFeeAccount, checkAssets, checkOwner, checkToken, deployCoreFixture, getBlockracersFeeAccount, getCarOption, getCarOwner, getCarStats, getItemData, getItemDataWithError, getOwner, getUpgradeData, mintCar, mintCarWithErrors, mintCarWithEvent, modifiedGameSettings, numberOfCarsMinted, renounceOwnership, setBlockracersFeeAccount, setNewGameSettings, transferOwnership, upgradeEngine, upgradeEngineWithErrors, upgradeEngineWithEvent, upgradeHandling, upgradeHandlingWithErrors, upgradeHandlingWithEvent, upgradeNos, upgradeNosWithErrors, upgradeNosWithEvent } from "./contractFunctions/BlockRacers.contract";
import { checkTrustedForwarder, defaultDeployFixture, getAccounts, isTrustedForwarder } from "./contractFunctions/generalFunctions";
import { deployTokenFixture, setAllowanceToken } from "./contractFunctions/BlockRacersToken.contract";
import { deployAssetsFixture } from "./contractFunctions/BlockRacersAssets.contract";
import { ERC2771Context } from "../typechain-types";
import { defaultGameSettings } from "../scripts/defaultSettings";
import { ZeroAddress } from "ethers";

describe("BlockRacers", function () {
    describe("deployment", () => {
        it("deploys as expected", async () => {
            const { feeAccount } = await getAccounts()
            const coreContract = await loadFixture(deployCoreFixture())

            await blockRacersFeeAccount(coreContract, feeAccount.address)
        })  
    })
    describe("read", function () {
        it("assets", async () => {
            const assetsContract = await loadFixture(deployAssetsFixture)
            const assetsAddress = await assetsContract.getAddress()
            const coreContract = await loadFixture(deployCoreFixture(undefined, assetsAddress))

            await checkAssets(coreContract, assetsAddress)
        })
        it("blockRacersFeeAccount", async () => {
            const { feeAccount } = await getAccounts()
            const coreContract = await loadFixture(deployCoreFixture())

            await blockRacersFeeAccount(coreContract, feeAccount.address)
        })
        it("getCarOption", async () => {
            const coreContract = await loadFixture(deployCoreFixture())

            await getCarOption(
                coreContract,
                0,
                defaultGameSettings.carOptions[0].carCost,
                defaultGameSettings.carOptions[0].carUri,
            )
        })
        it("getItemData", async () => {
            const coreContract = await loadFixture(deployCoreFixture())

            await getItemData(coreContract, GameItem.NOS, {
                price: defaultGameSettings.nosPrice,
                maxLevel: defaultGameSettings.nosMaxLevel,
            })
            await getItemData(coreContract, GameItem.HANDLING, {
                price: defaultGameSettings.handlingPrice,
                maxLevel: defaultGameSettings.handlingMaxLevel,
            })
            await getItemData(coreContract, GameItem.ENGINE, {
                price: defaultGameSettings.enginePrice,
                maxLevel: defaultGameSettings.engineMaxLevel,
            })
        })
        it("getNumberOfCarsMinted", async () => {
            const { player1 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))

            await numberOfCarsMinted(coreContract, 0);

            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1)

            await numberOfCarsMinted(coreContract, 1);
            
        })
        it("getUpgradeData", async () => {
            const coreContract = await loadFixture(deployCoreFixture())
            
            await getUpgradeData(coreContract, defaultGameSettings)
        })
        it("isTrustedForwarder", async () => {
            const { trustedForwarder } = await getAccounts()
            const coreContract = await loadFixture(deployCoreFixture())

            await isTrustedForwarder(coreContract as ERC2771Context, trustedForwarder.address, true)
        })
        it("owner", async () => {
            const { admin } = await getAccounts()
            const coreContract = await loadFixture(deployCoreFixture())

            await checkOwner(coreContract, admin.address)
        })
        it("token", async () => {
            const tokenContract = await loadFixture(deployTokenFixture())
            const tokenAddress = await tokenContract.getAddress()
            const coreContract = await loadFixture(deployCoreFixture(tokenAddress))

            await checkToken(coreContract, tokenAddress)
        })
        it("trustedForwarder", async () => {
            const { trustedForwarder } = await getAccounts()
            const coreContract = await loadFixture(deployCoreFixture())
            await checkTrustedForwarder(coreContract as ERC2771Context, trustedForwarder.address)
        })
    });

    describe("admin", () => {
        it("renounceOwnership", async () => {
            const { admin } = await getAccounts()

            const { coreContract } = await loadFixture(defaultDeployFixture(true))
            await getOwner(coreContract, admin.address)

            await renounceOwnership(coreContract, admin)

            await getOwner(coreContract, ZeroAddress)

        })
        it("setBlockRacersFeeAccount", async () => {
            const { admin, feeAccount, player3 } = await getAccounts()
            const coreContract = await loadFixture(deployCoreFixture())
            
            await getBlockracersFeeAccount(coreContract, feeAccount.address)

            await setBlockracersFeeAccount(coreContract, admin, player3.address)

            await getBlockracersFeeAccount(coreContract, player3.address)

        })
        it("setNewGameSettings", async () => {
            const { admin } = await getAccounts()
            const coreContract = await loadFixture(deployCoreFixture())
            
            await getUpgradeData(coreContract, defaultGameSettings)

            await setNewGameSettings(coreContract, admin, modifiedGameSettings)

            await getUpgradeData(coreContract, modifiedGameSettings)

        })
        it("transferOwnership", async () => {
            const { admin, player3 } = await getAccounts()
            const coreContract = await loadFixture(deployCoreFixture())

            await getOwner(coreContract, admin.address)

            await transferOwnership(coreContract, admin, player3.address)

            await getOwner(coreContract, player3.address)
        })
    })

    describe("write", function () {
        it("mintCar", async () => {
            const { player1 } = await getAccounts()

            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))
            
            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await numberOfCarsMinted(coreContract, 0);

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1)

            const carOption = await getCarOption(coreContract, carType);

            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);
            
            await getCarOwner(coreContract, player1, numberOfCarsMintedAsID, true);
        
            await getCarStats(coreContract, numberOfCarsMintedAsID, {
                carTypeId: carType,
                carOptionData: carOption,
                nosLevel: 1,
                handlingLevel: 1,
                engineLevel: 1
            })
        })
        it("upgradeEngine", async () => {
            const { player1 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))

            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.enginePrice);

            await upgradeEngine(coreContract, player1, numberOfCarsMintedAsID, 2)
        })
        it("upgradeHandling", async () => {
            const { player1 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))

            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.handlingPrice);

            await upgradeHandling(coreContract, player1, numberOfCarsMintedAsID, 2)
        })
        it("upgradeNos", async () => {
            const { player1 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))

            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.nosPrice);

            await upgradeNos(coreContract, player1, numberOfCarsMintedAsID, 2)
        })

        describe("Max level tests", () => {
            it("stops at the max level for Engine", async () => {
                const { player1 } = await getAccounts()
                const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))
                const carType = CarTypeOption.FIRST;
                const { carCost } = await getCarOption(coreContract, carType)

                await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
                await mintCar(coreContract, carType, player1)
                const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);
    
                const upgradeData = await getUpgradeData(coreContract)

                // Max out stat
                for(let i = 1; i < upgradeData.engineMaxLevel; i++) {
                    await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.enginePrice);
    
                    await upgradeEngine(coreContract, player1, numberOfCarsMintedAsID, i + 1)
                }

                await upgradeEngineWithErrors(coreContract, player1, numberOfCarsMintedAsID, "UpgradeNotPossible", [
                    numberOfCarsMintedAsID,
                    GameItem.ENGINE,
                    upgradeData.engineMaxLevel,
                    upgradeData.engineMaxLevel
                ])
            })
            it("stops at the max level for Handling", async () => {
                const { player1 } = await getAccounts()
                const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))
                const carType = CarTypeOption.FIRST;
                const { carCost } = await getCarOption(coreContract, carType)

                await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
                await mintCar(coreContract, carType, player1)
                const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);
    
                const upgradeData = await getUpgradeData(coreContract)

                // Max out stat
                for(let i = 1; i < upgradeData.handlingMaxLevel; i++) {
                    await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.handlingPrice);
    
                    await upgradeHandling(coreContract, player1, numberOfCarsMintedAsID, i + 1)
                }

                await upgradeHandlingWithErrors(coreContract, player1, numberOfCarsMintedAsID, "UpgradeNotPossible", [
                    numberOfCarsMintedAsID,
                    GameItem.HANDLING,
                    upgradeData.handlingMaxLevel,
                    upgradeData.handlingMaxLevel
                ])
            })
            it("stops at the max level for Nos", async () => {
                const { player1 } = await getAccounts()
                const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))
                const carType = CarTypeOption.FIRST;
                const { carCost } = await getCarOption(coreContract, carType)

                await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
                await mintCar(coreContract, carType, player1)
                const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);
    
                const upgradeData = await getUpgradeData(coreContract)

                // Max out stat
                for(let i = 1; i < upgradeData.nosMaxLevel; i++) {
                    await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.nosPrice);
    
                    await upgradeNos(coreContract, player1, numberOfCarsMintedAsID, i + 1)
                }

                await upgradeNosWithErrors(coreContract, player1, numberOfCarsMintedAsID, "UpgradeNotPossible", [
                    numberOfCarsMintedAsID,
                    GameItem.NOS,
                    upgradeData.nosMaxLevel,
                    upgradeData.nosMaxLevel
                ])
            })
        })
    });

    describe("events", function () {
        it("MintCar", async () => {
            const { player1 } = await getAccounts()

            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))
            
            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await numberOfCarsMinted(coreContract, 0);

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCarWithEvent(coreContract, tokenContract, carType, player1, "MintCar", [player1.address, 1])
        })
        it("UpgradeEngine", async () => {
            const { player1 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))

            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.enginePrice);

            await upgradeEngineWithEvent(coreContract, player1, numberOfCarsMintedAsID, "UpgradeEngine", [player1.address, upgradeData.enginePrice, 2], 2)
        })
        it("UpgradeHandling", async () => {
            const { player1 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))

            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.handlingPrice);

            await upgradeHandlingWithEvent(coreContract, player1, numberOfCarsMintedAsID, "UpgradeHandling", [player1.address, upgradeData.handlingPrice, 2], 2)
        })
        it("UpgradeNos", async () => {
            const { player1 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))

            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.nosPrice);

            await upgradeNosWithEvent(coreContract, player1, numberOfCarsMintedAsID, "UpgradeNos", [player1.address, upgradeData.nosPrice, 2], 2)
        })
    })

    describe("errors", function () {
        it("CarTypeDoesNotExist", async () => {
            const { player1 } = await getAccounts()
            const coreContract = await loadFixture(deployCoreFixture())

            await mintCarWithErrors(coreContract, 4 as CarTypeOption, player1, "CarTypeDoesNotExist", [4])
        })
        it("NotCarOwner", async () => {
            const { player1, player2 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))

            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.enginePrice);

            await upgradeEngineWithErrors(coreContract, player2, numberOfCarsMintedAsID, "NotCarOwner", [numberOfCarsMintedAsID])
        })
        it("InvalidItemType", async () => {
            const coreContract = await loadFixture(deployCoreFixture())
            await getItemDataWithError(coreContract, GameItem.CAR, "InvalidItemType", [])
        })
        it("UpgradeNotPossible", async () => {
            const { player1 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))
            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            // Max out stat
            for(let i = 1; i < upgradeData.nosMaxLevel; i++) {
                await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.nosPrice);

                await upgradeNos(coreContract, player1, numberOfCarsMintedAsID, i + 1)
            }

            await upgradeNosWithErrors(coreContract, player1, numberOfCarsMintedAsID, "UpgradeNotPossible", [
                numberOfCarsMintedAsID,
                GameItem.NOS,
                upgradeData.nosMaxLevel,
                upgradeData.nosMaxLevel
            ])
        })
    })
});
