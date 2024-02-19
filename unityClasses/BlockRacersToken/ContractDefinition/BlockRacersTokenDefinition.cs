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

namespace BlockRacersToken.BlockRacersToken.ContractDefinition
{


    public partial class BlockRacersTokenDeployment : BlockRacersTokenDeploymentBase
    {
        public BlockRacersTokenDeployment() : base(BYTECODE) { }
        public BlockRacersTokenDeployment(string byteCode) : base(byteCode) { }
    }

    public class BlockRacersTokenDeploymentBase : ContractDeploymentMessage
    {
        public static string BYTECODE = "0x60a06040523480156200001157600080fd5b5060405162001a2138038062001a218339810160408190526200003491620002f9565b82846040518060400160405280601081526020016f213637b1b5a930b1b2b939aa37b5b2b760811b815250604051806040016040528060048152602001635241434560e01b81525081600390816200008d9190620003f2565b5060046200009c8282620003f2565b5050506001600160a01b039081166080528116620000d557604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b620000e08162000119565b50600680546001600160a01b0319166001600160a01b03841617905580156200010f576200010f82826200016b565b50505050620004e6565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b038216620001975760405163ec442f0560e01b815260006004820152602401620000cc565b620001a560008383620001a9565b5050565b6001600160a01b038316620001d8578060026000828254620001cc9190620004be565b909155506200024c9050565b6001600160a01b038316600090815260208190526040902054818110156200022d5760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401620000cc565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b0382166200026a5760028054829003905562000289565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620002cf91815260200190565b60405180910390a3505050565b80516001600160a01b0381168114620002f457600080fd5b919050565b600080600080608085870312156200031057600080fd5b6200031b85620002dc565b93506200032b60208601620002dc565b92506200033b60408601620002dc565b6060959095015193969295505050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200037657607f821691505b6020821081036200039757634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620003ed576000816000526020600020601f850160051c81016020861015620003c85750805b601f850160051c820191505b81811015620003e957828155600101620003d4565b5050505b505050565b81516001600160401b038111156200040e576200040e6200034b565b62000426816200041f845462000361565b846200039d565b602080601f8311600181146200045e5760008415620004455750858301515b600019600386901b1c1916600185901b178555620003e9565b600085815260208120601f198616915b828110156200048f578886015182559484019460019091019084016200046e565b5085821015620004ae5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b80820180821115620004e057634e487b7160e01b600052601160045260246000fd5b92915050565b60805161151162000510600039600081816101cd0152818161028f0152610b0701526115116000f3fe608060405234801561001057600080fd5b506004361061011b5760003560e01c806362d10336116100b25780638da5cb5b11610081578063a9059cbb11610066578063a9059cbb146102d9578063dd62ed3e146102ec578063f2fde38b1461033257600080fd5b80638da5cb5b146102b357806395d89b41146102d157600080fd5b806362d103361461020a57806370a082311461024f578063715018a6146102855780637da0a8771461028d57600080fd5b806323b872dd116100ee57806323b872dd14610188578063313ce5671461019b57806338878afc146101aa578063572b6c05146101bd57600080fd5b806306fdde031461012057806308f6c76e1461013e578063095ea7b31461015357806318160ddd14610176575b600080fd5b610128610345565b6040516101359190611175565b60405180910390f35b61015161014c3660046111b8565b6103d7565b005b6101666101613660046111d3565b6104e9565b6040519015158152602001610135565b6002545b604051908152602001610135565b6101666101963660046111fd565b61050d565b60405160128152602001610135565b6101516101b8366004611268565b61053b565b6101666101cb3660046111b8565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff90811691161490565b60065461022a9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610135565b61017a61025d3660046111b8565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b6101516106cb565b7f000000000000000000000000000000000000000000000000000000000000000061022a565b60055473ffffffffffffffffffffffffffffffffffffffff1661022a565b6101286106df565b6101666102e73660046111d3565b6106ee565b61017a6102fa36600461135b565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b6101516103403660046111b8565b610706565b6060600380546103549061138e565b80601f01602080910402602001604051908101604052809291908181526020018280546103809061138e565b80156103cd5780601f106103a2576101008083540402835291602001916103cd565b820191906000526020600020905b8154815290600101906020018083116103b057829003601f168201915b5050505050905090565b6103df61076a565b73ffffffffffffffffffffffffffffffffffffffff8116158061041c575060065473ffffffffffffffffffffffffffffffffffffffff8281169116145b15610470576040517f228d68c000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024015b60405180910390fd5b600680547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83169081179091556040519081527f33209da902260b15af88d27b2383f608bb1ed36eeb4ddef27866de5eafe075229060200160405180910390a150565b6000806104f4610815565b9050610501818585610824565b60019150505b92915050565b600080610518610815565b9050610525858285610836565b610530858585610905565b506001949350505050565b6006546040517fffffffffffffffffffffffffffffffffffffffff000000000000000000000000606087811b82166020840152603483018790526054830186905230901b16607482015246608882015285918591859185916106049173ffffffffffffffffffffffffffffffffffffffff16906105fe9060a801604051602081830303815290604052805190602001207f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b836109b0565b61064257838383836040517fa8bfd48800000000000000000000000000000000000000000000000000000000815260040161046794939291906113e1565b600882901c600090815260076020526040902054600160ff84161b1615610698576040517f91cab50400000000000000000000000000000000000000000000000000000000815260048101839052602401610467565b600882901c60009081526007602052604090208054600160ff85161b1790556106c18888610a2c565b5050505050505050565b6106d361076a565b6106dd6000610a8c565b565b6060600480546103549061138e565b6000806106f9610815565b9050610501818585610905565b61070e61076a565b73ffffffffffffffffffffffffffffffffffffffff811661075e576040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260006004820152602401610467565b61076781610a8c565b50565b610772610815565b73ffffffffffffffffffffffffffffffffffffffff166107a760055473ffffffffffffffffffffffffffffffffffffffff1690565b73ffffffffffffffffffffffffffffffffffffffff16146106dd576107ca610815565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9091166004820152602401610467565b600061081f610b03565b905090565b6108318383836001610b80565b505050565b73ffffffffffffffffffffffffffffffffffffffff8381166000908152600160209081526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146108ff57818110156108f0576040517ffb8f41b200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff841660048201526024810182905260448101839052606401610467565b6108ff84848484036000610b80565b50505050565b73ffffffffffffffffffffffffffffffffffffffff8316610955576040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260006004820152602401610467565b73ffffffffffffffffffffffffffffffffffffffff82166109a5576040517fec442f0500000000000000000000000000000000000000000000000000000000815260006004820152602401610467565b610831838383610cc8565b60008060006109bf8585610e73565b50909250905060008160038111156109d9576109d961141c565b148015610a1157508573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b80610a225750610a22868686610ec0565b9695505050505050565b73ffffffffffffffffffffffffffffffffffffffff8216610a7c576040517fec442f0500000000000000000000000000000000000000000000000000000000815260006004820152602401610467565b610a8860008383610cc8565b5050565b6005805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1633148015610b4b575060143610155b15610b7b57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec36013560601c90565b503390565b73ffffffffffffffffffffffffffffffffffffffff8416610bd0576040517fe602df0500000000000000000000000000000000000000000000000000000000815260006004820152602401610467565b73ffffffffffffffffffffffffffffffffffffffff8316610c20576040517f94280d6200000000000000000000000000000000000000000000000000000000815260006004820152602401610467565b73ffffffffffffffffffffffffffffffffffffffff808516600090815260016020908152604080832093871683529290522082905580156108ff578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610cba91815260200190565b60405180910390a350505050565b73ffffffffffffffffffffffffffffffffffffffff8316610d00578060026000828254610cf5919061144b565b90915550610db29050565b73ffffffffffffffffffffffffffffffffffffffff831660009081526020819052604090205481811015610d86576040517fe450d38c00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff851660048201526024810182905260448101839052606401610467565b73ffffffffffffffffffffffffffffffffffffffff841660009081526020819052604090209082900390555b73ffffffffffffffffffffffffffffffffffffffff8216610ddb57600280548290039055610e07565b73ffffffffffffffffffffffffffffffffffffffff821660009081526020819052604090208054820190555b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e6691815260200190565b60405180910390a3505050565b60008060008351604103610ead5760208401516040850151606086015160001a610e9f8882858561100d565b955095509550505050610eb9565b50508151600091506002905b9250925092565b60008060008573ffffffffffffffffffffffffffffffffffffffff168585604051602401610eef929190611485565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f1626ba7e0000000000000000000000000000000000000000000000000000000017905251610f7091906114a6565b600060405180830381855afa9150503d8060008114610fab576040519150601f19603f3d011682016040523d82523d6000602084013e610fb0565b606091505b5091509150818015610fc457506020815110155b8015610a22575080517f1626ba7e000000000000000000000000000000000000000000000000000000009061100290830160209081019084016114c2565b149695505050505050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a084111561104857506000915060039050826110fd565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa15801561109c573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff81166110f3575060009250600191508290506110fd565b9250600091508190505b9450945094915050565b60005b8381101561112257818101518382015260200161110a565b50506000910152565b60008151808452611143816020860160208601611107565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000611188602083018461112b565b9392505050565b803573ffffffffffffffffffffffffffffffffffffffff811681146111b357600080fd5b919050565b6000602082840312156111ca57600080fd5b6111888261118f565b600080604083850312156111e657600080fd5b6111ef8361118f565b946020939093013593505050565b60008060006060848603121561121257600080fd5b61121b8461118f565b92506112296020850161118f565b9150604084013590509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000806000806080858703121561127e57600080fd5b6112878561118f565b93506020850135925060408501359150606085013567ffffffffffffffff808211156112b257600080fd5b818701915087601f8301126112c657600080fd5b8135818111156112d8576112d8611239565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f0116810190838211818310171561131e5761131e611239565b816040528281528a602084870101111561133757600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b6000806040838503121561136e57600080fd5b6113778361118f565b91506113856020840161118f565b90509250929050565b600181811c908216806113a257607f821691505b6020821081036113db577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b73ffffffffffffffffffffffffffffffffffffffff85168152836020820152826040820152608060608201526000610a22608083018461112b565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b80820180821115610507577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b82815260406020820152600061149e604083018461112b565b949350505050565b600082516114b8818460208701611107565b9190910192915050565b6000602082840312156114d457600080fd5b505191905056fea2646970667358221220da81db4519da8ecbd6a469565c244d80af902e8aa07dbee863ec6bc50f4feeba64736f6c63430008160033";
        public BlockRacersTokenDeploymentBase() : base(BYTECODE) { }
        public BlockRacersTokenDeploymentBase(string byteCode) : base(byteCode) { }
        [Parameter("address", "trustedForwarder", 1)]
        public virtual string TrustedForwarder { get; set; }
        [Parameter("address", "owner", 2)]
        public virtual string Owner { get; set; }
        [Parameter("address", "issuerAccount_", 3)]
        public virtual string Issueraccount { get; set; }
        [Parameter("uint256", "initialMint_", 4)]
        public virtual BigInteger Initialmint { get; set; }
    }

