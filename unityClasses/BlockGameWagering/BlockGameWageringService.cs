using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Numerics;
using Nethereum.Hex.HexTypes;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Web3;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Contracts.CQS;
using Nethereum.Contracts.ContractHandlers;
using Nethereum.Contracts;
using System.Threading;
using BlockGameWagering.BlockGameWagering.ContractDefinition;

namespace BlockGameWagering.BlockGameWagering
{
    public partial class BlockGameWageringService
    {
        public static Task<TransactionReceipt> DeployContractAndWaitForReceiptAsync(Nethereum.Web3.Web3 web3, BlockGameWageringDeployment blockGameWageringDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            return web3.Eth.GetContractDeploymentHandler<BlockGameWageringDeployment>().SendRequestAndWaitForReceiptAsync(blockGameWageringDeployment, cancellationTokenSource);
        }

        public static Task<string> DeployContractAsync(Nethereum.Web3.Web3 web3, BlockGameWageringDeployment blockGameWageringDeployment)
        {
            return web3.Eth.GetContractDeploymentHandler<BlockGameWageringDeployment>().SendRequestAsync(blockGameWageringDeployment);
        }

        public static async Task<BlockGameWageringService> DeployContractAndGetServiceAsync(Nethereum.Web3.Web3 web3, BlockGameWageringDeployment blockGameWageringDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            var receipt = await DeployContractAndWaitForReceiptAsync(web3, blockGameWageringDeployment, cancellationTokenSource);
            return new BlockGameWageringService(web3, receipt.ContractAddress);
        }

        protected Nethereum.Web3.IWeb3 Web3{ get; }

        public ContractHandler ContractHandler { get; }

        public BlockGameWageringService(Nethereum.Web3.Web3 web3, string contractAddress)
        {
            Web3 = web3;
            ContractHandler = web3.Eth.GetContractHandler(contractAddress);
        }

        public BlockGameWageringService(Nethereum.Web3.IWeb3 web3, string contractAddress)
        {
            Web3 = web3;
            ContractHandler = web3.Eth.GetContractHandler(contractAddress);
        }

        public Task<string> AcceptWagerRequestAsync(AcceptWagerFunction acceptWagerFunction)
        {
             return ContractHandler.SendRequestAsync(acceptWagerFunction);
        }

        public Task<TransactionReceipt> AcceptWagerRequestAndWaitForReceiptAsync(AcceptWagerFunction acceptWagerFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(acceptWagerFunction, cancellationToken);
        }

        public Task<string> AcceptWagerRequestAsync(BigInteger wagerId)
        {
            var acceptWagerFunction = new AcceptWagerFunction();
                acceptWagerFunction.WagerId = wagerId;
            
             return ContractHandler.SendRequestAsync(acceptWagerFunction);
        }

        public Task<TransactionReceipt> AcceptWagerRequestAndWaitForReceiptAsync(BigInteger wagerId, CancellationTokenSource cancellationToken = null)
        {
            var acceptWagerFunction = new AcceptWagerFunction();
                acceptWagerFunction.WagerId = wagerId;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(acceptWagerFunction, cancellationToken);
        }

        public Task<string> AddToBlackListRequestAsync(AddToBlackListFunction addToBlackListFunction)
        {
             return ContractHandler.SendRequestAsync(addToBlackListFunction);
        }

        public Task<TransactionReceipt> AddToBlackListRequestAndWaitForReceiptAsync(AddToBlackListFunction addToBlackListFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(addToBlackListFunction, cancellationToken);
        }

        public Task<string> AddToBlackListRequestAsync(string account)
        {
            var addToBlackListFunction = new AddToBlackListFunction();
                addToBlackListFunction.Account = account;
            
             return ContractHandler.SendRequestAsync(addToBlackListFunction);
        }

        public Task<TransactionReceipt> AddToBlackListRequestAndWaitForReceiptAsync(string account, CancellationTokenSource cancellationToken = null)
        {
            var addToBlackListFunction = new AddToBlackListFunction();
                addToBlackListFunction.Account = account;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(addToBlackListFunction, cancellationToken);
        }

        public Task<string> AdminCancelWagerRequestAsync(AdminCancelWagerFunction adminCancelWagerFunction)
        {
             return ContractHandler.SendRequestAsync(adminCancelWagerFunction);
        }

        public Task<TransactionReceipt> AdminCancelWagerRequestAndWaitForReceiptAsync(AdminCancelWagerFunction adminCancelWagerFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(adminCancelWagerFunction, cancellationToken);
        }

        public Task<string> AdminCancelWagerRequestAsync(BigInteger wagerId)
        {
            var adminCancelWagerFunction = new AdminCancelWagerFunction();
                adminCancelWagerFunction.WagerId = wagerId;
            
             return ContractHandler.SendRequestAsync(adminCancelWagerFunction);
        }

        public Task<TransactionReceipt> AdminCancelWagerRequestAndWaitForReceiptAsync(BigInteger wagerId, CancellationTokenSource cancellationToken = null)
        {
            var adminCancelWagerFunction = new AdminCancelWagerFunction();
                adminCancelWagerFunction.WagerId = wagerId;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(adminCancelWagerFunction, cancellationToken);
        }

