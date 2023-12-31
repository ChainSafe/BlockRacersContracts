import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { CarTypeOption, blockRacersFeeAccount, checkAssets, checkOwner, checkToken, deployCoreFixture, getCarOption, getCarOwner, getCarStats, getUpgradeData, mintCar, mintCarWithEvent, numberOfCarsMinted, upgradeEngine, upgradeEngineWithEvent, upgradeHandling, upgradeHandlingWithEvent, upgradeNos, upgradeNosWithEvent } from "./contractFunctions/BlockRacers.contract";
import { defaultDeployFixture, getAccounts, isTrustedForwarder } from "./contractFunctions/generalFunctions";
import { approvalToken, deployTokenFixture, setAllowanceToken } from "./contractFunctions/BlockRacersToken.contract";
import { deployAssetsFixture } from "./contractFunctions/BlockRacersAssets.contract";
import { ERC2771Context } from "../typechain-types";
import { defaultGameSettings } from "../scripts/defaultSettings";

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
        it("getItemData")
        it("getNumberOfCarsMinted", async () => {
            const coreContract = await loadFixture(deployCoreFixture())
            await numberOfCarsMinted(coreContract, 0);

            // Mint car then check
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
        it("trustedForwarder")
    });

    describe("admin", () => {
        it("renounceOwnership",)
        it("setBlockRacersFeeAccount")
        it("setNewGameSettings")
        it("transferOwnership")
    })

    describe("write", function () {
        it("mintCar", async () => {
            const { player1 } = await getAccounts()

            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))
            
            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await numberOfCarsMinted(coreContract, 0);

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, tokenContract, carType, player1)

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
            await mintCar(coreContract, tokenContract, carType, player1)
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
            await mintCar(coreContract, tokenContract, carType, player1)
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
            await mintCar(coreContract, tokenContract, carType, player1)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.nosPrice);

            await upgradeNos(coreContract, player1, numberOfCarsMintedAsID, 2)
        })

        describe("Max level tests", () => {
            it("stops at the max level for Engine")
            it("stops at the max level for Handling")
            it("stops at the max level for Nos")
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
            await mintCar(coreContract, tokenContract, carType, player1)
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
            await mintCar(coreContract, tokenContract, carType, player1)
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
            await mintCar(coreContract, tokenContract, carType, player1)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.nosPrice);

            await upgradeNosWithEvent(coreContract, player1, numberOfCarsMintedAsID, "UpgradeNos", [player1.address, upgradeData.nosPrice, 2], 2)
        })
    })

    describe("errors", function () {
        it("CarTypeDoesNotExist")
        it("NotCarOwner")
        it("InvalidItemType")
        it("UpgradeNotPossible")
    })
});