    public partial class AllowanceFunction : AllowanceFunctionBase { }

    [Function("allowance", "uint256")]
    public class AllowanceFunctionBase : FunctionMessage
    {
        [Parameter("address", "owner", 1)]
        public virtual string Owner { get; set; }
        [Parameter("address", "spender", 2)]
        public virtual string Spender { get; set; }
    }

    public partial class ApproveFunction : ApproveFunctionBase { }

    [Function("approve", "bool")]
    public class ApproveFunctionBase : FunctionMessage
    {
        [Parameter("address", "spender", 1)]
        public virtual string Spender { get; set; }
        [Parameter("uint256", "value", 2)]
        public virtual BigInteger Value { get; set; }
    }

    public partial class BalanceOfFunction : BalanceOfFunctionBase { }

    [Function("balanceOf", "uint256")]
    public class BalanceOfFunctionBase : FunctionMessage
    {
        [Parameter("address", "account", 1)]
        public virtual string Account { get; set; }
    }

    public partial class DecimalsFunction : DecimalsFunctionBase { }

    [Function("decimals", "uint8")]
    public class DecimalsFunctionBase : FunctionMessage
    {

    }

    public partial class IsTrustedForwarderFunction : IsTrustedForwarderFunctionBase { }

    [Function("isTrustedForwarder", "bool")]
    public class IsTrustedForwarderFunctionBase : FunctionMessage
    {
        [Parameter("address", "forwarder", 1)]
        public virtual string Forwarder { get; set; }
    }

