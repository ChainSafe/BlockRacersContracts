using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;

namespace BlockGameWagering.BlockGameWagering.ContractDefinition
{
    public partial class Wager : WagerBase { }

    public class WagerBase 
    {
        [Parameter("uint256", "prize", 1)]
        public virtual BigInteger Prize { get; set; }
        [Parameter("address", "creator", 2)]
        public virtual string Creator { get; set; }
        [Parameter("address", "opponent", 3)]
        public virtual string Opponent { get; set; }
        [Parameter("address", "winner", 4)]
        public virtual string Winner { get; set; }
        [Parameter("uint8", "state", 5)]
        public virtual byte State { get; set; }
    }
}
