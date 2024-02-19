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
        public static string BYTECODE = "0x60c06040523480156200001157600080fd5b506040516200271138038062002711833981016040819052620000349162000102565b6001600160a01b03808416608052600160005582908490829081166200007457604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b6200007f8162000097565b5050506001600160a01b031660a05250620001569050565b600180546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0381168114620000ff57600080fd5b50565b6000806000606084860312156200011857600080fd5b83516200012581620000e9565b60208501519093506200013881620000e9565b60408501519092506200014b81620000e9565b809150509250925092565b60805160a051612548620001c96000396000818161031e015281816103f501528181610aa801528181610b3a01528181610b8601528181610f910152818161144e015281816115900152818161165a01526116a6015260008181610193015281816102110152611b2201526125486000f3fe608060405234801561001057600080fd5b506004361061011b5760003560e01c80637da0a877116100b2578063e47d606011610081578063ef38a32511610066578063ef38a325146102e6578063f2fde38b14610306578063fc0c546a1461031957600080fd5b8063e47d60601461029a578063eb071df2146102d357600080fd5b80637da0a8771461020f5780638da5cb5b146102565780639c37d7ea14610274578063ad2617701461028757600080fd5b8063572b6c05116100ee578063572b6c05146101835780636cac4103146101d0578063715018a6146101e75780637a2756f2146101ef57600080fd5b806330da3d7e14610120578063417c73a7146101485780634a49ac4c1461015d5780634f067dc714610170575b600080fd5b61013361012e366004612061565b610340565b60405190151581526020015b60405180910390f35b61015b61015636600461209e565b6105c3565b005b61015b61016b36600461209e565b6106ba565b61013361017e366004612061565b6107ad565b61013361019136600461209e565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff90811691161490565b6101d960035481565b60405190815260200161013f565b61015b610c5c565b6102026101fd366004612061565b610c70565b60405161013f9190612123565b7f00000000000000000000000000000000000000000000000000000000000000005b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161013f565b60015473ffffffffffffffffffffffffffffffffffffffff16610231565b610133610282366004612061565b610d47565b61013361029536600461225e565b6110a5565b6101336102a836600461209e565b73ffffffffffffffffffffffffffffffffffffffff1660009081526002602052604090205460ff1690565b6101336102e1366004612061565b6114d5565b6102f96102f436600461209e565b61177d565b60405161013f91906122dc565b61015b61031436600461209e565b6117f6565b6102317f000000000000000000000000000000000000000000000000000000000000000081565b600061034a61185a565b73ffffffffffffffffffffffffffffffffffffffff811660009081526002602052604090205460ff16156103c7576040517f571f7b4900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024015b60405180910390fd5b6103cf611869565b60006103d961185a565b905061041d73ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168230876118ac565b60036000815461042c9061234f565b909155506040805160a08101825285815273ffffffffffffffffffffffffffffffffffffffff83811660208084019182526000848601818152606086018281526001608088018181526003805486526004968790529990942088518155955190860180549188167fffffffffffffffffffffffff00000000000000000000000000000000000000009283161790559151600286018054918816918416919091179055519684018054979095169087168117855590519495929493927fffffffffffffffffffffff00000000000000000000000000000000000000000016179074010000000000000000000000000000000000000000908490811115610533576105336120b9565b0217905550505073ffffffffffffffffffffffffffffffffffffffff811660008181526005602090815260408083206003805482546001810184559286529484902090910193909355915491518781527f80bc7deb6e29d5090fcfe5b637d94779a4c25606f0442f198a46c60a272d995b910160405180910390a360019250506105bd6001600055565b50919050565b6105cb61193b565b73ffffffffffffffffffffffffffffffffffffffff811660009081526002602052604090205460ff1615610643576040517fd40e1aa500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024016103be565b73ffffffffffffffffffffffffffffffffffffffff811660008181526002602052604080822080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055517ff9b68063b051b82957fa193585681240904fed808db8b30fc5a2d2202c6ed6279190a250565b6106c261193b565b73ffffffffffffffffffffffffffffffffffffffff811660009081526002602052604090205460ff16610739576040517fe0b7a22800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024016103be565b73ffffffffffffffffffffffffffffffffffffffff811660008181526002602052604080822080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169055517fc121445dfc18619b882df11e54d4b1d2ac7391ea87c32aaa4d43d9b738a4a2279190a250565b60006107b761185a565b73ffffffffffffffffffffffffffffffffffffffff811660009081526002602052604090205460ff161561082f576040517f571f7b4900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024016103be565b610837611869565b60008381526004602052604090206001600382015474010000000000000000000000000000000000000000900460ff166004811115610878576108786120b9565b141580156108b757506002600382015474010000000000000000000000000000000000000000900460ff1660048111156108b4576108b46120b9565b14155b1561090357838160030160149054906101000a900460ff166040517f6e7c8eac0000000000000000000000000000000000000000000000000000000081526004016103be929190612387565b600061090d61185a565b90506001600383015474010000000000000000000000000000000000000000900460ff166004811115610942576109426120b9565b148061097e57506002600383015474010000000000000000000000000000000000000000900460ff16600481111561097c5761097c6120b9565b145b80156109a65750600182015473ffffffffffffffffffffffffffffffffffffffff8281169116145b80610a0857506002600383015474010000000000000000000000000000000000000000900460ff1660048111156109df576109df6120b9565b148015610a085750600282015473ffffffffffffffffffffffffffffffffffffffff8281169116145b15610bb0576001600383015474010000000000000000000000000000000000000000900460ff166004811115610a4057610a406120b9565b03610ad7576003820180547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff167404000000000000000000000000000000000000000017905560018201548254610ad29173ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116929116906119e6565b610c01565b6003820180547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff167404000000000000000000000000000000000000000017905560018201548254610b649173ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116929116906119e6565b60028201548254610ad29173ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116929116906119e6565b6040517ff6f127b40000000000000000000000000000000000000000000000000000000081526004810186905273ffffffffffffffffffffffffffffffffffffffff821660248201526044016103be565b60405173ffffffffffffffffffffffffffffffffffffffff8216815285907f62eb106a4fbe42c7cbd47bbf87b4fe9d81b93ade91ebf33b4d1e7d35b9268ce79060200160405180910390a26001935050506105bd6001600055565b610c6461193b565b610c6e6000611a29565b565b610c9f6040805160a0810182526000808252602082018190529181018290526060810182905290608082015290565b600082815260046020818152604092839020835160a08101855281548152600182015473ffffffffffffffffffffffffffffffffffffffff9081169382019390935260028201548316948101949094526003810154918216606085015291608084019174010000000000000000000000000000000000000000900460ff1690811115610d2d57610d2d6120b9565b6004811115610d3e57610d3e6120b9565b90525092915050565b6000610d5161185a565b73ffffffffffffffffffffffffffffffffffffffff811660009081526002602052604090205460ff1615610dc9576040517f571f7b4900000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff821660048201526024016103be565b6000838152600460208181526040808420815160a0810183528154815260018083015473ffffffffffffffffffffffffffffffffffffffff9081169583019590955260028301548516938201939093526003820154938416606082015291948894909360808401917401000000000000000000000000000000000000000090910460ff1690811115610e5d57610e5d6120b9565b6004811115610e6e57610e6e6120b9565b9052509050826004811115610e8557610e856120b9565b81608001516004811115610e9b57610e9b6120b9565b14610edb5760808101516040517f6cb2ca160000000000000000000000000000000000000000000000000000000081526103be918491869060040161239b565b610ee3611869565b6000610eed61185a565b600088815260046020526040902060018101549192509073ffffffffffffffffffffffffffffffffffffffff808416911603610f74576040517fd5e32a2e0000000000000000000000000000000000000000000000000000000081526004810189905273ffffffffffffffffffffffffffffffffffffffff831660248201526044016103be565b8054610fbb9073ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001690849030906118ac565b6002810180547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff84169081179091556003820180547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff1674020000000000000000000000000000000000000000179055600081815260056020908152604080832080546001810182559084529183209091018b9055518a917f33ab279870fef004a0f7d22a52a4e9606726d6fd587d74ea54c3d2d486e161a091a360019650505061109c6001600055565b50505050919050565b6000848152600460208181526040808420815160a08101835281548152600182015473ffffffffffffffffffffffffffffffffffffffff90811694820194909452600280830154851693820193909352600382015493841660608201529193899386939291608084019174010000000000000000000000000000000000000000900460ff169081111561113a5761113a6120b9565b600481111561114b5761114b6120b9565b9052509050826004811115611162576111626120b9565b81608001516004811115611178576111786120b9565b146111b85760808101516040517f6cb2ca160000000000000000000000000000000000000000000000000000000081526103be918491869060040161239b565b6111c0611869565b6000888152600460205260409020600181015473ffffffffffffffffffffffffffffffffffffffff8981169116148015906112185750600281015473ffffffffffffffffffffffffffffffffffffffff898116911614155b1561126e576040517f550e01ed000000000000000000000000000000000000000000000000000000008152600481018a905273ffffffffffffffffffffffffffffffffffffffff891660248201526044016103be565b60006113238a8a6040516020016112da9291909182527f2d00000000000000000000000000000000000000000000000000000000000000602083015260601b7fffffffffffffffffffffffffffffffffffffffff00000000000000000000000016602182015260350190565b604051602081830303815290604052805190602001207f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b600183015490915060009061134f9073ffffffffffffffffffffffffffffffffffffffff16838b611aa0565b600284015490915060009061137b9073ffffffffffffffffffffffffffffffffffffffff16848b611aa0565b9050811580611388575080155b156113c9578b8b848c8c6040517f5f04059c0000000000000000000000000000000000000000000000000000000081526004016103be959493929190612432565b600384018054740300000000000000000000000000000000000000007fffffffffffffffffffffff00000000000000000000000000000000000000000090911673ffffffffffffffffffffffffffffffffffffffff8e16171790558354611475908c9061143790600261248b565b73ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001691906119e6565b60405173ffffffffffffffffffffffffffffffffffffffff8c16908d907f95de43ab6b6ff3a41536bffc792e8f029ac26b90bd0efc7f60dc94b8a2e9610d90600090a360019750505050506114ca6001600055565b505050949350505050565b60006114df61193b565b6114e7611869565b60008281526004602052604090206001600382015474010000000000000000000000000000000000000000900460ff166004811115611528576115286120b9565b036115bf576003810180547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff1674040000000000000000000000000000000000000000179055600181015481546115ba9173ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116929116906119e6565b611717565b6002600382015474010000000000000000000000000000000000000000900460ff1660048111156115f2576115f26120b9565b036116d0576003810180547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff1674040000000000000000000000000000000000000000179055600181015481546116849173ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116929116906119e6565b600281015481546115ba9173ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116929116906119e6565b828160030160149054906101000a900460ff166040517f6e7c8eac0000000000000000000000000000000000000000000000000000000081526004016103be929190612387565b827f62eb106a4fbe42c7cbd47bbf87b4fe9d81b93ade91ebf33b4d1e7d35b9268ce761174161185a565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390a260019150506117786001600055565b919050565b73ffffffffffffffffffffffffffffffffffffffff81166000908152600560209081526040918290208054835181840281018401909452808452606093928301828280156117ea57602002820191906000526020600020905b8154815260200190600101908083116117d6575b50505050509050919050565b6117fe61193b565b73ffffffffffffffffffffffffffffffffffffffff811661184e576040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600060048201526024016103be565b61185781611a29565b50565b6000611864611b1e565b905090565b6002600054036118a5576040517f3ee5aeb500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002600055565b60405173ffffffffffffffffffffffffffffffffffffffff84811660248301528381166044830152606482018390526119359186918216906323b872dd906084015b604051602081830303815290604052915060e01b6020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611b9b565b50505050565b61194361185a565b73ffffffffffffffffffffffffffffffffffffffff1661197860015473ffffffffffffffffffffffffffffffffffffffff1690565b73ffffffffffffffffffffffffffffffffffffffff1614610c6e5761199b61185a565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff90911660048201526024016103be565b60405173ffffffffffffffffffffffffffffffffffffffff838116602483015260448201839052611a2491859182169063a9059cbb906064016118ee565b505050565b6001805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000806000611aaf8585611c31565b5090925090506000816003811115611ac957611ac96120b9565b148015611b0157508573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b80611b125750611b12868686611c7e565b925050505b9392505050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1633148015611b66575060143610155b15611b9657507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec36013560601c90565b503390565b6000611bbd73ffffffffffffffffffffffffffffffffffffffff841683611dcb565b90508051600014158015611be2575080806020019051810190611be091906124a2565b155b15611a24576040517f5274afe700000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff841660048201526024016103be565b60008060008351604103611c6b5760208401516040850151606086015160001a611c5d88828585611de2565b955095509550505050611c77565b50508151600091506002905b9250925092565b60008060008573ffffffffffffffffffffffffffffffffffffffff168585604051602401611cad9291906124c4565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f1626ba7e0000000000000000000000000000000000000000000000000000000017905251611d2e91906124dd565b600060405180830381855afa9150503d8060008114611d69576040519150601f19603f3d011682016040523d82523d6000602084013e611d6e565b606091505b5091509150818015611d8257506020815110155b8015611b12575080517f1626ba7e0000000000000000000000000000000000000000000000000000000090611dc090830160209081019084016124f9565b149695505050505050565b6060611dd983836000611edc565b90505b92915050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115611e1d5750600091506003905082611ed2565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015611e71573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff8116611ec857506000925060019150829050611ed2565b9250600091508190505b9450945094915050565b606081471015611f1a576040517fcd7860590000000000000000000000000000000000000000000000000000000081523060048201526024016103be565b6000808573ffffffffffffffffffffffffffffffffffffffff168486604051611f4391906124dd565b60006040518083038185875af1925050503d8060008114611f80576040519150601f19603f3d011682016040523d82523d6000602084013e611f85565b606091505b5091509150611b12868383606082611fa557611fa08261201f565b611b17565b8151158015611fc9575073ffffffffffffffffffffffffffffffffffffffff84163b155b15612018576040517f9996b31500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff851660048201526024016103be565b5080611b17565b80511561202f5780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006020828403121561207357600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461177857600080fd5b6000602082840312156120b057600080fd5b611dd98261207a565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6005811061211f577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b9052565b600060a08201905082518252602083015173ffffffffffffffffffffffffffffffffffffffff80821660208501528060408601511660408501528060608601511660608501525050608083015161217d60808401826120e8565b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f8301126121c457600080fd5b813567ffffffffffffffff808211156121df576121df612184565b604051601f83017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f0116810190828211818310171561222557612225612184565b8160405283815286602085880101111561223e57600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806000806080858703121561227457600080fd5b843593506122846020860161207a565b9250604085013567ffffffffffffffff808211156122a157600080fd5b6122ad888389016121b3565b935060608701359150808211156122c357600080fd5b506122d0878288016121b3565b91505092959194509250565b6020808252825182820181905260009190848201906040850190845b81811015612314578351835292840192918401916001016122f8565b50909695505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361238057612380612320565b5060010190565b82815260408101611b1760208301846120e8565b838152606081016123af60208301856120e8565b6123bc60408301846120e8565b949350505050565b60005b838110156123df5781810151838201526020016123c7565b50506000910152565b600081518084526124008160208601602086016123c4565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b85815273ffffffffffffffffffffffffffffffffffffffff8516602082015283604082015260a06060820152600061246d60a08301856123e8565b828103608084015261247f81856123e8565b98975050505050505050565b8082028115828204841417611ddc57611ddc612320565b6000602082840312156124b457600080fd5b81518015158114611b1757600080fd5b8281526040602082015260006123bc60408301846123e8565b600082516124ef8184602087016123c4565b9190910192915050565b60006020828403121561250b57600080fd5b505191905056fea2646970667358221220056dee4cb2a52d742b9ca065930499715d3d33ebe105a5d07aafcb9985918e8764736f6c63430008160033";
        public BlockGameWageringDeploymentBase() : base(BYTECODE) { }
        public BlockGameWageringDeploymentBase(string byteCode) : base(byteCode) { }
        [Parameter("address", "trustedForwarder", 1)]
        public virtual string TrustedForwarder { get; set; }
        [Parameter("address", "admin_", 2)]
        public virtual string Admin { get; set; }
        [Parameter("address", "token_", 3)]
        public virtual string Token { get; set; }
    }

    public partial class AcceptWagerFunction : AcceptWagerFunctionBase { }

    [Function("acceptWager", "bool")]
    public class AcceptWagerFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
    }

    public partial class AddToBlackListFunction : AddToBlackListFunctionBase { }

    [Function("addToBlackList")]
    public class AddToBlackListFunctionBase : FunctionMessage
    {
        [Parameter("address", "account", 1)]
        public virtual string Account { get; set; }
    }

    public partial class AdminCancelWagerFunction : AdminCancelWagerFunctionBase { }

    [Function("adminCancelWager", "bool")]
    public class AdminCancelWagerFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
    }

    public partial class CancelWagerFunction : CancelWagerFunctionBase { }

    [Function("cancelWager", "bool")]
    public class CancelWagerFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
    }

    public partial class CompleteWagerFunction : CompleteWagerFunctionBase { }

    [Function("completeWager", "bool")]
    public class CompleteWagerFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("address", "winner", 2)]
        public virtual string Winner { get; set; }
        [Parameter("bytes", "creatorProof", 3)]
        public virtual byte[] CreatorProof { get; set; }
        [Parameter("bytes", "opponentProof", 4)]
        public virtual byte[] OpponentProof { get; set; }
    }

    public partial class CreateWagerFunction : CreateWagerFunctionBase { }

    [Function("createWager", "bool")]
    public class CreateWagerFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "prize", 1)]
        public virtual BigInteger Prize { get; set; }
    }

    public partial class GetPlayersWagersFunction : GetPlayersWagersFunctionBase { }

    [Function("getPlayersWagers", "uint256[]")]
    public class GetPlayersWagersFunctionBase : FunctionMessage
    {
        [Parameter("address", "player", 1)]
        public virtual string Player { get; set; }
    }

    public partial class GetWagerFunction : GetWagerFunctionBase { }

    [Function("getWager", typeof(GetWagerOutputDTO))]
    public class GetWagerFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
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

    public partial class LatestWagerIdFunction : LatestWagerIdFunctionBase { }

    [Function("latestWagerId", "uint256")]
    public class LatestWagerIdFunctionBase : FunctionMessage
    {

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

    public partial class TokenFunction : TokenFunctionBase { }

    [Function("token", "address")]
    public class TokenFunctionBase : FunctionMessage
    {

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

    public partial class WagerAcceptedEventDTO : WagerAcceptedEventDTOBase { }

    [Event("WagerAccepted")]
    public class WagerAcceptedEventDTOBase : IEventDTO
    {
        [Parameter("uint256", "wagerId", 1, true )]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("address", "opponent", 2, true )]
        public virtual string Opponent { get; set; }
    }

    public partial class WagerCancelledEventDTO : WagerCancelledEventDTOBase { }

    [Event("WagerCancelled")]
    public class WagerCancelledEventDTOBase : IEventDTO
    {
        [Parameter("uint256", "wagerId", 1, true )]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("address", "cancelledBy", 2, false )]
        public virtual string CancelledBy { get; set; }
    }

    public partial class WagerCompletedEventDTO : WagerCompletedEventDTOBase { }

    [Event("WagerCompleted")]
    public class WagerCompletedEventDTOBase : IEventDTO
    {
        [Parameter("uint256", "wagerId", 1, true )]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("address", "winner", 2, true )]
        public virtual string Winner { get; set; }
    }

    public partial class WagerCreatedEventDTO : WagerCreatedEventDTOBase { }

    [Event("WagerCreated")]
    public class WagerCreatedEventDTOBase : IEventDTO
    {
        [Parameter("uint256", "wagerId", 1, true )]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("address", "creator", 2, true )]
        public virtual string Creator { get; set; }
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

    public partial class OnlyParticipantsCanCancelError : OnlyParticipantsCanCancelErrorBase { }

    [Error("OnlyParticipantsCanCancel")]
    public class OnlyParticipantsCanCancelErrorBase : IErrorDTO
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("address", "requestor", 2)]
        public virtual string Requestor { get; set; }
    }

    public partial class OpponentCantBeChallengerError : OpponentCantBeChallengerErrorBase { }

    [Error("OpponentCantBeChallenger")]
    public class OpponentCantBeChallengerErrorBase : IErrorDTO
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("address", "opponent", 2)]
        public virtual string Opponent { get; set; }
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

    public partial class PlayerSignatureInvalidError : PlayerSignatureInvalidErrorBase { }

    [Error("PlayerSignatureInvalid")]
    public class PlayerSignatureInvalidErrorBase : IErrorDTO
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("address", "winner", 2)]
        public virtual string Winner { get; set; }
        [Parameter("bytes32", "message", 3)]
        public virtual byte[] Message { get; set; }
        [Parameter("bytes", "creatorProof", 4)]
        public virtual byte[] CreatorProof { get; set; }
        [Parameter("bytes", "opponentProof", 5)]
        public virtual byte[] OpponentProof { get; set; }
    }

    public partial class ReentrancyGuardReentrantCallError : ReentrancyGuardReentrantCallErrorBase { }
    [Error("ReentrancyGuardReentrantCall")]
    public class ReentrancyGuardReentrantCallErrorBase : IErrorDTO
    {
    }

    public partial class SafeERC20FailedOperationError : SafeERC20FailedOperationErrorBase { }

    [Error("SafeERC20FailedOperation")]
    public class SafeERC20FailedOperationErrorBase : IErrorDTO
    {
        [Parameter("address", "token", 1)]
        public virtual string Token { get; set; }
    }

    public partial class WagerCantBeCancelledError : WagerCantBeCancelledErrorBase { }

    [Error("WagerCantBeCancelled")]
    public class WagerCantBeCancelledErrorBase : IErrorDTO
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("uint8", "currentState", 2)]
        public virtual byte CurrentState { get; set; }
    }

    public partial class WagerStateIncorrectError : WagerStateIncorrectErrorBase { }

    [Error("WagerStateIncorrect")]
    public class WagerStateIncorrectErrorBase : IErrorDTO
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("uint8", "currentState", 2)]
        public virtual byte CurrentState { get; set; }
        [Parameter("uint8", "expected", 3)]
        public virtual byte Expected { get; set; }
    }

    public partial class WinnerMustBeParticipantError : WinnerMustBeParticipantErrorBase { }

    [Error("WinnerMustBeParticipant")]
    public class WinnerMustBeParticipantErrorBase : IErrorDTO
    {
        [Parameter("uint256", "wagerId", 1)]
        public virtual BigInteger WagerId { get; set; }
        [Parameter("address", "winner", 2)]
        public virtual string Winner { get; set; }
    }













    public partial class GetPlayersWagersOutputDTO : GetPlayersWagersOutputDTOBase { }

    [FunctionOutput]
    public class GetPlayersWagersOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("uint256[]", "", 1)]
        public virtual List<BigInteger> ReturnValue1 { get; set; }
    }

    public partial class GetWagerOutputDTO : GetWagerOutputDTOBase { }

    [FunctionOutput]
    public class GetWagerOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("tuple", "", 1)]
        public virtual Wager ReturnValue1 { get; set; }
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

    public partial class LatestWagerIdOutputDTO : LatestWagerIdOutputDTOBase { }

    [FunctionOutput]
    public class LatestWagerIdOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("uint256", "", 1)]
        public virtual BigInteger ReturnValue1 { get; set; }
    }

    public partial class OwnerOutputDTO : OwnerOutputDTOBase { }

    [FunctionOutput]
    public class OwnerOutputDTOBase : IFunctionOutputDTO 
    {
        [Parameter("address", "", 1)]
        public virtual string ReturnValue1 { get; set; }
    }





    public partial class TokenOutputDTO : TokenOutputDTOBase { }

    [FunctionOutput]
    public class TokenOutputDTOBase : IFunctionOutputDTO 
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