    public partial class IssuerAccountFunction : IssuerAccountFunctionBase { }

    [Function("issuerAccount", "address")]
    public class IssuerAccountFunctionBase : FunctionMessage
    {

    }

    public partial class MintPermitFunction : MintPermitFunctionBase { }

    [Function("mintPermit")]
    public class MintPermitFunctionBase : FunctionMessage
    {
        [Parameter("address", "to", 1)]
        public virtual string To { get; set; }
        [Parameter("uint256", "amount", 2)]
        public virtual BigInteger Amount { get; set; }
        [Parameter("uint256", "nonce", 3)]
        public virtual BigInteger Nonce { get; set; }
        [Parameter("bytes", "permit", 4)]
        public virtual byte[] Permit { get; set; }
    }

    public partial class NameFunction : NameFunctionBase { }

    [Function("name", "string")]
    public class NameFunctionBase : FunctionMessage
    {

    }

    public partial class OwnerFunction : OwnerFunctionBase { }

    [Function("owner", "address")]
    public class OwnerFunctionBase : FunctionMessage
    {

    }

    public partial class RenounceOwnershipFunction : RenounceOwnershipFunctionBase { }

    [Function("renounceOwnership")]
    public class RenounceOwnershipFunctionBase : FunctionMessage
    {

    }

