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
using BlockRacers.BlockRacers.ContractDefinition;

namespace BlockRacers.BlockRacers
{
    public partial class BlockRacersService
    {
        public static Task<TransactionReceipt> DeployContractAndWaitForReceiptAsync(Nethereum.Web3.Web3 web3, BlockRacersDeployment blockRacersDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            return web3.Eth.GetContractDeploymentHandler<BlockRacersDeployment>().SendRequestAndWaitForReceiptAsync(blockRacersDeployment, cancellationTokenSource);
        }

        public static Task<string> DeployContractAsync(Nethereum.Web3.Web3 web3, BlockRacersDeployment blockRacersDeployment)
        {
            return web3.Eth.GetContractDeploymentHandler<BlockRacersDeployment>().SendRequestAsync(blockRacersDeployment);
        }

        public static async Task<BlockRacersService> DeployContractAndGetServiceAsync(Nethereum.Web3.Web3 web3, BlockRacersDeployment blockRacersDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            var receipt = await DeployContractAndWaitForReceiptAsync(web3, blockRacersDeployment, cancellationTokenSource);
            return new BlockRacersService(web3, receipt.ContractAddress);
        }

        protected Nethereum.Web3.IWeb3 Web3{ get; }

        public ContractHandler ContractHandler { get; }

        public BlockRacersService(Nethereum.Web3.Web3 web3, string contractAddress)
        {
            Web3 = web3;
            ContractHandler = web3.Eth.GetContractHandler(contractAddress);
        }

        public BlockRacersService(Nethereum.Web3.IWeb3 web3, string contractAddress)
        {
            Web3 = web3;
            ContractHandler = web3.Eth.GetContractHandler(contractAddress);
        }

        public Task<string> AssetsQueryAsync(AssetsFunction assetsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<AssetsFunction, string>(assetsFunction, blockParameter);
        }

        
        public Task<string> AssetsQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<AssetsFunction, string>(null, blockParameter);
        }