        public Task<string> CancelWagerRequestAsync(CancelWagerFunction cancelWagerFunction)
        {
             return ContractHandler.SendRequestAsync(cancelWagerFunction);
        }

        public Task<TransactionReceipt> CancelWagerRequestAndWaitForReceiptAsync(CancelWagerFunction cancelWagerFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(cancelWagerFunction, cancellationToken);
        }

        public Task<string> CancelWagerRequestAsync(BigInteger wagerId)
        {
            var cancelWagerFunction = new CancelWagerFunction();
                cancelWagerFunction.WagerId = wagerId;
            
             return ContractHandler.SendRequestAsync(cancelWagerFunction);
        }

        public Task<TransactionReceipt> CancelWagerRequestAndWaitForReceiptAsync(BigInteger wagerId, CancellationTokenSource cancellationToken = null)
        {
            var cancelWagerFunction = new CancelWagerFunction();
                cancelWagerFunction.WagerId = wagerId;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(cancelWagerFunction, cancellationToken);
        }

        public Task<string> CompleteWagerRequestAsync(CompleteWagerFunction completeWagerFunction)
        {
             return ContractHandler.SendRequestAsync(completeWagerFunction);
        }

        public Task<TransactionReceipt> CompleteWagerRequestAndWaitForReceiptAsync(CompleteWagerFunction completeWagerFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(completeWagerFunction, cancellationToken);
        }

        public Task<string> CompleteWagerRequestAsync(BigInteger wagerId, string winner, byte[] creatorProof, byte[] opponentProof)
        {
            var completeWagerFunction = new CompleteWagerFunction();
                completeWagerFunction.WagerId = wagerId;
                completeWagerFunction.Winner = winner;
                completeWagerFunction.CreatorProof = creatorProof;
                completeWagerFunction.OpponentProof = opponentProof;
            
             return ContractHandler.SendRequestAsync(completeWagerFunction);
        }

        public Task<TransactionReceipt> CompleteWagerRequestAndWaitForReceiptAsync(BigInteger wagerId, string winner, byte[] creatorProof, byte[] opponentProof, CancellationTokenSource cancellationToken = null)
        {
            var completeWagerFunction = new CompleteWagerFunction();
                completeWagerFunction.WagerId = wagerId;
                completeWagerFunction.Winner = winner;
                completeWagerFunction.CreatorProof = creatorProof;
                completeWagerFunction.OpponentProof = opponentProof;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(completeWagerFunction, cancellationToken);
        }

        public Task<string> CreateWagerRequestAsync(CreateWagerFunction createWagerFunction)
        {
             return ContractHandler.SendRequestAsync(createWagerFunction);
        }

        public Task<TransactionReceipt> CreateWagerRequestAndWaitForReceiptAsync(CreateWagerFunction createWagerFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(createWagerFunction, cancellationToken);
        }

        public Task<string> CreateWagerRequestAsync(BigInteger prize)
        {
            var createWagerFunction = new CreateWagerFunction();
                createWagerFunction.Prize = prize;
            
             return ContractHandler.SendRequestAsync(createWagerFunction);
        }

        public Task<TransactionReceipt> CreateWagerRequestAndWaitForReceiptAsync(BigInteger prize, CancellationTokenSource cancellationToken = null)
        {
            var createWagerFunction = new CreateWagerFunction();
                createWagerFunction.Prize = prize;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(createWagerFunction, cancellationToken);
        }

        public Task<List<BigInteger>> GetPlayersWagersQueryAsync(GetPlayersWagersFunction getPlayersWagersFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetPlayersWagersFunction, List<BigInteger>>(getPlayersWagersFunction, blockParameter);
        }

        
        public Task<List<BigInteger>> GetPlayersWagersQueryAsync(string player, BlockParameter blockParameter = null)
        {
            var getPlayersWagersFunction = new GetPlayersWagersFunction();
                getPlayersWagersFunction.Player = player;
            
            return ContractHandler.QueryAsync<GetPlayersWagersFunction, List<BigInteger>>(getPlayersWagersFunction, blockParameter);
        }

        public Task<GetWagerOutputDTO> GetWagerQueryAsync(GetWagerFunction getWagerFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<GetWagerFunction, GetWagerOutputDTO>(getWagerFunction, blockParameter);
        }

        public Task<GetWagerOutputDTO> GetWagerQueryAsync(BigInteger wagerId, BlockParameter blockParameter = null)
        {
            var getWagerFunction = new GetWagerFunction();
                getWagerFunction.WagerId = wagerId;
            
            return ContractHandler.QueryDeserializingToObjectAsync<GetWagerFunction, GetWagerOutputDTO>(getWagerFunction, blockParameter);
        }

