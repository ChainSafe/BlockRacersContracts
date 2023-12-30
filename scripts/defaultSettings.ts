import { parseUnits } from "ethers";
import { BlockRacers } from "../typechain-types/contracts/BlockRacers";

export const generalSettings = {
    NFT: {
        baseUri: "https://ipfs.chainsafe.io/ipfs/",
    }
}

export const defaultGameSettings: BlockRacers.GameSettingsDataStruct = {
    carOptions: [{
        carCost: parseUnits("50", 18),
        carUri: "QmdW2tRdCw2YERvhzbMHn2qcaBHPMNo5ofsoo8q9q9N3Qe"
    },{
        carCost: parseUnits("50", 18),
        carUri: "QmWavwGJgqxMP38a6cxn9ehJASqdXNNcRT4YD7sa3dDMST"
    },{
        carCost: parseUnits("50", 18),
        carUri: "QmevuY959udKfEYXJvLZmVqiNFVe6KfqqxMRprYbtRhncP"
    }],
    engineMaxLevel: 8,
    enginePrice: parseUnits("20", 18),
    handlingMaxLevel: 8,
    handlingPrice: parseUnits("20", 18),
    nosMaxLevel: 8,
    nosPrice: parseUnits("20", 18),
}