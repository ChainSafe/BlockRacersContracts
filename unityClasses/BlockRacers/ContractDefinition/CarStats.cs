using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;

namespace BlockRacers.BlockRacers.ContractDefinition
{
    public partial class CarStats : CarStatsBase { }

    public class CarStatsBase 
    {
        [Parameter("uint256", "carTypeId", 1)]
        public virtual BigInteger CarTypeId { get; set; }
        [Parameter("tuple", "carOptionData", 2)]
        public virtual CarOption CarOptionData { get; set; }
        [Parameter("uint16", "handlingLevel", 3)]
        public virtual ushort HandlingLevel { get; set; }
        [Parameter("uint16", "engineLevel", 4)]
        public virtual ushort EngineLevel { get; set; }
        [Parameter("uint16", "nosLevel", 5)]
        public virtual ushort NosLevel { get; set; }
    }
}