    public partial class SetNewIssuerAccountFunction : SetNewIssuerAccountFunctionBase { }

    [Function("setNewIssuerAccount")]
    public class SetNewIssuerAccountFunctionBase : FunctionMessage
    {
        [Parameter("address", "newIssuer", 1)]
        public virtual string NewIssuer { get; set; }
    }

    public partial class SymbolFunction : SymbolFunctionBase { }

    [Function("symbol", "string")]
    public class SymbolFunctionBase : FunctionMessage
    {

    }

    public partial class TotalSupplyFunction : TotalSupplyFunctionBase { }

    [Function("totalSupply", "uint256")]
    public class TotalSupplyFunctionBase : FunctionMessage
    {

    }

    public partial class TransferFunction : TransferFunctionBase { }

    [Function("transfer", "bool")]
    public class TransferFunctionBase : FunctionMessage
    {
        [Parameter("address", "to", 1)]
        public virtual string To { get; set; }
        [Parameter("uint256", "value", 2)]
        public virtual BigInteger Value { get; set; }
    }

    public partial class TransferFromFunction : TransferFromFunctionBase { }

    [Function("transferFrom", "bool")]
    public class TransferFromFunctionBase : FunctionMessage
    {
        [Parameter("address", "from", 1)]
        public virtual string From { get; set; }
        [Parameter("address", "to", 2)]
        public virtual string To { get; set; }
        [Parameter("uint256", "value", 3)]
        public virtual BigInteger Value { get; set; }
    }

    public partial class TransferOwnershipFunction : TransferOwnershipFunctionBase { }