        public Task<bool> IsBlackListedQueryAsync(IsBlackListedFunction isBlackListedFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<IsBlackListedFunction, bool>(isBlackListedFunction, blockParameter);
        }

        
        public Task<bool> IsBlackListedQueryAsync(string account, BlockParameter blockParameter = null)
        {
            var isBlackListedFunction = new IsBlackListedFunction();
                isBlackListedFunction.Account = account;
            
            return ContractHandler.QueryAsync<IsBlackListedFunction, bool>(isBlackListedFunction, blockParameter);
        }

        public Task<bool> IsTrustedForwarderQueryAsync(IsTrustedForwarderFunction isTrustedForwarderFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<IsTrustedForwarderFunction, bool>(isTrustedForwarderFunction, blockParameter);
        }

        
        public Task<bool> IsTrustedForwarderQueryAsync(string forwarder, BlockParameter blockParameter = null)
        {
            var isTrustedForwarderFunction = new IsTrustedForwarderFunction();
                isTrustedForwarderFunction.Forwarder = forwarder;
            
            return ContractHandler.QueryAsync<IsTrustedForwarderFunction, bool>(isTrustedForwarderFunction, blockParameter);
        }

        public Task<BigInteger> LatestWagerIdQueryAsync(LatestWagerIdFunction latestWagerIdFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<LatestWagerIdFunction, BigInteger>(latestWagerIdFunction, blockParameter);
        }

        
        public Task<BigInteger> LatestWagerIdQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<LatestWagerIdFunction, BigInteger>(null, blockParameter);
        }

        public Task<string> OwnerQueryAsync(OwnerFunction ownerFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<OwnerFunction, string>(ownerFunction, blockParameter);
        }

        
        public Task<string> OwnerQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<OwnerFunction, string>(null, blockParameter);
        }

        public Task<string> RemoveFromBlackListRequestAsync(RemoveFromBlackListFunction removeFromBlackListFunction)
        {
             return ContractHandler.SendRequestAsync(removeFromBlackListFunction);
        }

        public Task<TransactionReceipt> RemoveFromBlackListRequestAndWaitForReceiptAsync(RemoveFromBlackListFunction removeFromBlackListFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(removeFromBlackListFunction, cancellationToken);
        }

        public Task<string> RemoveFromBlackListRequestAsync(string account)
        {
            var removeFromBlackListFunction = new RemoveFromBlackListFunction();
                removeFromBlackListFunction.Account = account;
            
             return ContractHandler.SendRequestAsync(removeFromBlackListFunction);
        }

        public Task<TransactionReceipt> RemoveFromBlackListRequestAndWaitForReceiptAsync(string account, CancellationTokenSource cancellationToken = null)
        {
            var removeFromBlackListFunction = new RemoveFromBlackListFunction();
                removeFromBlackListFunction.Account = account;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(removeFromBlackListFunction, cancellationToken);
        }

        public Task<string> RenounceOwnershipRequestAsync(RenounceOwnershipFunction renounceOwnershipFunction)
        {
             return ContractHandler.SendRequestAsync(renounceOwnershipFunction);
        }

        public Task<string> RenounceOwnershipRequestAsync()
        {
             return ContractHandler.SendRequestAsync<RenounceOwnershipFunction>();
        }

        public Task<TransactionReceipt> RenounceOwnershipRequestAndWaitForReceiptAsync(RenounceOwnershipFunction renounceOwnershipFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(renounceOwnershipFunction, cancellationToken);
        }

        public Task<TransactionReceipt> RenounceOwnershipRequestAndWaitForReceiptAsync(CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync<RenounceOwnershipFunction>(null, cancellationToken);
        }

        public Task<string> TokenQueryAsync(TokenFunction tokenFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TokenFunction, string>(tokenFunction, blockParameter);
        }

        
        public Task<string> TokenQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TokenFunction, string>(null, blockParameter);
        }

        public Task<string> TransferOwnershipRequestAsync(TransferOwnershipFunction transferOwnershipFunction)
        {
             return ContractHandler.SendRequestAsync(transferOwnershipFunction);
        }

        public Task<TransactionReceipt> TransferOwnershipRequestAndWaitForReceiptAsync(TransferOwnershipFunction transferOwnershipFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(transferOwnershipFunction, cancellationToken);
        }

        public Task<string> TransferOwnershipRequestAsync(string newOwner)
        {
            var transferOwnershipFunction = new TransferOwnershipFunction();
                transferOwnershipFunction.NewOwner = newOwner;
            
             return ContractHandler.SendRequestAsync(transferOwnershipFunction);
        }

        public Task<TransactionReceipt> TransferOwnershipRequestAndWaitForReceiptAsync(string newOwner, CancellationTokenSource cancellationToken = null)
        {
            var transferOwnershipFunction = new TransferOwnershipFunction();
                transferOwnershipFunction.NewOwner = newOwner;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(transferOwnershipFunction, cancellationToken);
        }

        public Task<string> TrustedForwarderQueryAsync(TrustedForwarderFunction trustedForwarderFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TrustedForwarderFunction, string>(trustedForwarderFunction, blockParameter);
        }

        
        public Task<string> TrustedForwarderQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TrustedForwarderFunction, string>(null, blockParameter);
        }
    }
}
