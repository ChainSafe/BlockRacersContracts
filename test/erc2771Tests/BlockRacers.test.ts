import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { CarTypeOption, deployCoreFixture, getBlockracersFeeAccount, getCarOption, getCarOwner, getCarStats, getOwner, getUpgradeData, mintCar, modifiedGameSettings, numberOfCarsMinted, renounceOwnership, setBlockracersFeeAccount, setNewGameSettings, transferOwnership, upgradeEngine, upgradeHandling, upgradeNos } from "../../src/BlockRacers.contract";
import { defaultDeployFixture, getAccounts } from "../../src/generalFunctions";
import { setAllowanceToken } from "../../src/BlockRacersToken.contract";
import { defaultGameSettings } from "../../scripts/defaultSettings";
import { ZeroAddress } from "ethers";

describe("BlockRacers - ERC2771", function () {
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
            await mintCar(coreContract, carType, player1, true)

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
            await mintCar(coreContract, carType, player1, true)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.enginePrice);

            await upgradeEngine(coreContract, player1, numberOfCarsMintedAsID, 2, true)
        })
        it("upgradeHandling", async () => {
            const { player1 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))

            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1, true)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.handlingPrice);

            await upgradeHandling(coreContract, player1, numberOfCarsMintedAsID, 2, true)
        })
        it("upgradeNos", async () => {
            const { player1 } = await getAccounts()
            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))

            const carType = CarTypeOption.FIRST;
            const { carCost } = await getCarOption(coreContract, carType)
            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, carType, player1, true)
            const numberOfCarsMintedAsID = await numberOfCarsMinted(coreContract, 1);

            const upgradeData = await getUpgradeData(coreContract)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), upgradeData.nosPrice);

            await upgradeNos(coreContract, player1, numberOfCarsMintedAsID, 2, true)
        })
    });
});