    [Function("transferOwnership")]
    public class TransferOwnershipFunctionBase : FunctionMessage
    {
        [Parameter("address", "newOwner", 1)]
        public virtual string NewOwner { get; set; }
    }

    public partial class TrustedForwarderFunction : TrustedForwarderFunctionBase { }

    [Function("trustedForwarder", "address")]
    public class TrustedForwarderFunctionBase : FunctionMessage
    {

    }

    public partial class ApprovalEventDTO : ApprovalEventDTOBase { }

    [Event("Approval")]
    public class ApprovalEventDTOBase : IEventDTO
    {
        [Parameter("address", "owner", 1, true )]
        public virtual string Owner { get; set; }
        [Parameter("address", "spender", 2, true )]
        public virtual string Spender { get; set; }
        [Parameter("uint256", "value", 3, false )]
        public virtual BigInteger Value { get; set; }
    }

    public partial class NewIssuerEventDTO : NewIssuerEventDTOBase { }

    [Event("NewIssuer")]
    public class NewIssuerEventDTOBase : IEventDTO
    {
        [Parameter("address", "newIssuer", 1, false )]
        public virtual string NewIssuer { get; set; }
    }

    public partial class OwnershipTransferredEventDTO : OwnershipTransferredEventDTOBase { }

    [Event("OwnershipTransferred")]
    public class OwnershipTransferredEventDTOBase : IEventDTO
    {
        [Parameter("address", "previousOwner", 1, true )]
        public virtual string PreviousOwner { get; set; }
        [Parameter("address", "newOwner", 2, true )]
        public virtual string NewOwner { get; set; }
    }

    public partial class TransferEventDTO : TransferEventDTOBase { }

    [Event("Transfer")]
    public class TransferEventDTOBase : IEventDTO
    {
        [Parameter("address", "from", 1, true )]
        public virtual string From { get; set; }
        [Parameter("address", "to", 2, true )]
        public virtual string To { get; set; }
        [Parameter("uint256", "value", 3, false )]
        public virtual BigInteger Value { get; set; }
    }

    public partial class ERC20InsufficientAllowanceError : ERC20InsufficientAllowanceErrorBase { }

    [Error("ERC20InsufficientAllowance")]
    public class ERC20InsufficientAllowanceErrorBase : IErrorDTO
    {
        [Parameter("address", "spender", 1)]
        public virtual string Spender { get; set; }
        [Parameter("uint256", "allowance", 2)]
        public virtual BigInteger Allowance { get; set; }
        [Parameter("uint256", "needed", 3)]
        public virtual BigInteger Needed { get; set; }
    }

    public partial class ERC20InsufficientBalanceError : ERC20InsufficientBalanceErrorBase { }

    [Error("ERC20InsufficientBalance")]
    public class ERC20InsufficientBalanceErrorBase : IErrorDTO
    {
        [Parameter("address", "sender", 1)]
        public virtual string Sender { get; set; }
        [Parameter("uint256", "balance", 2)]
        public virtual BigInteger Balance { get; set; }
        [Parameter("uint256", "needed", 3)]
        public virtual BigInteger Needed { get; set; }
    }

    public partial class ERC20InvalidApproverError : ERC20InvalidApproverErrorBase { }

    [Error("ERC20InvalidApprover")]
    public class ERC20InvalidApproverErrorBase : IErrorDTO
    {
        [Parameter("address", "approver", 1)]
        public virtual string Approver { get; set; }
    }

    public partial class ERC20InvalidReceiverError : ERC20InvalidReceiverErrorBase { }

    [Error("ERC20InvalidReceiver")]
    public class ERC20InvalidReceiverErrorBase : IErrorDTO
    {
        [Parameter("address", "receiver", 1)]
        public virtual string Receiver { get; set; }
    }

    public partial class ERC20InvalidSenderError : ERC20InvalidSenderErrorBase { }

