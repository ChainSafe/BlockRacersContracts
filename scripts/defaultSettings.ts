import { BlockRacers } from "../typechain-types/contracts/BlockRacers";

export const generalSettings = {
    NFT: {
        baseUri: "https://ipfs.chainsafe.io/ipfs/",
    }
}

export const defaultGameSettings: BlockRacers.GameSettingsDataStruct = {
    carOptions: [{
        carCost: 50*1e18,
        carUri: "QmdW2tRdCw2YERvhzbMHn2qcaBHPMNo5ofsoo8q9q9N3Qe"
    },{
        carCost: 50*1e18,
        carUri: "QmWavwGJgqxMP38a6cxn9ehJASqdXNNcRT4YD7sa3dDMST"
    },{
        carCost: 50*1e18,
        carUri: "QmevuY959udKfEYXJvLZmVqiNFVe6KfqqxMRprYbtRhncP"
    }],
    engineMaxLevel: 8,
    enginePrice: 20*1e18,
    handlingMaxLevel: 8,
    handlingPrice: 20*1e18,
    nosMaxLevel: 8,
    nosPrice: 20*1e18,
}