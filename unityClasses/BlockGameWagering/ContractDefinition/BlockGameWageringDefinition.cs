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

namespace BlockGameWagering.BlockGameWagering.ContractDefinition
{


    public partial class BlockGameWageringDeployment : BlockGameWageringDeploymentBase
    {
        public BlockGameWageringDeployment() : base(BYTECODE) { }
        public BlockGameWageringDeployment(string byteCode) : base(byteCode) { }
    }

    public class BlockGameWageringDeploymentBase : ContractDeploymentMessage
    {
        public static string BYTECODE = "0x60c06040523480156200001157600080fd5b50604051620020e2380380620020e2833981016040819052620000349162000112565b6001600160a01b0380851660805283908590829081166200006f57604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b6200007a81620000a9565b5050506001600160a01b0391821660a052600280546001600160a01b03191691909216179055506200017a9050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146200010f57600080fd5b50565b600080600080608085870312156200012957600080fd5b84516200013681620000f9565b60208601519094506200014981620000f9565b60408601519093506200015c81620000f9565b60608601519092506200016f81620000f9565b939692955090935050565b60805160a051611f11620001d1600039600081816102a10152818161047c015281816104bd01528181610c9701528181610cf60152610ea5015260008181610158015281816101b401526114160152611f116000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80637e9a868511610097578063e297276711610066578063e2972767146102f4578063e47d606014610307578063f2fde38b14610340578063fd922a421461035357600080fd5b80637e9a8685146101f957806382bfefc81461029c5780638da5cb5b146102c3578063c8912030146102e157600080fd5b80634a49ac4c116100d35780634a49ac4c14610135578063572b6c0514610148578063715018a6146101aa5780637da0a877146101b257600080fd5b80633cdbff78146100fa578063417c73a71461010f57806347b64eb014610122575b600080fd5b61010d610108366004611c93565b610373565b005b61010d61011d366004611d0f565b610554565b61010d610130366004611d0f565b610653565b61010d610143366004611d0f565b6106c7565b610195610156366004611d0f565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff90811691161490565b60405190151581526020015b60405180910390f35b61010d6107ba565b7f00000000000000000000000000000000000000000000000000000000000000005b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101a1565b610270610207366004611d0f565b73ffffffffffffffffffffffffffffffffffffffff908116600090815260046020908152604091829020825180840190935254928316808352740100000000000000000000000000000000000000009093046bffffffffffffffffffffffff1691018190529091565b6040805173ffffffffffffffffffffffffffffffffffffffff90931683526020830191909152016101a1565b6101d47f000000000000000000000000000000000000000000000000000000000000000081565b60005473ffffffffffffffffffffffffffffffffffffffff166101d4565b61010d6102ef366004611d2a565b6107ce565b61010d610302366004611c93565b610d90565b610195610315366004611d0f565b73ffffffffffffffffffffffffffffffffffffffff1660009081526001602052604090205460ff1690565b61010d61034e366004611d0f565b610f2b565b6002546101d49073ffffffffffffffffffffffffffffffffffffffff1681565b600061037d610f8f565b73ffffffffffffffffffffffffffffffffffffffff8181166000908152600460209081526040808320815180830190925254938416808252740100000000000000000000000000000000000000009094046bffffffffffffffffffffffff169101819052929350909190819003610420576040517f2f763a0100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8084166000908152600460205260408082208290559184168152908120556104628383838a8a8a8a610f9e565b6104a373ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168483610fb8565b6104e473ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168383610fb8565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f6b587b73880f755d2ca69bcbe5efba3528e02f0957cdc7c3798abb4477004e458360405161054391815260200190565b60405180910390a350505050505050565b61055c61103e565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff16156105d9576040517fd40e1aa500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024015b60405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8116600081815260016020819052604080832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016909217909155517ff9b68063b051b82957fa193585681240904fed808db8b30fc5a2d2202c6ed6279190a250565b61065b61103e565b600280547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83161790556040517f650c04e9ee1038fa031eacaf24eb0d295aa3da070d1293eb46e44790ccbd5be490600090a150565b6106cf61103e565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff16610746576040517fe0b7a22800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024016105d0565b73ffffffffffffffffffffffffffffffffffffffff811660008181526001602052604080822080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169055517fc121445dfc18619b882df11e54d4b1d2ac7391ea87c32aaa4d43d9b738a4a2279190a250565b6107c261103e565b6107cc60006110e9565b565b6107d6610f8f565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff161561084e576040517f571f7b4900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024016105d0565b73ffffffffffffffffffffffffffffffffffffffff8716600090815260016020526040902054879060ff16156108c8576040517f571f7b4900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024016105d0565b60006108d2610f8f565b90508073ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff1603610939576040517fab02711d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b87158061095157506bffffffffffffffffffffffff88115b15610988576040517f5f12e2ee00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff89166000908152600460205260409020547401000000000000000000000000000000000000000090046bffffffffffffffffffffffff1615610a0b576040517f5d604c2000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff81166000908152600460205260409020547401000000000000000000000000000000000000000090046bffffffffffffffffffffffff1615610a8e576040517f5d604c2000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610a9d818a8a8a8a8a8a61115e565b60405180604001604052808273ffffffffffffffffffffffffffffffffffffffff168152602001896bffffffffffffffffffffffff16815250600460008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a8154816bffffffffffffffffffffffff02191690836bffffffffffffffffffffffff16021790555090505060405180604001604052808a73ffffffffffffffffffffffffffffffffffffffff168152602001896bffffffffffffffffffffffff16815250600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a8154816bffffffffffffffffffffffff02191690836bffffffffffffffffffffffff160217905550905050610cdc81308a7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166113b5909392919063ffffffff16565b610d1e73ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168a308b6113b5565b8873ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f995cddd78b07841a479d0c9f9b0d99956e57774af700c2869f5e1185e7fdc1c88a604051610d7d91815260200190565b60405180910390a3505050505050505050565b6000610d9a610f8f565b73ffffffffffffffffffffffffffffffffffffffff8181166000908152600460209081526040808320815180830190925254938416808252740100000000000000000000000000000000000000009094046bffffffffffffffffffffffff169101819052929350909190819003610e3d576040517f2f763a0100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff808416600090815260046020526040808220829055918416815290812055610e7f8383838a8a8a8a611401565b610ecc83610e8e836002611d9b565b73ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169190610fb8565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f1b49a4aed790d292c789d3767d6ba8b85b5d5922228626cf558d9127a368e19c8360405161054391815260200190565b610f3361103e565b73ffffffffffffffffffffffffffffffffffffffff8116610f83576040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600060048201526024016105d0565b610f8c816110e9565b50565b6000610f99611412565b905090565b610faf60008888888888888861148f565b50505050505050565b60405173ffffffffffffffffffffffffffffffffffffffff83811660248301526044820183905261103991859182169063a9059cbb906064015b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506116e5565b505050565b611046610f8f565b73ffffffffffffffffffffffffffffffffffffffff1661107b60005473ffffffffffffffffffffffffffffffffffffffff1690565b73ffffffffffffffffffffffffffffffffffffffff16146107cc5761109e610f8f565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911660048201526024016105d0565b6000805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040517fffffffffffffffffffffffffffffffffffffffff000000000000000000000000606089811b8216602084015260348301889052605483018790526074830186905230901b1660948201524660a88201526112459087906112099060c8015b604051602081830303815290604052805190602001207f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b84848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061177b92505050565b6112b0576040517f5996d68a00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff80891660048301528716602482015260448101869052606481018590526084810184905260a4016105d0565b73ffffffffffffffffffffffffffffffffffffffff861660009081526003602052604090206112df90856117f9565b15611335576040517fe90aded400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff87166004820152602481018590526044016105d0565b73ffffffffffffffffffffffffffffffffffffffff86166000908152600360209081526040808320600888901c845290915290208054600160ff87161b17905561137e83421190565b15610faf576040517f3ba234a300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405173ffffffffffffffffffffffffffffffffffffffff84811660248301528381166044830152606482018390526113fb9186918216906323b872dd90608401610ff2565b50505050565b610faf60018888888888888861148f565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163314801561145a575060143610155b1561148a57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec36013560601c90565b503390565b60025460405189151560f81b60208201527fffffffffffffffffffffffffffffffffffffffff00000000000000000000000060608a811b8216602184015289811b8216603584015260498301899052606983018890526089830187905230901b1660a98201524660bd82015273ffffffffffffffffffffffffffffffffffffffff909116906115629082906115269060dd016111c0565b85858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061177b92505050565b6115d5576040517f15d93b1f000000000000000000000000000000000000000000000000000000008152891515600482015273ffffffffffffffffffffffffffffffffffffffff808a16602483015288166044820152606481018790526084810186905260a4810185905260c4016105d0565b73ffffffffffffffffffffffffffffffffffffffff8116600090815260036020526040902061160490866117f9565b1561165a576040517fe90aded400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff82166004820152602481018690526044016105d0565b73ffffffffffffffffffffffffffffffffffffffff81166000908152600360209081526040808320600889901c845290915290208054600160ff88161b1790556116a384421190565b156116da576040517f3ba234a300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505050505050505050565b600061170773ffffffffffffffffffffffffffffffffffffffff84168361181e565b9050805160001415801561172c57508080602001905181019061172a9190611dd9565b155b15611039576040517f5274afe700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff841660048201526024016105d0565b600080600061178a858561182c565b50909250905060008160038111156117a4576117a4611dfb565b1480156117dc57508573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b806117ed57506117ed868686611879565b925050505b9392505050565b600881901c600090815260208390526040902054600160ff83161b1615155b92915050565b60606117f2838360006119c6565b600080600083516041036118665760208401516040850151606086015160001a61185888828585611a7f565b955095509550505050611872565b50508151600091506002905b9250925092565b60008060008573ffffffffffffffffffffffffffffffffffffffff1685856040516024016118a8929190611e4e565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f1626ba7e00000000000000000000000000000000000000000000000000000000179052516119299190611ea6565b600060405180830381855afa9150503d8060008114611964576040519150601f19603f3d011682016040523d82523d6000602084013e611969565b606091505b509150915081801561197d57506020815110155b80156117ed575080517f1626ba7e00000000000000000000000000000000000000000000000000000000906119bb9083016020908101908401611ec2565b149695505050505050565b606081471015611a04576040517fcd7860590000000000000000000000000000000000000000000000000000000081523060048201526024016105d0565b6000808573ffffffffffffffffffffffffffffffffffffffff168486604051611a2d9190611ea6565b60006040518083038185875af1925050503d8060008114611a6a576040519150601f19603f3d011682016040523d82523d6000602084013e611a6f565b606091505b50915091506117ed868383611b79565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115611aba5750600091506003905082611b6f565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015611b0e573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff8116611b6557506000925060019150829050611b6f565b9250600091508190505b9450945094915050565b606082611b8e57611b8982611c08565b6117f2565b8151158015611bb2575073ffffffffffffffffffffffffffffffffffffffff84163b155b15611c01576040517f9996b31500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff851660048201526024016105d0565b50806117f2565b805115611c185780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008083601f840112611c5c57600080fd5b50813567ffffffffffffffff811115611c7457600080fd5b602083019150836020828501011115611c8c57600080fd5b9250929050565b60008060008060608587031215611ca957600080fd5b8435935060208501359250604085013567ffffffffffffffff811115611cce57600080fd5b611cda87828801611c4a565b95989497509550505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114611d0a57600080fd5b919050565b600060208284031215611d2157600080fd5b6117f282611ce6565b60008060008060008060a08789031215611d4357600080fd5b611d4c87611ce6565b9550602087013594506040870135935060608701359250608087013567ffffffffffffffff811115611d7d57600080fd5b611d8989828a01611c4a565b979a9699509497509295939492505050565b8082028115828204841417611818577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600060208284031215611deb57600080fd5b815180151581146117f257600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60005b83811015611e45578181015183820152602001611e2d565b50506000910152565b8281526040602082015260008251806040840152611e73816060850160208701611e2a565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016060019392505050565b60008251611eb8818460208701611e2a565b9190910192915050565b600060208284031215611ed457600080fd5b505191905056fea26469706673582212206a099daebf3f6dec78f7bb99a2c295dc1860b0b1d95309eeb2ba2345a1f7416864736f6c63430008160033";
        public BlockGameWageringDeploymentBase() : base(BYTECODE) { }
        public BlockGameWageringDeploymentBase(string byteCode) : base(byteCode) { }
        [Parameter("address", "trustedForwarder", 1)]
        public virtual string TrustedForwarder { get; set; }
        [Parameter("address", "admin", 2)]
        public virtual string Admin { get; set; }
        [Parameter("address", "token", 3)]
        public virtual string Token { get; set; }
        [Parameter("address", "server_", 4)]
        public virtual string Server { get; set; }
    }

