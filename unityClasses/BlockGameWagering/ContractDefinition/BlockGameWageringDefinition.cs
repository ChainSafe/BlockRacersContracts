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
        public static string BYTECODE = "0x60c06040523480156200001157600080fd5b506040516200209138038062002091833981016040819052620000349162000112565b6001600160a01b0380851660805283908590829081166200006f57604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b6200007a81620000a9565b5050506001600160a01b0391821660a052600280546001600160a01b03191691909216179055506200017a9050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146200010f57600080fd5b50565b600080600080608085870312156200012957600080fd5b84516200013681620000f9565b60208601519094506200014981620000f9565b60408601519093506200015c81620000f9565b60608601519092506200016f81620000f9565b939692955090935050565b60805160a051611ec0620001d16000396000818161023d015281816103c10152818161040201528181610c9d01528181610cfc0152610e54015260008181610158015281816101b401526113c50152611ec06000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80637e9a868511610097578063e297276711610066578063e297276714610290578063e47d6060146102a3578063f2fde38b146102dc578063fd922a42146102ef57600080fd5b80637e9a8685146101f957806382bfefc8146102385780638da5cb5b1461025f578063c89120301461027d57600080fd5b80634a49ac4c116100d35780634a49ac4c14610135578063572b6c0514610148578063715018a6146101aa5780637da0a877146101b257600080fd5b80633cdbff78146100fa578063417c73a71461010f57806347b64eb014610122575b600080fd5b61010d610108366004611c42565b61030f565b005b61010d61011d366004611cbe565b610499565b61010d610130366004611cbe565b610598565b61010d610143366004611cbe565b61060c565b610195610156366004611cbe565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff90811691161490565b60405190151581526020015b60405180910390f35b61010d6106ff565b7f00000000000000000000000000000000000000000000000000000000000000005b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101a1565b61020c610207366004611cbe565b610713565b6040805173ffffffffffffffffffffffffffffffffffffffff90931683526020830191909152016101a1565b6101d47f000000000000000000000000000000000000000000000000000000000000000081565b60005473ffffffffffffffffffffffffffffffffffffffff166101d4565b61010d61028b366004611cd9565b6107d4565b61010d61029e366004611c42565b610d96565b6101956102b1366004611cbe565b73ffffffffffffffffffffffffffffffffffffffff1660009081526001602052604090205460ff1690565b61010d6102ea366004611cbe565b610eda565b6002546101d49073ffffffffffffffffffffffffffffffffffffffff1681565b6000610319610f3e565b905060008061032783610713565b9150915080600003610365576040517f2f763a0100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8084166000908152600460205260408082208290559184168152908120556103a78383838a8a8a8a610f4d565b6103e873ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168483610f67565b61042973ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168383610f67565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f6b587b73880f755d2ca69bcbe5efba3528e02f0957cdc7c3798abb4477004e458360405161048891815260200190565b60405180910390a350505050505050565b6104a1610fed565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff161561051e576040517fd40e1aa500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024015b60405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8116600081815260016020819052604080832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016909217909155517ff9b68063b051b82957fa193585681240904fed808db8b30fc5a2d2202c6ed6279190a250565b6105a0610fed565b600280547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83161790556040517f650c04e9ee1038fa031eacaf24eb0d295aa3da070d1293eb46e44790ccbd5be490600090a150565b610614610fed565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff1661068b576040517fe0b7a22800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff82166004820152602401610515565b73ffffffffffffffffffffffffffffffffffffffff811660008181526001602052604080822080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169055517fc121445dfc18619b882df11e54d4b1d2ac7391ea87c32aaa4d43d9b738a4a2279190a250565b610707610fed565b6107116000611098565b565b73ffffffffffffffffffffffffffffffffffffffff81811660009081526004602090815260408083208151808301909252549384168152740100000000000000000000000000000000000000009093046bffffffffffffffffffffffff169083018190529091829182036107b3576040517f2f763a0100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b805160209091015190946bffffffffffffffffffffffff9091169350915050565b6107dc610f3e565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff1615610854576040517f571f7b4900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff82166004820152602401610515565b73ffffffffffffffffffffffffffffffffffffffff8716600090815260016020526040902054879060ff16156108ce576040517f571f7b4900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff82166004820152602401610515565b60006108d8610f3e565b90508073ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff160361093f576040517fab02711d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b87158061095757506bffffffffffffffffffffffff88115b1561098e576040517f5f12e2ee00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff89166000908152600460205260409020547401000000000000000000000000000000000000000090046bffffffffffffffffffffffff1615610a11576040517f5d604c2000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff81166000908152600460205260409020547401000000000000000000000000000000000000000090046bffffffffffffffffffffffff1615610a94576040517f5d604c2000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610aa3818a8a8a8a8a8a61110d565b60405180604001604052808273ffffffffffffffffffffffffffffffffffffffff168152602001896bffffffffffffffffffffffff16815250600460008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a8154816bffffffffffffffffffffffff02191690836bffffffffffffffffffffffff16021790555090505060405180604001604052808a73ffffffffffffffffffffffffffffffffffffffff168152602001896bffffffffffffffffffffffff16815250600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a8154816bffffffffffffffffffffffff02191690836bffffffffffffffffffffffff160217905550905050610ce281308a7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16611364909392919063ffffffff16565b610d2473ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168a308b611364565b8873ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f995cddd78b07841a479d0c9f9b0d99956e57774af700c2869f5e1185e7fdc1c88a604051610d8391815260200190565b60405180910390a3505050505050505050565b6000610da0610f3e565b9050600080610dae83610713565b9150915080600003610dec576040517f2f763a0100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff808416600090815260046020526040808220829055918416815290812055610e2e8383838a8a8a8a6113b0565b610e7b83610e3d836002611d4a565b73ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169190610f67565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f1b49a4aed790d292c789d3767d6ba8b85b5d5922228626cf558d9127a368e19c8360405161048891815260200190565b610ee2610fed565b73ffffffffffffffffffffffffffffffffffffffff8116610f32576040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260006004820152602401610515565b610f3b81611098565b50565b6000610f486113c1565b905090565b610f5e60008888888888888861143e565b50505050505050565b60405173ffffffffffffffffffffffffffffffffffffffff838116602483015260448201839052610fe891859182169063a9059cbb906064015b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611694565b505050565b610ff5610f3e565b73ffffffffffffffffffffffffffffffffffffffff1661102a60005473ffffffffffffffffffffffffffffffffffffffff1690565b73ffffffffffffffffffffffffffffffffffffffff16146107115761104d610f3e565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff9091166004820152602401610515565b6000805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6040517fffffffffffffffffffffffffffffffffffffffff000000000000000000000000606089811b8216602084015260348301889052605483018790526074830186905230901b1660948201524660a88201526111f49087906111b89060c8015b604051602081830303815290604052805190602001207f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b84848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061172a92505050565b61125f576040517f5996d68a00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff80891660048301528716602482015260448101869052606481018590526084810184905260a401610515565b73ffffffffffffffffffffffffffffffffffffffff8616600090815260036020526040902061128e90856117a8565b156112e4576040517fe90aded400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8716600482015260248101859052604401610515565b73ffffffffffffffffffffffffffffffffffffffff86166000908152600360209081526040808320600888901c845290915290208054600160ff87161b17905561132d83421190565b15610f5e576040517f3ba234a300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405173ffffffffffffffffffffffffffffffffffffffff84811660248301528381166044830152606482018390526113aa9186918216906323b872dd90608401610fa1565b50505050565b610f5e60018888888888888861143e565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1633148015611409575060143610155b1561143957507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec36013560601c90565b503390565b60025460405189151560f81b60208201527fffffffffffffffffffffffffffffffffffffffff00000000000000000000000060608a811b8216602184015289811b8216603584015260498301899052606983018890526089830187905230901b1660a98201524660bd82015273ffffffffffffffffffffffffffffffffffffffff909116906115119082906114d59060dd0161116f565b85858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061172a92505050565b611584576040517f15d93b1f000000000000000000000000000000000000000000000000000000008152891515600482015273ffffffffffffffffffffffffffffffffffffffff808a16602483015288166044820152606481018790526084810186905260a4810185905260c401610515565b73ffffffffffffffffffffffffffffffffffffffff811660009081526003602052604090206115b390866117a8565b15611609576040517fe90aded400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8216600482015260248101869052604401610515565b73ffffffffffffffffffffffffffffffffffffffff81166000908152600360209081526040808320600889901c845290915290208054600160ff88161b17905561165284421190565b15611689576040517f3ba234a300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505050505050505050565b60006116b673ffffffffffffffffffffffffffffffffffffffff8416836117cd565b905080516000141580156116db5750808060200190518101906116d99190611d88565b155b15610fe8576040517f5274afe700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff84166004820152602401610515565b600080600061173985856117db565b509092509050600081600381111561175357611753611daa565b14801561178b57508573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b8061179c575061179c868686611828565b925050505b9392505050565b600881901c600090815260208390526040902054600160ff83161b1615155b92915050565b60606117a183836000611975565b600080600083516041036118155760208401516040850151606086015160001a61180788828585611a2e565b955095509550505050611821565b50508151600091506002905b9250925092565b60008060008573ffffffffffffffffffffffffffffffffffffffff168585604051602401611857929190611dfd565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f1626ba7e00000000000000000000000000000000000000000000000000000000179052516118d89190611e55565b600060405180830381855afa9150503d8060008114611913576040519150601f19603f3d011682016040523d82523d6000602084013e611918565b606091505b509150915081801561192c57506020815110155b801561179c575080517f1626ba7e000000000000000000000000000000000000000000000000000000009061196a9083016020908101908401611e71565b149695505050505050565b6060814710156119b3576040517fcd786059000000000000000000000000000000000000000000000000000000008152306004820152602401610515565b6000808573ffffffffffffffffffffffffffffffffffffffff1684866040516119dc9190611e55565b60006040518083038185875af1925050503d8060008114611a19576040519150601f19603f3d011682016040523d82523d6000602084013e611a1e565b606091505b509150915061179c868383611b28565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115611a695750600091506003905082611b1e565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015611abd573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff8116611b1457506000925060019150829050611b1e565b9250600091508190505b9450945094915050565b606082611b3d57611b3882611bb7565b6117a1565b8151158015611b61575073ffffffffffffffffffffffffffffffffffffffff84163b155b15611bb0576040517f9996b31500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85166004820152602401610515565b50806117a1565b805115611bc75780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008083601f840112611c0b57600080fd5b50813567ffffffffffffffff811115611c2357600080fd5b602083019150836020828501011115611c3b57600080fd5b9250929050565b60008060008060608587031215611c5857600080fd5b8435935060208501359250604085013567ffffffffffffffff811115611c7d57600080fd5b611c8987828801611bf9565b95989497509550505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114611cb957600080fd5b919050565b600060208284031215611cd057600080fd5b6117a182611c95565b60008060008060008060a08789031215611cf257600080fd5b611cfb87611c95565b9550602087013594506040870135935060608701359250608087013567ffffffffffffffff811115611d2c57600080fd5b611d3889828a01611bf9565b979a9699509497509295939492505050565b80820281158282048414176117c7577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600060208284031215611d9a57600080fd5b815180151581146117a157600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60005b83811015611df4578181015183820152602001611ddc565b50506000910152565b8281526040602082015260008251806040840152611e22816060850160208701611dd9565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016060019392505050565b60008251611e67818460208701611dd9565b9190910192915050565b600060208284031215611e8357600080fd5b505191905056fea2646970667358221220ea0e2fddd6a55d1ed3c2ed5699617921433f7f70937a45d6a3af5541ac28225f64736f6c63430008160033";
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
