using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Contracts.CQS;
using Nethereum.Contracts;
using System.Threading;

namespace BlockRacersAssets.BlockRacersAssets.ContractDefinition
{


    public partial class BlockRacersAssetsDeployment : BlockRacersAssetsDeploymentBase
    {
        public BlockRacersAssetsDeployment() : base(BYTECODE) { }
        public BlockRacersAssetsDeployment(string byteCode) : base(byteCode) { }
    }

    public class BlockRacersAssetsDeploymentBase : ContractDeploymentMessage
    {
        public static string BYTECODE = "0x60c06040523480156200001157600080fd5b506040516200250838038062002508833981016040819052620000349162000100565b6001600160a01b038216608052806200004d816200006d565b50620000586200007f565b6001600160a01b031660a05250620003539050565b60026200007b828262000287565b5050565b60006200008b62000090565b905090565b60006200009d33620000c3565b8015620000ab575060143610155b15620000be575060131936013560601c90565b503390565b6000620000cf60805190565b6001600160a01b0316826001600160a01b0316149050919050565b634e487b7160e01b600052604160045260246000fd5b600080604083850312156200011457600080fd5b82516001600160a01b03811681146200012c57600080fd5b602084810151919350906001600160401b03808211156200014c57600080fd5b818601915086601f8301126200016157600080fd5b815181811115620001765762000176620000ea565b604051601f8201601f19908116603f01168101908382118183101715620001a157620001a1620000ea565b816040528281528986848701011115620001ba57600080fd5b600093505b82841015620001de5784840186015181850187015292850192620001bf565b60008684830101528096505050505050509250929050565b600181811c908216806200020b57607f821691505b6020821081036200022c57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111562000282576000816000526020600020601f850160051c810160208610156200025d5750805b601f850160051c820191505b818110156200027e5782815560010162000269565b5050505b505050565b81516001600160401b03811115620002a357620002a3620000ea565b620002bb81620002b48454620001f6565b8462000232565b602080601f831160018114620002f35760008415620002da5750858301515b600019600386901b1c1916600185901b1785556200027e565b600085815260208120601f198616915b82811015620003245788860151825594840194600190910190840162000303565b5085821015620003435787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a05161216c6200039c600039600081816102eb0152818161039a0152818161064e01526107190152600081816101cd0152818161021f0152610cf9015261216c6000f3fe608060405234801561001057600080fd5b50600436106100ff5760003560e01c80636a62784211610097578063a22cb46511610066578063a22cb4651461028a578063e985e9c51461029d578063ec49c9a3146102e6578063f242432a1461030d57600080fd5b80636a6278421461020a5780637da0a8771461021d5780638b87c54414610264578063a0bcfc7f1461027757600080fd5b80632eb2c2d6116100d35780632eb2c2d6146101755780634e1273f41461018a5780634f558e79146101aa578063572b6c05146101bd57600080fd5b8062fdd58e1461010457806301ffc9a71461012a5780630e89341c1461014d57806318160ddd1461016d575b600080fd5b610117610112366004611750565b610320565b6040519081526020015b60405180910390f35b61013d6101383660046117a8565b610355565b6040519015158152602001610121565b61016061015b3660046117c5565b610360565b604051610121919061184c565b600454610117565b610188610183366004611a0f565b610463565b005b61019d610198366004611ab9565b61054f565b6040516101219190611bb5565b61013d6101b83660046117c5565b610635565b61013d6101cb366004611bc8565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff90811691161490565b610117610218366004611bc8565b61064a565b7f00000000000000000000000000000000000000000000000000000000000000005b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610121565b61019d610272366004611bc8565b6106e6565b610188610285366004611be3565b610717565b610188610298366004611c34565b6107af565b61013d6102ab366004611c70565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205460ff1690565b61023f7f000000000000000000000000000000000000000000000000000000000000000081565b61018861031b366004611ca3565b6107c5565b60008181526020818152604080832073ffffffffffffffffffffffffffffffffffffffff861684529091529020545b92915050565b600061034f826108a4565b606061036b82610987565b6040517fd1da95e0000000000000000000000000000000000000000000000000000000008152600481018490527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff169063d1da95e090602401600060405180830381865afa1580156103f6573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820160405261043c9190810190611d08565b60405160200161044d929190611d7f565b6040516020818303038152906040529050919050565b600061046d610a1b565b90508073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16141580156104de575073ffffffffffffffffffffffffffffffffffffffff80871660009081526001602090815260408083209385168352929052205460ff16155b1561053a576040517fe237d92200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8083166004830152871660248201526044015b60405180910390fd5b6105478686868686610a2a565b505050505050565b6060815183511461059957815183516040517f5b05999100000000000000000000000000000000000000000000000000000000815260048101929092526024820152604401610531565b6000835167ffffffffffffffff8111156105b5576105b561185f565b6040519080825280602002602001820160405280156105de578160200160208202803683370190505b50905060005b845181101561062d5760208082028601015161060890602080840287010151610320565b82828151811061061a5761061a611dd6565b60209081029190910101526001016105e4565b509392505050565b6000808211801561034f575050600454101590565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1661068b610a1b565b73ffffffffffffffffffffffffffffffffffffffff16146106d8576040517fdb98489700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61034f82610ade565b919050565b73ffffffffffffffffffffffffffffffffffffffff8116600090815260036020526040902060609061034f90610b12565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16610756610a1b565b73ffffffffffffffffffffffffffffffffffffffff16146107a3576040517fdb98489700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6107ac81610b26565b50565b6107c16107ba610a1b565b8383610b32565b5050565b60006107cf610a1b565b90508073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614158015610840575073ffffffffffffffffffffffffffffffffffffffff80871660009081526001602090815260408083209385168352929052205460ff16155b15610897576040517fe237d92200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff808316600483015287166024820152604401610531565b6105478686868686610c1a565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fd9b67a2600000000000000000000000000000000000000000000000000000000148061093757507fffffffff0000000000000000000000000000000000000000000000000000000082167f0e89341c00000000000000000000000000000000000000000000000000000000145b8061034f57507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff0000000000000000000000000000000000000000000000000000000083161461034f565b60606002805461099690611e05565b80601f01602080910402602001604051908101604052809291908181526020018280546109c290611e05565b8015610a0f5780601f106109e457610100808354040283529160200191610a0f565b820191906000526020600020905b8154815290600101906020018083116109f257829003601f168201915b50505050509050919050565b6000610a25610cf5565b905090565b73ffffffffffffffffffffffffffffffffffffffff8416610a7a576040517f57f447ce00000000000000000000000000000000000000000000000000000000815260006004820152602401610531565b73ffffffffffffffffffffffffffffffffffffffff8516610aca576040517f01a8351400000000000000000000000000000000000000000000000000000000815260006004820152602401610531565b610ad78585858585610d72565b5050505050565b6000806004546001610af09190611e87565b60408051600081526020810190915290915061034f9084908390600190610ddc565b60606000610b1f83610e5f565b9392505050565b60026107c18282611ee7565b73ffffffffffffffffffffffffffffffffffffffff8216610b82576040517fced3e10000000000000000000000000000000000000000000000000000000000815260006004820152602401610531565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8416610c6a576040517f57f447ce00000000000000000000000000000000000000000000000000000000815260006004820152602401610531565b73ffffffffffffffffffffffffffffffffffffffff8516610cba576040517f01a8351400000000000000000000000000000000000000000000000000000000815260006004820152602401610531565b60408051600180825260208201869052818301908152606082018590526080820190925290610cec8787848487610d72565b50505050505050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1633148015610d3d575060143610155b15610d6d57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec36013560601c90565b503390565b610d7e85858585610eba565b73ffffffffffffffffffffffffffffffffffffffff841615610ad7576000610da4610a1b565b90508351600103610dce5760208481015190840151610dc7838989858589611066565b5050610547565b610547818787878787611258565b73ffffffffffffffffffffffffffffffffffffffff8416610e2c576040517f57f447ce00000000000000000000000000000000000000000000000000000000815260006004820152602401610531565b60408051600180825260208201869052818301908152606082018590526080820190925290610547600087848487610d72565b606081600001805480602002602001604051908101604052809291908181526020018280548015610a0f57602002820191906000526020600020905b815481526020019060010190808311610e9b5750505050509050919050565b610ec6848484846113e9565b60045473ffffffffffffffffffffffffffffffffffffffff85166110195760005b835181101561101257610ef982612001565b915081848281518110610f0e57610f0e611dd6565b602002602001015114610f6a57838181518110610f2d57610f2d611dd6565b60200260200101516040517f02144c1000000000000000000000000000000000000000000000000000000000815260040161053191815260200190565b828181518110610f7c57610f7c611dd6565b6020026020010151600114610fda57828181518110610f9d57610f9d611dd6565b60200260200101516040517f72cd4c4800000000000000000000000000000000000000000000000000000000815260040161053191815260200190565b73ffffffffffffffffffffffffffffffffffffffff8516600090815260036020526040902061100990836116d6565b50600101610ee7565b5060048190555b73ffffffffffffffffffffffffffffffffffffffff8416610ad7576040517ffa32799b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff84163b15610547576040517ff23a6e6100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063f23a6e61906110dd9089908990889088908890600401612039565b6020604051808303816000875af1925050508015611136575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261113391810190612089565b60015b6111c5573d808015611164576040519150601f19603f3d011682016040523d82523d6000602084013e611169565b606091505b5080516000036111bd576040517f57f447ce00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff86166004820152602401610531565b805181602001fd5b7fffffffff0000000000000000000000000000000000000000000000000000000081167ff23a6e610000000000000000000000000000000000000000000000000000000014610cec576040517f57f447ce00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff86166004820152602401610531565b73ffffffffffffffffffffffffffffffffffffffff84163b15610547576040517fbc197c8100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063bc197c81906112cf90899089908890889088906004016120a6565b6020604051808303816000875af1925050508015611328575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261132591810190612089565b60015b611356573d808015611164576040519150601f19603f3d011682016040523d82523d6000602084013e611169565b7fffffffff0000000000000000000000000000000000000000000000000000000081167fbc197c810000000000000000000000000000000000000000000000000000000014610cec576040517f57f447ce00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff86166004820152602401610531565b805182511461143157815181516040517f5b05999100000000000000000000000000000000000000000000000000000000815260048101929092526024820152604401610531565b600061143b610a1b565b905060005b83518110156115a95760208181028581018201519085019091015173ffffffffffffffffffffffffffffffffffffffff8816156115405760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8c1684529091529020548181101561150c576040517f03dee4c500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8a166004820152602481018290526044810183905260648101849052608401610531565b60008381526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8d16845290915290209082900390555b73ffffffffffffffffffffffffffffffffffffffff87161561159f5760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8b16845290915281208054839290611599908490611e87565b90915550505b5050600101611440565b50825160010361165157602083015160009060208401519091508573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628585604051611642929190918252602082015260400190565b60405180910390a45050610ad7565b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb86866040516116c7929190612111565b60405180910390a45050505050565b6000610b1f838360008181526001830160205260408120546117245750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561034f565b50600061034f565b803573ffffffffffffffffffffffffffffffffffffffff811681146106e157600080fd5b6000806040838503121561176357600080fd5b61176c8361172c565b946020939093013593505050565b7fffffffff00000000000000000000000000000000000000000000000000000000811681146107ac57600080fd5b6000602082840312156117ba57600080fd5b8135610b1f8161177a565b6000602082840312156117d757600080fd5b5035919050565b60005b838110156117f95781810151838201526020016117e1565b50506000910152565b6000815180845261181a8160208601602086016117de565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000610b1f6020830184611802565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff811182821017156118d5576118d561185f565b604052919050565b600067ffffffffffffffff8211156118f7576118f761185f565b5060051b60200190565b600082601f83011261191257600080fd5b81356020611927611922836118dd565b61188e565b8083825260208201915060208460051b87010193508684111561194957600080fd5b602086015b84811015611965578035835291830191830161194e565b509695505050505050565b600067ffffffffffffffff82111561198a5761198a61185f565b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b60006119c461192284611970565b90508281528383830111156119d857600080fd5b828260208301376000602084830101529392505050565b600082601f830112611a0057600080fd5b610b1f838335602085016119b6565b600080600080600060a08688031215611a2757600080fd5b611a308661172c565b9450611a3e6020870161172c565b9350604086013567ffffffffffffffff80821115611a5b57600080fd5b611a6789838a01611901565b94506060880135915080821115611a7d57600080fd5b611a8989838a01611901565b93506080880135915080821115611a9f57600080fd5b50611aac888289016119ef565b9150509295509295909350565b60008060408385031215611acc57600080fd5b823567ffffffffffffffff80821115611ae457600080fd5b818501915085601f830112611af857600080fd5b81356020611b08611922836118dd565b82815260059290921b84018101918181019089841115611b2757600080fd5b948201945b83861015611b4c57611b3d8661172c565b82529482019490820190611b2c565b96505086013592505080821115611b6257600080fd5b50611b6f85828601611901565b9150509250929050565b60008151808452602080850194506020840160005b83811015611baa57815187529582019590820190600101611b8e565b509495945050505050565b602081526000610b1f6020830184611b79565b600060208284031215611bda57600080fd5b610b1f8261172c565b600060208284031215611bf557600080fd5b813567ffffffffffffffff811115611c0c57600080fd5b8201601f81018413611c1d57600080fd5b611c2c848235602084016119b6565b949350505050565b60008060408385031215611c4757600080fd5b611c508361172c565b915060208301358015158114611c6557600080fd5b809150509250929050565b60008060408385031215611c8357600080fd5b611c8c8361172c565b9150611c9a6020840161172c565b90509250929050565b600080600080600060a08688031215611cbb57600080fd5b611cc48661172c565b9450611cd26020870161172c565b93506040860135925060608601359150608086013567ffffffffffffffff811115611cfc57600080fd5b611aac888289016119ef565b600060208284031215611d1a57600080fd5b815167ffffffffffffffff811115611d3157600080fd5b8201601f81018413611d4257600080fd5b8051611d5061192282611970565b818152856020838501011115611d6557600080fd5b611d768260208301602086016117de565b95945050505050565b60008351611d918184602088016117de565b835190830190611da58183602088016117de565b7f2e6a736f6e0000000000000000000000000000000000000000000000000000009101908152600501949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600181811c90821680611e1957607f821691505b602082108103611e52577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8082018082111561034f5761034f611e58565b601f821115611ee2576000816000526020600020601f850160051c81016020861015611ec35750805b601f850160051c820191505b8181101561054757828155600101611ecf565b505050565b815167ffffffffffffffff811115611f0157611f0161185f565b611f1581611f0f8454611e05565b84611e9a565b602080601f831160018114611f685760008415611f325750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555610547565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b82811015611fb557888601518255948401946001909101908401611f96565b5085821015611ff157878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361203257612032611e58565b5060010190565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525084604083015283606083015260a0608083015261207e60a0830184611802565b979650505050505050565b60006020828403121561209b57600080fd5b8151610b1f8161177a565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525060a060408301526120df60a0830186611b79565b82810360608401526120f18186611b79565b905082810360808401526121058185611802565b98975050505050505050565b6040815260006121246040830185611b79565b8281036020840152611d768185611b7956fea26469706673582212205a661b87487460d039e8b66dd0d1fb4aabe1eed715d53b821510da5c3485a5d164736f6c63430008160033";
        public BlockRacersAssetsDeploymentBase() : base(BYTECODE) { }
        public BlockRacersAssetsDeploymentBase(string byteCode) : base(byteCode) { }
        [Parameter("address", "trustedForwarder", 1)]
        public virtual string TrustedForwarder { get; set; }
        [Parameter("string", "baseUri_", 2)]
        public virtual string Baseuri { get; set; }
    }

