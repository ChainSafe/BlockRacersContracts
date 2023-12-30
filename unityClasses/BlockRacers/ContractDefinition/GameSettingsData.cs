using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;

namespace BlockRacers.BlockRacers.ContractDefinition
{
    public partial class GameSettingsData : GameSettingsDataBase { }

    public class GameSettingsDataBase 
    {
        [Parameter("uint256", "enginePrice", 1)]
        public virtual BigInteger EnginePrice { get; set; }
        [Parameter("uint256", "handlingPrice", 2)]
        public virtual BigInteger HandlingPrice { get; set; }
        [Parameter("uint256", "nosPrice", 3)]
        public virtual BigInteger NosPrice { get; set; }
        [Parameter("uint16", "handlingMaxLevel", 4)]
        public virtual ushort HandlingMaxLevel { get; set; }
        [Parameter("uint16", "engineMaxLevel", 5)]
        public virtual ushort EngineMaxLevel { get; set; }
        [Parameter("uint16", "nosMaxLevel", 6)]
        public virtual ushort NosMaxLevel { get; set; }
        [Parameter("tuple[]", "carOptions", 7)]
        public virtual List<CarOption> CarOptions { get; set; }
    }
}