    public partial class TokenFunction : TokenFunctionBase { }

    [Function("TOKEN", "address")]
    public class TokenFunctionBase : FunctionMessage
    {

    }

    public partial class AddToBlackListFunction : AddToBlackListFunctionBase { }

    [Function("addToBlackList")]
    public class AddToBlackListFunctionBase : FunctionMessage
    {
        [Parameter("address", "account", 1)]
        public virtual string Account { get; set; }
    }

    public partial class CancelWagerFunction : CancelWagerFunctionBase { }

    [Function("cancelWager")]
    public class CancelWagerFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "nonce", 1)]
        public virtual BigInteger Nonce { get; set; }
        [Parameter("uint256", "deadline", 2)]
        public virtual BigInteger Deadline { get; set; }
        [Parameter("bytes", "serverSig", 3)]
        public virtual byte[] ServerSig { get; set; }
    }

    public partial class CompleteWagerFunction : CompleteWagerFunctionBase { }

    [Function("completeWager")]
    public class CompleteWagerFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "nonce", 1)]
        public virtual BigInteger Nonce { get; set; }
        [Parameter("uint256", "deadline", 2)]
        public virtual BigInteger Deadline { get; set; }
        [Parameter("bytes", "serverSig", 3)]
        public virtual byte[] ServerSig { get; set; }
    }

    public partial class GetWagerFunction : GetWagerFunctionBase { }

    [Function("getWager", typeof(GetWagerOutputDTO))]
    public class GetWagerFunctionBase : FunctionMessage
    {
        [Parameter("address", "player", 1)]
        public virtual string Player { get; set; }
    }

    public partial class IsBlackListedFunction : IsBlackListedFunctionBase { }

    [Function("isBlackListed", "bool")]
    public class IsBlackListedFunctionBase : FunctionMessage
    {
        [Parameter("address", "account", 1)]
        public virtual string Account { get; set; }
    }

    public partial class IsTrustedForwarderFunction : IsTrustedForwarderFunctionBase { }

    [Function("isTrustedForwarder", "bool")]
    public class IsTrustedForwarderFunctionBase : FunctionMessage
    {
        [Parameter("address", "forwarder", 1)]
        public virtual string Forwarder { get; set; }
    }

    public partial class OwnerFunction : OwnerFunctionBase { }

    [Function("owner", "address")]
    public class OwnerFunctionBase : FunctionMessage
    {

    }

    public partial class RemoveFromBlackListFunction : RemoveFromBlackListFunctionBase { }

    [Function("removeFromBlackList")]
    public class RemoveFromBlackListFunctionBase : FunctionMessage
    {
        [Parameter("address", "account", 1)]
        public virtual string Account { get; set; }
    }

    public partial class RenounceOwnershipFunction : RenounceOwnershipFunctionBase { }

    [Function("renounceOwnership")]
    public class RenounceOwnershipFunctionBase : FunctionMessage
    {

    }

    public partial class ServerFunction : ServerFunctionBase { }

    [Function("server", "address")]
    public class ServerFunctionBase : FunctionMessage
    {

    }

    public partial class SetServerAddressFunction : SetServerAddressFunctionBase { }

    [Function("setServerAddress")]
    public class SetServerAddressFunctionBase : FunctionMessage
    {
        [Parameter("address", "newServer", 1)]
        public virtual string NewServer { get; set; }
    }

    public partial class StartWagerFunction : StartWagerFunctionBase { }

    [Function("startWager")]
    public class StartWagerFunctionBase : FunctionMessage
    {
        [Parameter("address", "opponent", 1)]
        public virtual string Opponent { get; set; }
        [Parameter("uint256", "prize", 2)]
        public virtual BigInteger Prize { get; set; }
        [Parameter("uint256", "nonce", 3)]
        public virtual BigInteger Nonce { get; set; }
        [Parameter("uint256", "deadline", 4)]
        public virtual BigInteger Deadline { get; set; }
        [Parameter("bytes", "opponentSig", 5)]
        public virtual byte[] OpponentSig { get; set; }
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

    public partial class AddedToBlacklistEventDTO : AddedToBlacklistEventDTOBase { }

    [Event("AddedToBlacklist")]
    public class AddedToBlacklistEventDTOBase : IEventDTO
    {
        [Parameter("address", "wallet", 1, true )]
        public virtual string Wallet { get; set; }
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

    public partial class RemovedFromBlacklistedEventDTO : RemovedFromBlacklistedEventDTOBase { }

    [Event("RemovedFromBlacklisted")]
    public class RemovedFromBlacklistedEventDTOBase : IEventDTO
    {
        [Parameter("address", "wallet", 1, true )]
        public virtual string Wallet { get; set; }
    }



    public partial class WagerCancelledEventDTO : WagerCancelledEventDTOBase { }

    [Event("WagerCancelled")]
    public class WagerCancelledEventDTOBase : IEventDTO
    {
        [Parameter("address", "creator", 1, true )]
        public virtual string Creator { get; set; }
        [Parameter("address", "opponent", 2, true )]
        public virtual string Opponent { get; set; }
        [Parameter("uint256", "prize", 3, false )]
        public virtual BigInteger Prize { get; set; }
    }

    public partial class WagerCompletedEventDTO : WagerCompletedEventDTOBase { }

    [Event("WagerCompleted")]
    public class WagerCompletedEventDTOBase : IEventDTO
    {
        [Parameter("address", "creator", 1, true )]
        public virtual string Creator { get; set; }
        [Parameter("address", "opponent", 2, true )]
        public virtual string Opponent { get; set; }
        [Parameter("uint256", "prize", 3, false )]
        public virtual BigInteger Prize { get; set; }
    }

    public partial class WagerCreatedEventDTO : WagerCreatedEventDTOBase { }

    [Event("WagerCreated")]
    public class WagerCreatedEventDTOBase : IEventDTO
    {
        [Parameter("address", "creator", 1, true )]
        public virtual string Creator { get; set; }
        [Parameter("address", "opponent", 2, true )]
        public virtual string Opponent { get; set; }
        [Parameter("uint256", "prize", 3, false )]
        public virtual BigInteger Prize { get; set; }
    }

    public partial class AccountAlreadyBlacklistedError : AccountAlreadyBlacklistedErrorBase { }

    [Error("AccountAlreadyBlacklisted")]
    public class AccountAlreadyBlacklistedErrorBase : IErrorDTO
    {
        [Parameter("address", "wallet", 1)]
        public virtual string Wallet { get; set; }
    }

    public partial class AccountBlacklistedError : AccountBlacklistedErrorBase { }

    [Error("AccountBlacklisted")]
    public class AccountBlacklistedErrorBase : IErrorDTO
    {
        [Parameter("address", "wallet", 1)]
        public virtual string Wallet { get; set; }
    }

    public partial class AccountNotBlacklistedError : AccountNotBlacklistedErrorBase { }

    [Error("AccountNotBlacklisted")]
    public class AccountNotBlacklistedErrorBase : IErrorDTO
    {
        [Parameter("address", "wallet", 1)]
        public virtual string Wallet { get; set; }
    }

    public partial class AddressEmptyCodeError : AddressEmptyCodeErrorBase { }

    [Error("AddressEmptyCode")]
    public class AddressEmptyCodeErrorBase : IErrorDTO
    {
        [Parameter("address", "target", 1)]
        public virtual string Target { get; set; }
    }

    public partial class AddressInsufficientBalanceError : AddressInsufficientBalanceErrorBase { }

    [Error("AddressInsufficientBalance")]
    public class AddressInsufficientBalanceErrorBase : IErrorDTO
    {
        [Parameter("address", "account", 1)]
        public virtual string Account { get; set; }
    }

    public partial class FailedInnerCallError : FailedInnerCallErrorBase { }
    [Error("FailedInnerCall")]
    public class FailedInnerCallErrorBase : IErrorDTO
    {
    }

    public partial class InvalidOpponentError : InvalidOpponentErrorBase { }
    [Error("InvalidOpponent")]
    public class InvalidOpponentErrorBase : IErrorDTO
    {
    }

    public partial class InvalidOpponentSigError : InvalidOpponentSigErrorBase { }

    [Error("InvalidOpponentSig")]
    public class InvalidOpponentSigErrorBase : IErrorDTO
    {
        [Parameter("address", "sender", 1)]
        public virtual string Sender { get; set; }
        [Parameter("address", "opponent", 2)]
        public virtual string Opponent { get; set; }
        [Parameter("uint256", "prize", 3)]
        public virtual BigInteger Prize { get; set; }
        [Parameter("uint256", "nonce", 4)]
        public virtual BigInteger Nonce { get; set; }
        [Parameter("uint256", "deadline", 5)]
        public virtual BigInteger Deadline { get; set; }
    }

    public partial class InvalidPrizeError : InvalidPrizeErrorBase { }
    [Error("InvalidPrize")]
    public class InvalidPrizeErrorBase : IErrorDTO
    {
    }

    public partial class InvalidServerSigError : InvalidServerSigErrorBase { }

    [Error("InvalidServerSig")]
    public class InvalidServerSigErrorBase : IErrorDTO
    {
        [Parameter("bool", "isWin", 1)]
        public virtual bool IsWin { get; set; }
        [Parameter("address", "winner", 2)]
        public virtual string Winner { get; set; }
        [Parameter("address", "loser", 3)]
        public virtual string Loser { get; set; }
        [Parameter("uint256", "prize", 4)]
        public virtual BigInteger Prize { get; set; }
        [Parameter("uint256", "nonce", 5)]
        public virtual BigInteger Nonce { get; set; }
        [Parameter("uint256", "deadline", 6)]
        public virtual BigInteger Deadline { get; set; }
    }

    public partial class InvalidWagerError : InvalidWagerErrorBase { }
    [Error("InvalidWager")]
    public class InvalidWagerErrorBase : IErrorDTO
    {
    }

    public partial class NonceAlreadyUsedError : NonceAlreadyUsedErrorBase { }

    [Error("NonceAlreadyUsed")]
    public class NonceAlreadyUsedErrorBase : IErrorDTO
    {
        [Parameter("address", "signer", 1)]
        public virtual string Signer { get; set; }
        [Parameter("uint256", "nonce", 2)]
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

    public partial class SafeERC20FailedOperationError : SafeERC20FailedOperationErrorBase { }

    [Error("SafeERC20FailedOperation")]
    public class SafeERC20FailedOperationErrorBase : IErrorDTO
    {
        [Parameter("address", "token", 1)]
        public virtual string Token { get; set; }
    }

    public partial class SigExpiredError : SigExpiredErrorBase { }
    [Error("SigExpired")]
    public class SigExpiredErrorBase : IErrorDTO
    {
    }

    public partial class WagerInProgressError : WagerInProgressErrorBase { }
    [Error("WagerInProgress")]
    public class WagerInProgressErrorBase : IErrorDTO
    {
    }

    public partial class TokenOutputDTO : TokenOutputDTOBase { }

    [FunctionOutput]
    public class TokenOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("address", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }







    public partial class GetWagerOutputDTO : GetWagerOutputDTOBase { }

    [FunctionOutput]
    public class GetWagerOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("address", "opponent", 1)]
        public virtual string Opponent { get; set; }
        [Parameter("uint256", "prize", 2)]
        public virtual BigInteger Prize { get; set; }
    }

    public partial class IsBlackListedOutputDTO : IsBlackListedOutputDTOBase { }

    [FunctionOutput]
    public class IsBlackListedOutputDTOBase : IFunctionOutputDTO 
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

    public partial class OwnerOutputDTO : OwnerOutputDTOBase { }

    [FunctionOutput]
    public class OwnerOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("address", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }





    public partial class ServerOutputDTO : ServerOutputDTOBase { }

    [FunctionOutput]
    public class ServerOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("address", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }







    public partial class TrustedForwarderOutputDTO : TrustedForwarderOutputDTOBase { }

    [FunctionOutput]
    public class TrustedForwarderOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("address", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }
}
