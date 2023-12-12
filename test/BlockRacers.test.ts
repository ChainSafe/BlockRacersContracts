import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { CarTypeOption, blockRacersFeeAccount, checkAssets, checkOwner, checkToken, deployCoreFixture, getCarOption, mintCar, numberOfCarsMinted } from "./contractFunctions/BlockRacers.contract";
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
        it("getUpgradeData")
        it("isTrustedForwarder", async () => {
            const { trustedForwarder } = await getAccounts()
            const coreContract = await loadFixture(deployCoreFixture())

            await isTrustedForwarder(coreContract as ERC2771Context, trustedForwarder.address, true)
        })
        it("mintCar", async () => {
            const { player1 } = await getAccounts()

            const { coreContract, tokenContract } = await loadFixture(defaultDeployFixture(true))
 
            const { carCost } = await getCarOption(coreContract, CarTypeOption.FIRST)

            await setAllowanceToken(tokenContract, player1, await coreContract.getAddress(), carCost);
            await mintCar(coreContract, tokenContract, CarTypeOption.FIRST, player1)
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
        it("renounceOwnership")
        it("setBlockRacersFeeAccount")
        it("setNewGameSettings")
        it("transferOwnership")
    })

    describe("write", function () {
        it("mintCar")
        it("upgradeEngine")
        it("upgradeHandling")
        it("upgradeNos")
    });

    describe("events", function () {
        it("MintCar")
        it("UpgradeEngine")
        it("UpgradeHandling")
        it("UpgradeNos")
    })

    describe("errors", function () {
        it("CarTypeDoesNotExist")
        it("NotCarOwner")
        it("InvalidItemType")
        it("UpgradeNotPossible")
    })
});
