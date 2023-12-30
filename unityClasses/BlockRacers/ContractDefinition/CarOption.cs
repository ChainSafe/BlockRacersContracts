using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;

namespace BlockRacers.BlockRacers.ContractDefinition
{
    public partial class CarOption : CarOptionBase { }

    public class CarOptionBase 
    {
        [Parameter("uint256", "carCost", 1)]
        public virtual BigInteger CarCost { get; set; }
        [Parameter("string", "carUri", 2)]
        public virtual string CarUri { get; set; }
    }
}