    public partial class BlockRacersFunction : BlockRacersFunctionBase { }

    [Function("BLOCK_RACERS", "address")]
    public class BlockRacersFunctionBase : FunctionMessage
    {

    }

    public partial class BalanceOfFunction : BalanceOfFunctionBase { }

    [Function("balanceOf", "uint256")]
    public class BalanceOfFunctionBase : FunctionMessage
    {
        [Parameter("address", "account", 1)]
        public virtual string Account { get; set; }
        [Parameter("uint256", "id", 2)]
        public virtual BigInteger Id { get; set; }
    }

    public partial class BalanceOfBatchFunction : BalanceOfBatchFunctionBase { }

    [Function("balanceOfBatch", "uint256[]")]
    public class BalanceOfBatchFunctionBase : FunctionMessage
    {
        [Parameter("address[]", "accounts", 1)]
        public virtual List<string> Accounts { get; set; }
        [Parameter("uint256[]", "ids", 2)]
        public virtual List<BigInteger> Ids { get; set; }
    }

    public partial class ExistsFunction : ExistsFunctionBase { }

    [Function("exists", "bool")]
    public class ExistsFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "id", 1)]
        public virtual BigInteger Id { get; set; }
    }

    public partial class GetInventoryFunction : GetInventoryFunctionBase { }

    [Function("getInventory", "uint256[]")]
    public class GetInventoryFunctionBase : FunctionMessage
    {
        [Parameter("address", "holder", 1)]
        public virtual string Holder { get; set; }
    }

    public partial class IsApprovedForAllFunction : IsApprovedForAllFunctionBase { }

    [Function("isApprovedForAll", "bool")]
    public class IsApprovedForAllFunctionBase : FunctionMessage
    {
        [Parameter("address", "account", 1)]
        public virtual string Account { get; set; }
        [Parameter("address", "operator", 2)]
        public virtual string Operator { get; set; }
    }

    public partial class IsTrustedForwarderFunction : IsTrustedForwarderFunctionBase { }

    [Function("isTrustedForwarder", "bool")]
    public class IsTrustedForwarderFunctionBase : FunctionMessage
    {
        [Parameter("address", "forwarder", 1)]
        public virtual string Forwarder { get; set; }
    }

    public partial class MintFunction : MintFunctionBase { }

    [Function("mint", "uint256")]
    public class MintFunctionBase : FunctionMessage
    {
        [Parameter("address", "to", 1)]
        public virtual string To { get; set; }
    }

    public partial class SafeBatchTransferFromFunction : SafeBatchTransferFromFunctionBase { }

    [Function("safeBatchTransferFrom")]
    public class SafeBatchTransferFromFunctionBase : FunctionMessage
    {
        [Parameter("address", "from", 1)]
        public virtual string From { get; set; }
        [Parameter("address", "to", 2)]
        public virtual string To { get; set; }
        [Parameter("uint256[]", "ids", 3)]
        public virtual List<BigInteger> Ids { get; set; }
        [Parameter("uint256[]", "values", 4)]
        public virtual List<BigInteger> Values { get; set; }
        [Parameter("bytes", "data", 5)]
        public virtual byte[] Data { get; set; }
    }

    public partial class SafeTransferFromFunction : SafeTransferFromFunctionBase { }

    [Function("safeTransferFrom")]
    public class SafeTransferFromFunctionBase : FunctionMessage
    {
        [Parameter("address", "from", 1)]
        public virtual string From { get; set; }
        [Parameter("address", "to", 2)]
        public virtual string To { get; set; }
        [Parameter("uint256", "id", 3)]
        public virtual BigInteger Id { get; set; }
        [Parameter("uint256", "value", 4)]
        public virtual BigInteger Value { get; set; }
        [Parameter("bytes", "data", 5)]
        public virtual byte[] Data { get; set; }
    }

    public partial class SetApprovalForAllFunction : SetApprovalForAllFunctionBase { }

    [Function("setApprovalForAll")]
    public class SetApprovalForAllFunctionBase : FunctionMessage
    {
        [Parameter("address", "operator", 1)]
        public virtual string Operator { get; set; }
        [Parameter("bool", "approved", 2)]
        public virtual bool Approved { get; set; }
    }

    public partial class SetBaseUriFunction : SetBaseUriFunctionBase { }

    [Function("setBaseUri")]
    public class SetBaseUriFunctionBase : FunctionMessage
    {
        [Parameter("string", "baseUri", 1)]
        public virtual string BaseUri { get; set; }
    }

    public partial class SupportsInterfaceFunction : SupportsInterfaceFunctionBase { }

    [Function("supportsInterface", "bool")]
    public class SupportsInterfaceFunctionBase : FunctionMessage
    {
        [Parameter("bytes4", "interfaceId", 1)]
        public virtual byte[] InterfaceId { get; set; }
    }

    public partial class TotalSupplyFunction : TotalSupplyFunctionBase { }

    [Function("totalSupply", "uint256")]
    public class TotalSupplyFunctionBase : FunctionMessage
    {

    }

    public partial class TrustedForwarderFunction : TrustedForwarderFunctionBase { }

    [Function("trustedForwarder", "address")]
    public class TrustedForwarderFunctionBase : FunctionMessage
    {

    }

    public partial class UriFunction : UriFunctionBase { }

    [Function("uri", "string")]
    public class UriFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "tokenId", 1)]
        public virtual BigInteger TokenId { get; set; }
    }

    public partial class ApprovalForAllEventDTO : ApprovalForAllEventDTOBase { }

    [Event("ApprovalForAll")]
    public class ApprovalForAllEventDTOBase : IEventDTO
    {
        [Parameter("address", "account", 1, true )]
        public virtual string Account { get; set; }
        [Parameter("address", "operator", 2, true )]
        public virtual string Operator { get; set; }
        [Parameter("bool", "approved", 3, false )]
        public virtual bool Approved { get; set; }
    }

    public partial class TransferBatchEventDTO : TransferBatchEventDTOBase { }

    [Event("TransferBatch")]
    public class TransferBatchEventDTOBase : IEventDTO
    {
        [Parameter("address", "operator", 1, true )]
        public virtual string Operator { get; set; }
        [Parameter("address", "from", 2, true )]
        public virtual string From { get; set; }
        [Parameter("address", "to", 3, true )]
        public virtual string To { get; set; }
        [Parameter("uint256[]", "ids", 4, false )]
        public virtual List<BigInteger> Ids { get; set; }
        [Parameter("uint256[]", "values", 5, false )]
        public virtual List<BigInteger> Values { get; set; }
    }

    public partial class TransferSingleEventDTO : TransferSingleEventDTOBase { }

    [Event("TransferSingle")]
    public class TransferSingleEventDTOBase : IEventDTO
    {
        [Parameter("address", "operator", 1, true )]
        public virtual string Operator { get; set; }
        [Parameter("address", "from", 2, true )]
        public virtual string From { get; set; }
        [Parameter("address", "to", 3, true )]
        public virtual string To { get; set; }
        [Parameter("uint256", "id", 4, false )]
        public virtual BigInteger Id { get; set; }
        [Parameter("uint256", "value", 5, false )]
        public virtual BigInteger Value { get; set; }
    }

    public partial class UriEventDTO : UriEventDTOBase { }

    [Event("URI")]
    public class UriEventDTOBase : IEventDTO
    {
        [Parameter("string", "value", 1, false )]
        public virtual string Value { get; set; }
        [Parameter("uint256", "id", 2, true )]
        public virtual BigInteger Id { get; set; }
    }

    public partial class BurningNotAllowedError : BurningNotAllowedErrorBase { }
    [Error("BurningNotAllowed")]
    public class BurningNotAllowedErrorBase : IErrorDTO
    {
    }

    public partial class ERC1155InsufficientBalanceError : ERC1155InsufficientBalanceErrorBase { }

    [Error("ERC1155InsufficientBalance")]
    public class ERC1155InsufficientBalanceErrorBase : IErrorDTO
    {
        [Parameter("address", "sender", 1)]
        public virtual string Sender { get; set; }
        [Parameter("uint256", "balance", 2)]
        public virtual BigInteger Balance { get; set; }
        [Parameter("uint256", "needed", 3)]
        public virtual BigInteger Needed { get; set; }
        [Parameter("uint256", "tokenId", 4)]
        public virtual BigInteger TokenId { get; set; }
    }

    public partial class ERC1155InvalidApproverError : ERC1155InvalidApproverErrorBase { }

    [Error("ERC1155InvalidApprover")]
    public class ERC1155InvalidApproverErrorBase : IErrorDTO
    {
        [Parameter("address", "approver", 1)]
        public virtual string Approver { get; set; }
    }

    public partial class ERC1155InvalidArrayLengthError : ERC1155InvalidArrayLengthErrorBase { }

    [Error("ERC1155InvalidArrayLength")]
    public class ERC1155InvalidArrayLengthErrorBase : IErrorDTO
    {
        [Parameter("uint256", "idsLength", 1)]
        public virtual BigInteger IdsLength { get; set; }
        [Parameter("uint256", "valuesLength", 2)]
        public virtual BigInteger ValuesLength { get; set; }
    }

    public partial class ERC1155InvalidOperatorError : ERC1155InvalidOperatorErrorBase { }

    [Error("ERC1155InvalidOperator")]
    public class ERC1155InvalidOperatorErrorBase : IErrorDTO
    {
        [Parameter("address", "operator", 1)]
        public virtual string Operator { get; set; }
    }

    public partial class ERC1155InvalidReceiverError : ERC1155InvalidReceiverErrorBase { }

    [Error("ERC1155InvalidReceiver")]
    public class ERC1155InvalidReceiverErrorBase : IErrorDTO
    {
        [Parameter("address", "receiver", 1)]
        public virtual string Receiver { get; set; }
    }

    public partial class ERC1155InvalidSenderError : ERC1155InvalidSenderErrorBase { }

    [Error("ERC1155InvalidSender")]
    public class ERC1155InvalidSenderErrorBase : IErrorDTO
    {
        [Parameter("address", "sender", 1)]
        public virtual string Sender { get; set; }
    }

    public partial class ERC1155MissingApprovalForAllError : ERC1155MissingApprovalForAllErrorBase { }

    [Error("ERC1155MissingApprovalForAll")]
    public class ERC1155MissingApprovalForAllErrorBase : IErrorDTO
    {
        [Parameter("address", "operator", 1)]
        public virtual string Operator { get; set; }
        [Parameter("address", "owner", 2)]
        public virtual string Owner { get; set; }
    }

    public partial class InvalidMintIdError : InvalidMintIdErrorBase { }

    [Error("InvalidMintId")]
    public class InvalidMintIdErrorBase : IErrorDTO
    {
        [Parameter("uint256", "id", 1)]
        public virtual BigInteger Id { get; set; }
    }

    public partial class InvalidMintValueError : InvalidMintValueErrorBase { }

    [Error("InvalidMintValue")]
    public class InvalidMintValueErrorBase : IErrorDTO
    {
        [Parameter("uint256", "value", 1)]
        public virtual BigInteger Value { get; set; }
    }

    public partial class NotAuthorizedGameContractError : NotAuthorizedGameContractErrorBase { }
    [Error("NotAuthorizedGameContract")]
    public class NotAuthorizedGameContractErrorBase : IErrorDTO
    {
    }

    public partial class BlockRacersOutputDTO : BlockRacersOutputDTOBase { }

    [FunctionOutput]
    public class BlockRacersOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("address", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }

    public partial class BalanceOfOutputDTO : BalanceOfOutputDTOBase { }

    [FunctionOutput]
    public class BalanceOfOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("uint256", "", 1)]
        public virtual BigInteger ReturnValue1 { get; set; }
    }

    public partial class BalanceOfBatchOutputDTO : BalanceOfBatchOutputDTOBase { }

    [FunctionOutput]
    public class BalanceOfBatchOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("uint256[]", "", 1)]
        public virtual List<BigInteger> ReturnValue1 { get; set; }
    }

    public partial class ExistsOutputDTO : ExistsOutputDTOBase { }

    [FunctionOutput]
    public class ExistsOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("bool", "", 1)]
        public virtual bool ReturnValue1 { get; set; }
    }

    public partial class GetInventoryOutputDTO : GetInventoryOutputDTOBase { }

    [FunctionOutput]
    public class GetInventoryOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("uint256[]", "", 1)]
        public virtual List<BigInteger> ReturnValue1 { get; set; }
    }

    public partial class IsApprovedForAllOutputDTO : IsApprovedForAllOutputDTOBase { }

    [FunctionOutput]
    public class IsApprovedForAllOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("bool", "", 1)]
        public virtual bool ReturnValue1 { get; set; }
    }

    public partial class IsTrustedForwarderOutputDTO : IsTrustedForwarderOutputDTOBase { }

    [FunctionOutput]
    public class IsTrustedForwarderOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("bool", "", 1)]
        public virtual bool ReturnValue1 { get; set; }
    }











    public partial class SupportsInterfaceOutputDTO : SupportsInterfaceOutputDTOBase { }

    [FunctionOutput]
    public class SupportsInterfaceOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("bool", "", 1)]
        public virtual bool ReturnValue1 { get; set; }
    }

    public partial class TotalSupplyOutputDTO : TotalSupplyOutputDTOBase { }

    [FunctionOutput]
    public class TotalSupplyOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("uint256", "", 1)]
        public virtual BigInteger ReturnValue1 { get; set; }
    }

    public partial class TrustedForwarderOutputDTO : TrustedForwarderOutputDTOBase { }

    [FunctionOutput]
    public class TrustedForwarderOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("address", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }

    public partial class UriOutputDTO : UriOutputDTOBase { }

    [FunctionOutput]
    public class UriOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("string", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }
}
