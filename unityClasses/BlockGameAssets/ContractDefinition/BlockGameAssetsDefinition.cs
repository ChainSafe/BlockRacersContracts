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
        public static string BYTECODE = "0x60c06040523480156200001157600080fd5b506040516200280438038062002804833981016040819052620000349162000100565b6001600160a01b038216608052806200004d816200006d565b50620000586200007f565b6001600160a01b031660a05250620003539050565b60026200007b828262000287565b5050565b60006200008b62000090565b905090565b60006200009d33620000c3565b8015620000ab575060143610155b15620000be575060131936013560601c90565b503390565b6000620000cf60805190565b6001600160a01b0316826001600160a01b0316149050919050565b634e487b7160e01b600052604160045260246000fd5b600080604083850312156200011457600080fd5b82516001600160a01b03811681146200012c57600080fd5b602084810151919350906001600160401b03808211156200014c57600080fd5b818601915086601f8301126200016157600080fd5b815181811115620001765762000176620000ea565b604051601f8201601f19908116603f01168101908382118183101715620001a157620001a1620000ea565b816040528281528986848701011115620001ba57600080fd5b600093505b82841015620001de5784840186015181850187015292850192620001bf565b60008684830101528096505050505050509250929050565b600181811c908216806200020b57607f821691505b6020821081036200022c57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111562000282576000816000526020600020601f850160051c810160208610156200025d5750805b601f850160051c820191505b818110156200027e5782815560010162000269565b5050505b505050565b81516001600160401b03811115620002a357620002a3620000ea565b620002bb81620002b48454620001f6565b8462000232565b602080601f831160018114620002f35760008415620002da5750858301515b600019600386901b1c1916600185901b1785556200027e565b600085815260208120601f198616915b82811015620003245788860151825594840194600190910190840162000303565b5085821015620003435787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a051612461620003a3600039600081816102bd015281816104a0015281816107540152818161081f01526108cd0152600081816101e80152818161023a0152610deb01526124616000f3fe608060405234801561001057600080fd5b506004361061011a5760003560e01c80636a627842116100b2578063a22cb46511610081578063e985e9c511610066578063e985e9c5146102df578063ec247aa714610328578063f242432a1461033b57600080fd5b8063a22cb465146102a5578063a289af51146102b857600080fd5b80636a627842146102255780637da0a877146102385780638b87c5441461027f578063a0bcfc7f1461029257600080fd5b80632eb2c2d6116100ee5780632eb2c2d6146101905780634e1273f4146101a55780634f558e79146101c5578063572b6c05146101d857600080fd5b8062fdd58e1461011f57806301ffc9a7146101455780630e89341c1461016857806318160ddd14610188575b600080fd5b61013261012d366004611a03565b61034e565b6040519081526020015b60405180910390f35b610158610153366004611a5b565b610383565b604051901515815260200161013c565b61017b610176366004611a78565b610466565b60405161013c9190611aff565b600454610132565b6101a361019e366004611cc2565b610569565b005b6101b86101b3366004611d6c565b610655565b60405161013c9190611e68565b6101586101d3366004611a78565b61073b565b6101586101e6366004611e7b565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff90811691161490565b610132610233366004611e7b565b610750565b7f00000000000000000000000000000000000000000000000000000000000000005b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161013c565b6101b861028d366004611e7b565b6107ec565b6101a36102a0366004611e96565b61081d565b6101a36102b3366004611ee7565b6108b5565b61025a7f000000000000000000000000000000000000000000000000000000000000000081565b6101586102ed366004611f23565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205460ff1690565b6101a3610336366004611a78565b6108cb565b6101a3610349366004611f56565b61099a565b60008181526020818152604080832073ffffffffffffffffffffffffffffffffffffffff861684529091529020545b92915050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167fd9b67a2600000000000000000000000000000000000000000000000000000000148061041657507fffffffff0000000000000000000000000000000000000000000000000000000082167f0e89341c00000000000000000000000000000000000000000000000000000000145b8061037d57507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff0000000000000000000000000000000000000000000000000000000083161461037d565b606061047182610a79565b6040517fd1da95e0000000000000000000000000000000000000000000000000000000008152600481018490527f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff169063d1da95e090602401600060405180830381865afa1580156104fc573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526105429190810190611fbb565b604051602001610553929190612032565b6040516020818303038152906040529050919050565b6000610573610b0d565b90508073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16141580156105e4575073ffffffffffffffffffffffffffffffffffffffff80871660009081526001602090815260408083209385168352929052205460ff16155b15610640576040517fe237d92200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8083166004830152871660248201526044015b60405180910390fd5b61064d8686868686610b1c565b505050505050565b6060815183511461069f57815183516040517f5b05999100000000000000000000000000000000000000000000000000000000815260048101929092526024820152604401610637565b6000835167ffffffffffffffff8111156106bb576106bb611b12565b6040519080825280602002602001820160405280156106e4578160200160208202803683370190505b50905060005b84518110156107335760208082028601015161070e9060208084028701015161034e565b82828151811061072057610720612089565b60209081029190910101526001016106ea565b509392505050565b6000808211801561037d575050600454101590565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16610791610b0d565b73ffffffffffffffffffffffffffffffffffffffff16146107de576040517fdb98489700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61037d82610bd0565b919050565b73ffffffffffffffffffffffffffffffffffffffff8116600090815260036020526040902060609061037d90610c04565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1661085c610b0d565b73ffffffffffffffffffffffffffffffffffffffff16146108a9576040517fdb98489700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6108b281610c18565b50565b6108c76108c0610b0d565b8383610c24565b5050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1661090a610b0d565b73ffffffffffffffffffffffffffffffffffffffff1614610957576040517fdb98489700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b807f6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b61098283610466565b60405161098f9190611aff565b60405180910390a250565b60006109a4610b0d565b90508073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614158015610a15575073ffffffffffffffffffffffffffffffffffffffff80871660009081526001602090815260408083209385168352929052205460ff16155b15610a6c576040517fe237d92200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff808316600483015287166024820152604401610637565b61064d8686868686610d0c565b606060028054610a88906120b8565b80601f0160208091040260200160405190810160405280929190818152602001828054610ab4906120b8565b8015610b015780601f10610ad657610100808354040283529160200191610b01565b820191906000526020600020905b815481529060010190602001808311610ae457829003601f168201915b50505050509050919050565b6000610b17610de7565b905090565b73ffffffffffffffffffffffffffffffffffffffff8416610b6c576040517f57f447ce00000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b73ffffffffffffffffffffffffffffffffffffffff8516610bbc576040517f01a8351400000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b610bc98585858585610e64565b5050505050565b6000806004546001610be2919061213a565b60408051600081526020810190915290915061037d9084908390600190610ece565b60606000610c1183610f51565b9392505050565b60026108c7828261219a565b73ffffffffffffffffffffffffffffffffffffffff8216610c74576040517fced3e10000000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b73ffffffffffffffffffffffffffffffffffffffff83811660008181526001602090815260408083209487168084529482529182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff8416610d5c576040517f57f447ce00000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b73ffffffffffffffffffffffffffffffffffffffff8516610dac576040517f01a8351400000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b60408051600180825260208201869052818301908152606082018590526080820190925290610dde8787848487610e64565b50505050505050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1633148015610e2f575060143610155b15610e5f57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec36013560601c90565b503390565b610e7085858585610fac565b73ffffffffffffffffffffffffffffffffffffffff841615610bc9576000610e96610b0d565b90508351600103610ec05760208481015190840151610eb9838989858589611215565b505061064d565b61064d818787878787611407565b73ffffffffffffffffffffffffffffffffffffffff8416610f1e576040517f57f447ce00000000000000000000000000000000000000000000000000000000815260006004820152602401610637565b6040805160018082526020820186905281830190815260608201859052608082019092529061064d600087848487610e64565b606081600001805480602002602001604051908101604052809291908181526020018280548015610b0157602002820191906000526020600020905b815481526020019060010190808311610f8d5750505050509050919050565b610fb884848484611598565b73ffffffffffffffffffffffffffffffffffffffff841661110d5760045460005b835181101561110457610feb826122b4565b91508184828151811061100057611000612089565b60200260200101511461105c5783818151811061101f5761101f612089565b60200260200101516040517f02144c1000000000000000000000000000000000000000000000000000000000815260040161063791815260200190565b82818151811061106e5761106e612089565b60200260200101516001146110cc5782818151811061108f5761108f612089565b60200260200101516040517f72cd4c4800000000000000000000000000000000000000000000000000000000815260040161063791815260200190565b73ffffffffffffffffffffffffffffffffffffffff851660009081526003602052604090206110fb9083611885565b50600101610fd9565b5060045561120f565b73ffffffffffffffffffffffffffffffffffffffff831661115a576040517ffa32799b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60005b8251811015610bc957600083828151811061117a5761117a612089565b602002602001015190506111d581600360008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002061189190919063ffffffff16565b5073ffffffffffffffffffffffffffffffffffffffff851660009081526003602052604090206112059082611885565b505060010161115d565b50505050565b73ffffffffffffffffffffffffffffffffffffffff84163b1561064d576040517ff23a6e6100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063f23a6e619061128c90899089908890889088906004016122ec565b6020604051808303816000875af19250505080156112e5575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526112e29181019061233c565b60015b611374573d808015611313576040519150601f19603f3d011682016040523d82523d6000602084013e611318565b606091505b50805160000361136c576040517f57f447ce00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff86166004820152602401610637565b805181602001fd5b7fffffffff0000000000000000000000000000000000000000000000000000000081167ff23a6e610000000000000000000000000000000000000000000000000000000014610dde576040517f57f447ce00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff86166004820152602401610637565b73ffffffffffffffffffffffffffffffffffffffff84163b1561064d576040517fbc197c8100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85169063bc197c819061147e9089908990889088908890600401612359565b6020604051808303816000875af19250505080156114d7575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526114d49181019061233c565b60015b611505573d808015611313576040519150601f19603f3d011682016040523d82523d6000602084013e611318565b7fffffffff0000000000000000000000000000000000000000000000000000000081167fbc197c810000000000000000000000000000000000000000000000000000000014610dde576040517f57f447ce00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff86166004820152602401610637565b80518251146115e057815181516040517f5b05999100000000000000000000000000000000000000000000000000000000815260048101929092526024820152604401610637565b60006115ea610b0d565b905060005b83518110156117585760208181028581018201519085019091015173ffffffffffffffffffffffffffffffffffffffff8816156116ef5760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8c168452909152902054818110156116bb576040517f03dee4c500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8a166004820152602481018290526044810183905260648101849052608401610637565b60008381526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8d16845290915290209082900390555b73ffffffffffffffffffffffffffffffffffffffff87161561174e5760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8b1684529091528120805483929061174890849061213a565b90915550505b50506001016115ef565b50825160010361180057602083015160009060208401519091508573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6285856040516117f1929190918252602082015260400190565b60405180910390a45050610bc9565b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb86866040516118769291906123c4565b60405180910390a45050505050565b6000610c11838361189d565b6000610c1183836118ec565b60008181526001830160205260408120546118e45750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561037d565b50600061037d565b600081815260018301602052604081205480156119d55760006119106001836123e9565b8554909150600090611924906001906123e9565b905080821461198957600086600001828154811061194457611944612089565b906000526020600020015490508087600001848154811061196757611967612089565b6000918252602080832090910192909255918252600188019052604090208390555b855486908061199a5761199a6123fc565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061037d565b600091505061037d565b803573ffffffffffffffffffffffffffffffffffffffff811681146107e757600080fd5b60008060408385031215611a1657600080fd5b611a1f836119df565b946020939093013593505050565b7fffffffff00000000000000000000000000000000000000000000000000000000811681146108b257600080fd5b600060208284031215611a6d57600080fd5b8135610c1181611a2d565b600060208284031215611a8a57600080fd5b5035919050565b60005b83811015611aac578181015183820152602001611a94565b50506000910152565b60008151808452611acd816020860160208601611a91565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000610c116020830184611ab5565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715611b8857611b88611b12565b604052919050565b600067ffffffffffffffff821115611baa57611baa611b12565b5060051b60200190565b600082601f830112611bc557600080fd5b81356020611bda611bd583611b90565b611b41565b8083825260208201915060208460051b870101935086841115611bfc57600080fd5b602086015b84811015611c185780358352918301918301611c01565b509695505050505050565b600067ffffffffffffffff821115611c3d57611c3d611b12565b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b6000611c77611bd584611c23565b9050828152838383011115611c8b57600080fd5b828260208301376000602084830101529392505050565b600082601f830112611cb357600080fd5b610c1183833560208501611c69565b600080600080600060a08688031215611cda57600080fd5b611ce3866119df565b9450611cf1602087016119df565b9350604086013567ffffffffffffffff80821115611d0e57600080fd5b611d1a89838a01611bb4565b94506060880135915080821115611d3057600080fd5b611d3c89838a01611bb4565b93506080880135915080821115611d5257600080fd5b50611d5f88828901611ca2565b9150509295509295909350565b60008060408385031215611d7f57600080fd5b823567ffffffffffffffff80821115611d9757600080fd5b818501915085601f830112611dab57600080fd5b81356020611dbb611bd583611b90565b82815260059290921b84018101918181019089841115611dda57600080fd5b948201945b83861015611dff57611df0866119df565b82529482019490820190611ddf565b96505086013592505080821115611e1557600080fd5b50611e2285828601611bb4565b9150509250929050565b60008151808452602080850194506020840160005b83811015611e5d57815187529582019590820190600101611e41565b509495945050505050565b602081526000610c116020830184611e2c565b600060208284031215611e8d57600080fd5b610c11826119df565b600060208284031215611ea857600080fd5b813567ffffffffffffffff811115611ebf57600080fd5b8201601f81018413611ed057600080fd5b611edf84823560208401611c69565b949350505050565b60008060408385031215611efa57600080fd5b611f03836119df565b915060208301358015158114611f1857600080fd5b809150509250929050565b60008060408385031215611f3657600080fd5b611f3f836119df565b9150611f4d602084016119df565b90509250929050565b600080600080600060a08688031215611f6e57600080fd5b611f77866119df565b9450611f85602087016119df565b93506040860135925060608601359150608086013567ffffffffffffffff811115611faf57600080fd5b611d5f88828901611ca2565b600060208284031215611fcd57600080fd5b815167ffffffffffffffff811115611fe457600080fd5b8201601f81018413611ff557600080fd5b8051612003611bd582611c23565b81815285602083850101111561201857600080fd5b612029826020830160208601611a91565b95945050505050565b60008351612044818460208801611a91565b835190830190612058818360208801611a91565b7f2e6a736f6e0000000000000000000000000000000000000000000000000000009101908152600501949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600181811c908216806120cc57607f821691505b602082108103612105577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8082018082111561037d5761037d61210b565b601f821115612195576000816000526020600020601f850160051c810160208610156121765750805b601f850160051c820191505b8181101561064d57828155600101612182565b505050565b815167ffffffffffffffff8111156121b4576121b4611b12565b6121c8816121c284546120b8565b8461214d565b602080601f83116001811461221b57600084156121e55750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b17855561064d565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b8281101561226857888601518255948401946001909101908401612249565b50858210156122a457878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036122e5576122e561210b565b5060010190565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525084604083015283606083015260a0608083015261233160a0830184611ab5565b979650505050505050565b60006020828403121561234e57600080fd5b8151610c1181611a2d565b600073ffffffffffffffffffffffffffffffffffffffff808816835280871660208401525060a0604083015261239260a0830186611e2c565b82810360608401526123a48186611e2c565b905082810360808401526123b88185611ab5565b98975050505050505050565b6040815260006123d76040830185611e2c565b82810360208401526120298185611e2c565b8181038181111561037d5761037d61210b565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea26469706673582212208ff97a426979a0ce3fc3bfb4175f4071621d1d382fcd61f4b2133b8b5d71cf9d64736f6c63430008160033";
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
