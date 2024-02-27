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

        public Task<string> TokenQueryAsync(TokenFunction tokenFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TokenFunction, string>(tokenFunction, blockParameter);
        }

        
        public Task<string> TokenQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TokenFunction, string>(null, blockParameter);
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

        public Task<string> CancelWagerRequestAsync(CancelWagerFunction cancelWagerFunction)
        {
             return ContractHandler.SendRequestAsync(cancelWagerFunction);
        }

        public Task<TransactionReceipt> CancelWagerRequestAndWaitForReceiptAsync(CancelWagerFunction cancelWagerFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(cancelWagerFunction, cancellationToken);
        }

        public Task<string> CancelWagerRequestAsync(BigInteger nonce, BigInteger deadline, byte[] serverSig)
        {
            var cancelWagerFunction = new CancelWagerFunction();
                cancelWagerFunction.Nonce = nonce;
                cancelWagerFunction.Deadline = deadline;
                cancelWagerFunction.ServerSig = serverSig;
            
             return ContractHandler.SendRequestAsync(cancelWagerFunction);
        }

        public Task<TransactionReceipt> CancelWagerRequestAndWaitForReceiptAsync(BigInteger nonce, BigInteger deadline, byte[] serverSig, CancellationTokenSource cancellationToken = null)
        {
            var cancelWagerFunction = new CancelWagerFunction();
                cancelWagerFunction.Nonce = nonce;
                cancelWagerFunction.Deadline = deadline;
                cancelWagerFunction.ServerSig = serverSig;
            
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

        public Task<string> CompleteWagerRequestAsync(BigInteger nonce, BigInteger deadline, byte[] serverSig)
        {
            var completeWagerFunction = new CompleteWagerFunction();
                completeWagerFunction.Nonce = nonce;
                completeWagerFunction.Deadline = deadline;
                completeWagerFunction.ServerSig = serverSig;
            
             return ContractHandler.SendRequestAsync(completeWagerFunction);
        }

        public Task<TransactionReceipt> CompleteWagerRequestAndWaitForReceiptAsync(BigInteger nonce, BigInteger deadline, byte[] serverSig, CancellationTokenSource cancellationToken = null)
        {
            var completeWagerFunction = new CompleteWagerFunction();
                completeWagerFunction.Nonce = nonce;
                completeWagerFunction.Deadline = deadline;
                completeWagerFunction.ServerSig = serverSig;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(completeWagerFunction, cancellationToken);
        }

        public Task<GetWagerOutputDTO> GetWagerQueryAsync(GetWagerFunction getWagerFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<GetWagerFunction, GetWagerOutputDTO>(getWagerFunction, blockParameter);
        }

        public Task<GetWagerOutputDTO> GetWagerQueryAsync(string player, BlockParameter blockParameter = null)
        {
            var getWagerFunction = new GetWagerFunction();
                getWagerFunction.Player = player;
            
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

        public Task<string> ServerQueryAsync(ServerFunction serverFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<ServerFunction, string>(serverFunction, blockParameter);
        }

        
        public Task<string> ServerQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<ServerFunction, string>(null, blockParameter);
        }

        public Task<string> SetServerAddressRequestAsync(SetServerAddressFunction setServerAddressFunction)
        {
             return ContractHandler.SendRequestAsync(setServerAddressFunction);
        }

        public Task<TransactionReceipt> SetServerAddressRequestAndWaitForReceiptAsync(SetServerAddressFunction setServerAddressFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setServerAddressFunction, cancellationToken);
        }

        public Task<string> SetServerAddressRequestAsync(string newServer)
        {
            var setServerAddressFunction = new SetServerAddressFunction();
                setServerAddressFunction.NewServer = newServer;
            
             return ContractHandler.SendRequestAsync(setServerAddressFunction);
        }

        public Task<TransactionReceipt> SetServerAddressRequestAndWaitForReceiptAsync(string newServer, CancellationTokenSource cancellationToken = null)
        {
            var setServerAddressFunction = new SetServerAddressFunction();
                setServerAddressFunction.NewServer = newServer;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setServerAddressFunction, cancellationToken);
        }

        public Task<string> StartWagerRequestAsync(StartWagerFunction startWagerFunction)
        {
             return ContractHandler.SendRequestAsync(startWagerFunction);
        }

        public Task<TransactionReceipt> StartWagerRequestAndWaitForReceiptAsync(StartWagerFunction startWagerFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(startWagerFunction, cancellationToken);
        }

        public Task<string> StartWagerRequestAsync(string opponent, BigInteger prize, BigInteger nonce, BigInteger deadline, byte[] opponentSig)
        {
            var startWagerFunction = new StartWagerFunction();
                startWagerFunction.Opponent = opponent;
                startWagerFunction.Prize = prize;
                startWagerFunction.Nonce = nonce;
                startWagerFunction.Deadline = deadline;
                startWagerFunction.OpponentSig = opponentSig;
            
             return ContractHandler.SendRequestAsync(startWagerFunction);
        }

        public Task<TransactionReceipt> StartWagerRequestAndWaitForReceiptAsync(string opponent, BigInteger prize, BigInteger nonce, BigInteger deadline, byte[] opponentSig, CancellationTokenSource cancellationToken = null)
        {
            var startWagerFunction = new StartWagerFunction();
                startWagerFunction.Opponent = opponent;
                startWagerFunction.Prize = prize;
                startWagerFunction.Nonce = nonce;
                startWagerFunction.Deadline = deadline;
                startWagerFunction.OpponentSig = opponentSig;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(startWagerFunction, cancellationToken);
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