        public Task<string> BlockRacersFeeAccountQueryAsync(BlockRacersFeeAccountFunction blockRacersFeeAccountFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<BlockRacersFeeAccountFunction, string>(blockRacersFeeAccountFunction, blockParameter);
        }

        
        public Task<string> BlockRacersFeeAccountQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<BlockRacersFeeAccountFunction, string>(null, blockParameter);
        }

        public Task<GetCarOptionOutputDTO> GetCarOptionQueryAsync(GetCarOptionFunction getCarOptionFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<GetCarOptionFunction, GetCarOptionOutputDTO>(getCarOptionFunction, blockParameter);
        }

        public Task<GetCarOptionOutputDTO> GetCarOptionQueryAsync(BigInteger carTypeId, BlockParameter blockParameter = null)
        {
            var getCarOptionFunction = new GetCarOptionFunction();
                getCarOptionFunction.CarTypeId = carTypeId;
            
            return ContractHandler.QueryDeserializingToObjectAsync<GetCarOptionFunction, GetCarOptionOutputDTO>(getCarOptionFunction, blockParameter);
        }

        public Task<bool> GetCarOwnerQueryAsync(GetCarOwnerFunction getCarOwnerFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetCarOwnerFunction, bool>(getCarOwnerFunction, blockParameter);
        }

        
        public Task<bool> GetCarOwnerQueryAsync(BigInteger carId, string account, BlockParameter blockParameter = null)
        {
            var getCarOwnerFunction = new GetCarOwnerFunction();
                getCarOwnerFunction.CarId = carId;
                getCarOwnerFunction.Account = account;
            
            return ContractHandler.QueryAsync<GetCarOwnerFunction, bool>(getCarOwnerFunction, blockParameter);
        }

        public Task<GetCarStatsOutputDTO> GetCarStatsQueryAsync(GetCarStatsFunction getCarStatsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<GetCarStatsFunction, GetCarStatsOutputDTO>(getCarStatsFunction, blockParameter);
        }

        public Task<GetCarStatsOutputDTO> GetCarStatsQueryAsync(BigInteger carId, BlockParameter blockParameter = null)
        {
            var getCarStatsFunction = new GetCarStatsFunction();
                getCarStatsFunction.CarId = carId;
            
            return ContractHandler.QueryDeserializingToObjectAsync<GetCarStatsFunction, GetCarStatsOutputDTO>(getCarStatsFunction, blockParameter);
        }

        public Task<GetItemDataOutputDTO> GetItemDataQueryAsync(GetItemDataFunction getItemDataFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<GetItemDataFunction, GetItemDataOutputDTO>(getItemDataFunction, blockParameter);
        }

        public Task<GetItemDataOutputDTO> GetItemDataQueryAsync(byte itemType, BlockParameter blockParameter = null)
        {
            var getItemDataFunction = new GetItemDataFunction();
                getItemDataFunction.ItemType = itemType;
            
            return ContractHandler.QueryDeserializingToObjectAsync<GetItemDataFunction, GetItemDataOutputDTO>(getItemDataFunction, blockParameter);
        }

        public Task<BigInteger> GetNumberOfCarsMintedQueryAsync(GetNumberOfCarsMintedFunction getNumberOfCarsMintedFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetNumberOfCarsMintedFunction, BigInteger>(getNumberOfCarsMintedFunction, blockParameter);
        }

        
        public Task<BigInteger> GetNumberOfCarsMintedQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetNumberOfCarsMintedFunction, BigInteger>(null, blockParameter);
        }

        public Task<GetUpgradeDataOutputDTO> GetUpgradeDataQueryAsync(GetUpgradeDataFunction getUpgradeDataFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<GetUpgradeDataFunction, GetUpgradeDataOutputDTO>(getUpgradeDataFunction, blockParameter);
        }

        public Task<GetUpgradeDataOutputDTO> GetUpgradeDataQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<GetUpgradeDataFunction, GetUpgradeDataOutputDTO>(null, blockParameter);
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

        public Task<string> MintCarRequestAsync(MintCarFunction mintCarFunction)
        {
             return ContractHandler.SendRequestAsync(mintCarFunction);
        }

        public Task<TransactionReceipt> MintCarRequestAndWaitForReceiptAsync(MintCarFunction mintCarFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(mintCarFunction, cancellationToken);
        }

        public Task<string> MintCarRequestAsync(BigInteger carTypeId)
        {
            var mintCarFunction = new MintCarFunction();
                mintCarFunction.CarTypeId = carTypeId;
            
             return ContractHandler.SendRequestAsync(mintCarFunction);
        }

        public Task<TransactionReceipt> MintCarRequestAndWaitForReceiptAsync(BigInteger carTypeId, CancellationTokenSource cancellationToken = null)
        {
            var mintCarFunction = new MintCarFunction();
                mintCarFunction.CarTypeId = carTypeId;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(mintCarFunction, cancellationToken);
        }

        public Task<string> OwnerQueryAsync(OwnerFunction ownerFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<OwnerFunction, string>(ownerFunction, blockParameter);
        }

        
        public Task<string> OwnerQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<OwnerFunction, string>(null, blockParameter);
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

        public Task<string> SetBlockRacersFeeAccountRequestAsync(SetBlockRacersFeeAccountFunction setBlockRacersFeeAccountFunction)
        {
             return ContractHandler.SendRequestAsync(setBlockRacersFeeAccountFunction);
        }

        public Task<TransactionReceipt> SetBlockRacersFeeAccountRequestAndWaitForReceiptAsync(SetBlockRacersFeeAccountFunction setBlockRacersFeeAccountFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setBlockRacersFeeAccountFunction, cancellationToken);
        }

        public Task<string> SetBlockRacersFeeAccountRequestAsync(string newBlockRacersFeeAccount)
        {
            var setBlockRacersFeeAccountFunction = new SetBlockRacersFeeAccountFunction();
                setBlockRacersFeeAccountFunction.NewBlockRacersFeeAccount = newBlockRacersFeeAccount;
            
             return ContractHandler.SendRequestAsync(setBlockRacersFeeAccountFunction);
        }

        public Task<TransactionReceipt> SetBlockRacersFeeAccountRequestAndWaitForReceiptAsync(string newBlockRacersFeeAccount, CancellationTokenSource cancellationToken = null)
        {
            var setBlockRacersFeeAccountFunction = new SetBlockRacersFeeAccountFunction();
                setBlockRacersFeeAccountFunction.NewBlockRacersFeeAccount = newBlockRacersFeeAccount;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setBlockRacersFeeAccountFunction, cancellationToken);
        }

        public Task<string> SetNewGameSettingsRequestAsync(SetNewGameSettingsFunction setNewGameSettingsFunction)
        {
             return ContractHandler.SendRequestAsync(setNewGameSettingsFunction);
        }

        public Task<TransactionReceipt> SetNewGameSettingsRequestAndWaitForReceiptAsync(SetNewGameSettingsFunction setNewGameSettingsFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setNewGameSettingsFunction, cancellationToken);
        }

        public Task<string> SetNewGameSettingsRequestAsync(GameSettingsData newSettings)
        {
            var setNewGameSettingsFunction = new SetNewGameSettingsFunction();
                setNewGameSettingsFunction.NewSettings = newSettings;
            
             return ContractHandler.SendRequestAsync(setNewGameSettingsFunction);
        }

        public Task<TransactionReceipt> SetNewGameSettingsRequestAndWaitForReceiptAsync(GameSettingsData newSettings, CancellationTokenSource cancellationToken = null)
        {
            var setNewGameSettingsFunction = new SetNewGameSettingsFunction();
                setNewGameSettingsFunction.NewSettings = newSettings;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setNewGameSettingsFunction, cancellationToken);
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

        public Task<string> UpgradeEngineRequestAsync(UpgradeEngineFunction upgradeEngineFunction)
        {
             return ContractHandler.SendRequestAsync(upgradeEngineFunction);
        }

        public Task<TransactionReceipt> UpgradeEngineRequestAndWaitForReceiptAsync(UpgradeEngineFunction upgradeEngineFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(upgradeEngineFunction, cancellationToken);
        }

        public Task<string> UpgradeEngineRequestAsync(BigInteger carId)
        {
            var upgradeEngineFunction = new UpgradeEngineFunction();
                upgradeEngineFunction.CarId = carId;
            
             return ContractHandler.SendRequestAsync(upgradeEngineFunction);
        }

        public Task<TransactionReceipt> UpgradeEngineRequestAndWaitForReceiptAsync(BigInteger carId, CancellationTokenSource cancellationToken = null)
        {
            var upgradeEngineFunction = new UpgradeEngineFunction();
                upgradeEngineFunction.CarId = carId;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(upgradeEngineFunction, cancellationToken);
        }

        public Task<string> UpgradeHandlingRequestAsync(UpgradeHandlingFunction upgradeHandlingFunction)
        {
             return ContractHandler.SendRequestAsync(upgradeHandlingFunction);
        }

        public Task<TransactionReceipt> UpgradeHandlingRequestAndWaitForReceiptAsync(UpgradeHandlingFunction upgradeHandlingFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(upgradeHandlingFunction, cancellationToken);
        }

        public Task<string> UpgradeHandlingRequestAsync(BigInteger carId)
        {
            var upgradeHandlingFunction = new UpgradeHandlingFunction();
                upgradeHandlingFunction.CarId = carId;
            
             return ContractHandler.SendRequestAsync(upgradeHandlingFunction);
        }

        public Task<TransactionReceipt> UpgradeHandlingRequestAndWaitForReceiptAsync(BigInteger carId, CancellationTokenSource cancellationToken = null)
        {
            var upgradeHandlingFunction = new UpgradeHandlingFunction();
                upgradeHandlingFunction.CarId = carId;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(upgradeHandlingFunction, cancellationToken);
        }

        public Task<string> UpgradeNosRequestAsync(UpgradeNosFunction upgradeNosFunction)
        {
             return ContractHandler.SendRequestAsync(upgradeNosFunction);
        }

        public Task<TransactionReceipt> UpgradeNosRequestAndWaitForReceiptAsync(UpgradeNosFunction upgradeNosFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(upgradeNosFunction, cancellationToken);
        }

        public Task<string> UpgradeNosRequestAsync(BigInteger carId)
        {
            var upgradeNosFunction = new UpgradeNosFunction();
                upgradeNosFunction.CarId = carId;
            
             return ContractHandler.SendRequestAsync(upgradeNosFunction);
        }

        public Task<TransactionReceipt> UpgradeNosRequestAndWaitForReceiptAsync(BigInteger carId, CancellationTokenSource cancellationToken = null)
        {
            var upgradeNosFunction = new UpgradeNosFunction();
                upgradeNosFunction.CarId = carId;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(upgradeNosFunction, cancellationToken);
        }
    }
}