    [Error("ERC20InvalidSender")]
    public class ERC20InvalidSenderErrorBase : IErrorDTO
    {
        [Parameter("address", "sender", 1)]
        public virtual string Sender { get; set; }
    }

    public partial class ERC20InvalidSpenderError : ERC20InvalidSpenderErrorBase { }

    [Error("ERC20InvalidSpender")]
    public class ERC20InvalidSpenderErrorBase : IErrorDTO
    {
        [Parameter("address", "spender", 1)]
        public virtual string Spender { get; set; }
    }

    public partial class InvalidIssuerError : InvalidIssuerErrorBase { }

    [Error("InvalidIssuer")]
    public class InvalidIssuerErrorBase : IErrorDTO
    {
        [Parameter("address", "proposedIssuer", 1)]
        public virtual string ProposedIssuer { get; set; }
    }

    public partial class NonceAlreadyUsedError : NonceAlreadyUsedErrorBase { }

    [Error("NonceAlreadyUsed")]
    public class NonceAlreadyUsedErrorBase : IErrorDTO
    {
        [Parameter("uint256", "nonce", 1)]
        public virtual BigInteger Nonce { get; set; }
    }

    public partial class OwnableInvalidOwnerError : OwnableInvalidOwnerErrorBase { }

    [Error("OwnableInvalidOwner")]
    public class OwnableInvalidOwnerErrorBase : IErrorDTO
    {
        [Parameter("address", "owner", 1)]
        public virtual string Owner { get; set; }
    }

    public partial class OwnableUnauthorizedAccountError : OwnableUnauthorizedAccountErrorBase { }

    [Error("OwnableUnauthorizedAccount")]
    public class OwnableUnauthorizedAccountErrorBase : IErrorDTO
    {
        [Parameter("address", "account", 1)]
        public virtual string Account { get; set; }
    }

    public partial class PermitInvalidError : PermitInvalidErrorBase { }

    [Error("PermitInvalid")]
    public class PermitInvalidErrorBase : IErrorDTO
    {
        [Parameter("address", "player", 1)]
        public virtual string Player { get; set; }
        [Parameter("uint256", "amount", 2)]
        public virtual BigInteger Amount { get; set; }
        [Parameter("uint256", "nonce", 3)]
        public virtual BigInteger Nonce { get; set; }
        [Parameter("bytes", "permit", 4)]
        public virtual byte[] Permit { get; set; }
    }

    public partial class AllowanceOutputDTO : AllowanceOutputDTOBase { }

    [FunctionOutput]
    public class AllowanceOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("uint256", "", 1)]
        public virtual BigInteger ReturnValue1 { get; set; }
    }



    public partial class BalanceOfOutputDTO : BalanceOfOutputDTOBase { }

    [FunctionOutput]
    public class BalanceOfOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("uint256", "", 1)]
        public virtual BigInteger ReturnValue1 { get; set; }
    }

    public partial class DecimalsOutputDTO : DecimalsOutputDTOBase { }

    [FunctionOutput]
    public class DecimalsOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("uint8", "", 1)]
        public virtual byte ReturnValue1 { get; set; }
    }

    public partial class IsTrustedForwarderOutputDTO : IsTrustedForwarderOutputDTOBase { }

    [FunctionOutput]
    public class IsTrustedForwarderOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("bool", "", 1)]
        public virtual bool ReturnValue1 { get; set; }
    }

    public partial class IssuerAccountOutputDTO : IssuerAccountOutputDTOBase { }

    [FunctionOutput]
    public class IssuerAccountOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("address", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }



    public partial class NameOutputDTO : NameOutputDTOBase { }

    [FunctionOutput]
    public class NameOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("string", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }

    public partial class OwnerOutputDTO : OwnerOutputDTOBase { }

    [FunctionOutput]
    public class OwnerOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("address", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }





    public partial class SymbolOutputDTO : SymbolOutputDTOBase { }

    [FunctionOutput]
    public class SymbolOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("string", "", 1)]
        public virtual string ReturnValue1 { get; set; }
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
}
