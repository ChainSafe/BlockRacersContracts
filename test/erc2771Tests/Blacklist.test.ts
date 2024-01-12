import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { addToBlacklist, deployBlacklistFixture, isBlackListed, removeFromBlackList } from "../../src/Blacklist.contract";
import { getAccounts } from "../../src/generalFunctions";

describe("Blacklist - ERC2771", function () {
    describe("write", function () {
        it("addToBlackList", async () => {
            const { admin, player1 } = await getAccounts()
            const blacklistContract = await loadFixture(deployBlacklistFixture)

            await addToBlacklist(blacklistContract, admin, player1.address, true)
        })
        it("removeFromBlackList", async () => {
            const { admin, player1 } = await getAccounts()
            const blacklistContract = await loadFixture(deployBlacklistFixture)

            await addToBlacklist(blacklistContract, admin, player1.address, true)

            await isBlackListed(blacklistContract, player1.address, true)
            await removeFromBlackList(blacklistContract, admin, player1.address, true)
            await isBlackListed(blacklistContract, player1.address, false)
        })
    });
});
