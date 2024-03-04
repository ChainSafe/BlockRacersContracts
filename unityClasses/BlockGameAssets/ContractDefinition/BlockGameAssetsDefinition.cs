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

namespace BlockGameAssets.BlockGameAssets.ContractDefinition
{


    public partial class BlockGameAssetsDeployment : BlockGameAssetsDeploymentBase
    {
        public BlockGameAssetsDeployment() : base(BYTECODE) { }
        public BlockGameAssetsDeployment(string byteCode) : base(byteCode) { }
    }

    public class BlockGameAssetsDeploymentBase : ContractDeploymentMessage
    {
        public static string BYTECODE = "0x60c06040523480156200001157600080fd5b506040516200260138038062002601833981016040819052620000349162000100565b6001600160a01b038216608052806200004d816200006d565b50620000586200007f565b6001600160a01b031660a05250620003539050565b60026200007b828262000287565b5050565b60006200008b62000090565b905090565b60006200009d33620000c3565b8015620000ab575060143610155b15620000be575060131936013560601c90565b503390565b6000620000cf60805190565b6001600160a01b0316826001600160a01b0316149050919050565b634e487b7160e01b600052604160045260246000fd5b600080604083850312156200011457600080fd5b82516001600160a01b03811681146200012c57600080fd5b602084810151919350906001600160401b03808211156200014c57600080fd5b818601915086601f8301126200016157600080fd5b815181811115620001765762000176620000ea565b604051601f8201601f19908116603f01168101908382118183101715620001a157620001a1620000ea565b816040528281528986848701011115620001ba57600080fd5b600093505b82841015620001de5784840186015181850187015292850192620001bf565b60008684830101528096505050505050509250929050565b600181811c908216806200020b57607f821691505b6020821081036200022c57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111562000282576000816000526020600020601f850160051c810160208610156200025d5750805b601f850160051c820191505b818110156200027e5782815560010162000269565b5050505b505050565b81516001600160401b03811115620002a357620002a3620000ea565b620002bb81620002b48454620001f6565b8462000232565b602080601f831160018114620002f35760008415620002da5750858301515b600019600386901b1c1916600185901b1785556200027e565b600085815260208120601f198616915b82811015620003245788860151825594840194600190910190840162000303565b5085821015620003435787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a05161225e620003a3600039600081816102bd015281816104a0015281816107540152818161081f01526108cd0152600081816101e80152818161023a0152610deb015261225e6000f3fe608060405234801561001057600080fd5b506004361061011a5760003560e01c80636a627842116100b2578063a22cb46511610081578063e985e9c511610066578063e985e9c5146102df578063ec247aa714610328578063f242432a1461033b57600080fd5b8063a22cb465146102a5578063a289af51146102b857600080fd5b80636a627842146102255780637da0a877146102385780638b87c5441461027f578063a0bcfc7f1461029257600080fd5b80632eb2c2d6116100ee5780632eb2c2d6146101905780634e1273f4146101a55780634f558e79146101c5578063572b6c05146101d857600080fd5b8062fdd58e1461011f57806301ffc9a7146101455780630e89341c1461016857806318160ddd14610188575b600080fd5b61013261012d366004611842565b61034e565b6040519081526020015b60405180910390f35b61015861015336600461189a565b610383565b604051901515815260200161013c565b61017b6101763660046118b7565b610466565b60405161013c919061193e565b600454610132565b6101a361019e366004611b01565b610569565b005b6101b86101b3366004611bab565b610655565b60405161013c9190611ca7565b6101586101d33660046118b7565b61073b565b6101586101e6366004611cba565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff90811691161490565b610132610233366004611cba565b610750565b7f00000000000000000000000000000000000000000000000000000000000000005b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161013c565b6101b861028d366004611cba565b6107ec565b6101a36102a0366004611cd5565b61081d565b6101a36102b3366004611d26565b6108b5565b61025a7f000000000000000000000000000000000000000000000000000000000000000081565b6101586102ed366004611d62565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205460ff1690565b6101a36103363660046118b7565b6108cb565b6101a3610349366004611d95565b61099a565b60008181526020818152604080832073ffffffffffffffffffffffffffffffffffffffff861684529091529020545b92915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fd9b67a2600000000000000000000000000000000000000000000000000000000148061041657507fffffffff0000000000000000000000000000000000000000000000000000000082167f0e89341c00000000000000000000000000000000000000000000000000000000145b8061037d57507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff0000000000000000000000000000000000000000000000000000000083161461037d565b606061047182610a79565b6040517fd1da95e0000000000000000000000000000000000000000000000000000000008152600481018490527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff169063d1da95e090602401600060405180830381865afa1580156104fc573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526105429190810190611dfa565b604051602001610553929190611e71565b6040516020818303038152906040529050919050565b6000610573610b0d565b90508073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16141580156105e4575073ffffffffffffffffffffffffffffffffffffffff80871660009081526001602090815260408083209385168352929052205460ff16155b15610640576040517fe237d92200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8083166004830152871660248201526044015b60405180910390fd5b61064d8686868686610b1c565b505050505050565b6060815183511461069f57815183516040517f5b05999100000000000000000000000000000000000000000000000000000000815260048101929092526024820152604401610637565b6000835167ffffffffffffffff8111156106bb576106bb611951565b6040519080825280602002602001820160405280156106e4578160200160208202803683370190505b50905060005b84518110156107335760208082028601015161070e9060208084028701015161034e565b82828151811061072057610720611ec8565b60209081029190910101526001016106ea565b509392505050565b6000808211801561037d575050600454101590565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16610791610b0d565b73ffffffffffffffffffffffffffffffffffffffff16146107de576040517fdb98489700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61037d82610bd0565b919050565b73ffffffffffffffffffffffffffffffffffffffff8116600090815260036020526040902060609061037d90610c04565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1661085c610b0d565b73ffffffffffffffffffffffffffffffffffffffff16146108a9576040517fdb98489700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6108b281610c18565b50565b6108c76108c0610b0d565b8383610c24565b5050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1661090a610b0d565b73ffffffffffffffffffffffffffffffffffffffff1614610957576040517fdb98489700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b807f6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b61098283610466565b60405161098f919061193e565b60405180910390a250565b60006109a4610b0d565b90508073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614158015610a15575073ffffffffffffffffffffffffffffffffffffffff80871660009081526001602090815260408083209385168352929052205460ff16155b15610a6c576040517fe237d92200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff808316600483015287166024820152604401610637565b61064d8686868686610d0c565b606060028054610a8890611ef7565b80601f0160208091040260200160405190810160405280929190818152602001828054610ab490611ef7565b8015610b015780601f10610ad657610100808354040283529160200191610b01565b820191906000526020600020905b815481529060010190602001808311610ae457829003601f168201915b50505050509050919050565b6000610b17610de7565b905090565b73ffffffffffffffffffffffffffffffffffffffff8416610b6c576040517f57f447ce00000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b73ffffffffffffffffffffffffffffffffffffffff8516610bbc576040517f01a8351400000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b610bc98585858585610e64565b5050505050565b6000806004546001610be29190611f79565b60408051600081526020810190915290915061037d9084908390600190610ece565b60606000610c1183610f51565b9392505050565b60026108c78282611fd9565b73ffffffffffffffffffffffffffffffffffffffff8216610c74576040517fced3e10000000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8416610d5c576040517f57f447ce00000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b73ffffffffffffffffffffffffffffffffffffffff8516610dac576040517f01a8351400000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b60408051600180825260208201869052818301908152606082018590526080820190925290610dde8787848487610e64565b50505050505050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1633148015610e2f575060143610155b15610e5f57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec36013560601c90565b503390565b610e7085858585610fac565b73ffffffffffffffffffffffffffffffffffffffff841615610bc9576000610e96610b0d565b90508351600103610ec05760208481015190840151610eb9838989858589611158565b505061064d565b61064d81878787878761134a565b73ffffffffffffffffffffffffffffffffffffffff8416610f1e576040517f57f447ce00000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b6040805160018082526020820186905281830190815260608201859052608082019092529061064d600087848487610e64565b606081600001805480602002602001604051908101604052809291908181526020018280548015610b0157602002820191906000526020600020905b815481526020019060010190808311610f8d5750505050509050919050565b610fb8848484846114db565b60045473ffffffffffffffffffffffffffffffffffffffff851661110b5760005b835181101561110457610feb826120f3565b91508184828151811061100057611000611ec8565b60200260200101511461105c5783818151811061101f5761101f611ec8565b60200260200101516040517f02144c1000000000000000000000000000000000000000000000000000000000815260040161063791815260200190565b82818151811061106e5761106e611ec8565b60200260200101516001146110cc5782818151811061108f5761108f611ec8565b60200260200101516040517f72cd4c4800000000000000000000000000000000000000000000000000000000815260040161063791815260200190565b73ffffffffffffffffffffffffffffffffffffffff851660009081526003602052604090206110fb90836117c8565b50600101610fd9565b5060048190555b73ffffffffffffffffffffffffffffffffffffffff8416610bc9576040517ffa32799b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff84163b1561064d576040517ff23a6e6100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063f23a6e61906111cf908990899088908890889060040161212b565b6020604051808303816000875af1925050508015611228575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526112259181019061217b565b60015b6112b7573d808015611256576040519150601f19603f3d011682016040523d82523d6000602084013e61125b565b606091505b5080516000036112af576040517f57f447ce00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff86166004820152602401610637565b805181602001fd5b7fffffffff0000000000000000000000000000000000000000000000000000000081167ff23a6e610000000000000000000000000000000000000000000000000000000014610dde576040517f57f447ce00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff86166004820152602401610637565b73ffffffffffffffffffffffffffffffffffffffff84163b1561064d576040517fbc197c8100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063bc197c81906113c19089908990889088908890600401612198565b6020604051808303816000875af192505050801561141a575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526114179181019061217b565b60015b611448573d808015611256576040519150601f19603f3d011682016040523d82523d6000602084013e61125b565b7fffffffff0000000000000000000000000000000000000000000000000000000081167fbc197c810000000000000000000000000000000000000000000000000000000014610dde576040517f57f447ce00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff86166004820152602401610637565b805182511461152357815181516040517f5b05999100000000000000000000000000000000000000000000000000000000815260048101929092526024820152604401610637565b600061152d610b0d565b905060005b835181101561169b5760208181028581018201519085019091015173ffffffffffffffffffffffffffffffffffffffff8816156116325760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8c168452909152902054818110156115fe576040517f03dee4c500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8a166004820152602481018290526044810183905260648101849052608401610637565b60008381526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8d16845290915290209082900390555b73ffffffffffffffffffffffffffffffffffffffff8716156116915760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8b1684529091528120805483929061168b908490611f79565b90915550505b5050600101611532565b50825160010361174357602083015160009060208401519091508573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628585604051611734929190918252602082015260400190565b60405180910390a45050610bc9565b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb86866040516117b9929190612203565b60405180910390a45050505050565b6000610c11838360008181526001830160205260408120546118165750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561037d565b50600061037d565b803573ffffffffffffffffffffffffffffffffffffffff811681146107e757600080fd5b6000806040838503121561185557600080fd5b61185e8361181e565b946020939093013593505050565b7fffffffff00000000000000000000000000000000000000000000000000000000811681146108b257600080fd5b6000602082840312156118ac57600080fd5b8135610c118161186c565b6000602082840312156118c957600080fd5b5035919050565b60005b838110156118eb5781810151838201526020016118d3565b50506000910152565b6000815180845261190c8160208601602086016118d0565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000610c1160208301846118f4565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff811182821017156119c7576119c7611951565b604052919050565b600067ffffffffffffffff8211156119e9576119e9611951565b5060051b60200190565b600082601f830112611a0457600080fd5b81356020611a19611a14836119cf565b611980565b8083825260208201915060208460051b870101935086841115611a3b57600080fd5b602086015b84811015611a575780358352918301918301611a40565b509695505050505050565b600067ffffffffffffffff821115611a7c57611a7c611951565b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b6000611ab6611a1484611a62565b9050828152838383011115611aca57600080fd5b828260208301376000602084830101529392505050565b600082601f830112611af257600080fd5b610c1183833560208501611aa8565b600080600080600060a08688031215611b1957600080fd5b611b228661181e565b9450611b306020870161181e565b9350604086013567ffffffffffffffff80821115611b4d57600080fd5b611b5989838a016119f3565b94506060880135915080821115611b6f57600080fd5b611b7b89838a016119f3565b93506080880135915080821115611b9157600080fd5b50611b9e88828901611ae1565b9150509295509295909350565b60008060408385031215611bbe57600080fd5b823567ffffffffffffffff80821115611bd657600080fd5b818501915085601f830112611bea57600080fd5b81356020611bfa611a14836119cf565b82815260059290921b84018101918181019089841115611c1957600080fd5b948201945b83861015611c3e57611c2f8661181e565b82529482019490820190611c1e565b96505086013592505080821115611c5457600080fd5b50611c61858286016119f3565b9150509250929050565b60008151808452602080850194506020840160005b83811015611c9c57815187529582019590820190600101611c80565b509495945050505050565b602081526000610c116020830184611c6b565b600060208284031215611ccc57600080fd5b610c118261181e565b600060208284031215611ce757600080fd5b813567ffffffffffffffff811115611cfe57600080fd5b8201601f81018413611d0f57600080fd5b611d1e84823560208401611aa8565b949350505050565b60008060408385031215611d3957600080fd5b611d428361181e565b915060208301358015158114611d5757600080fd5b809150509250929050565b60008060408385031215611d7557600080fd5b611d7e8361181e565b9150611d8c6020840161181e565b90509250929050565b600080600080600060a08688031215611dad57600080fd5b611db68661181e565b9450611dc46020870161181e565b93506040860135925060608601359150608086013567ffffffffffffffff811115611dee57600080fd5b611b9e88828901611ae1565b600060208284031215611e0c57600080fd5b815167ffffffffffffffff811115611e2357600080fd5b8201601f81018413611e3457600080fd5b8051611e42611a1482611a62565b818152856020838501011115611e5757600080fd5b611e688260208301602086016118d0565b95945050505050565b60008351611e838184602088016118d0565b835190830190611e978183602088016118d0565b7f2e6a736f6e0000000000000000000000000000000000000000000000000000009101908152600501949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600181811c90821680611f0b57607f821691505b602082108103611f44577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8082018082111561037d5761037d611f4a565b601f821115611fd4576000816000526020600020601f850160051c81016020861015611fb55750805b601f850160051c820191505b8181101561064d57828155600101611fc1565b505050565b815167ffffffffffffffff811115611ff357611ff3611951565b612007816120018454611ef7565b84611f8c565b602080601f83116001811461205a57600084156120245750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b17855561064d565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b828110156120a757888601518255948401946001909101908401612088565b50858210156120e357878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361212457612124611f4a565b5060010190565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525084604083015283606083015260a0608083015261217060a08301846118f4565b979650505050505050565b60006020828403121561218d57600080fd5b8151610c118161186c565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525060a060408301526121d160a0830186611c6b565b82810360608401526121e38186611c6b565b905082810360808401526121f781856118f4565b98975050505050505050565b6040815260006122166040830185611c6b565b8281036020840152611e688185611c6b56fea2646970667358221220d81ad506085d885b3288a5c64b9504cbc6b0f5b60684d38c0b389d3d53d11b4264736f6c63430008160033";
        public BlockGameAssetsDeploymentBase() : base(BYTECODE) { }
        public BlockGameAssetsDeploymentBase(string byteCode) : base(byteCode) { }
        [Parameter("address", "trustedForwarder", 1)]
        public virtual string TrustedForwarder { get; set; }
        [Parameter("string", "baseUri_", 2)]
        public virtual string Baseuri { get; set; }
    }

    public partial class BlockGameFunction : BlockGameFunctionBase { }

    [Function("BLOCK_GAME", "address")]
    public class BlockGameFunctionBase : FunctionMessage
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

    public partial class EmitUriUpdateFunction : EmitUriUpdateFunctionBase { }

    [Function("emitUriUpdate")]
    public class EmitUriUpdateFunctionBase : FunctionMessage
    {
        [Parameter("uint256", "tokenId", 1)]
        public virtual BigInteger TokenId { get; set; }
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

    public partial class BlockGameOutputDTO : BlockGameOutputDTOBase { }

    [FunctionOutput]
    public class BlockGameOutputDTOBase : IFunctionOutputDTO 
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
