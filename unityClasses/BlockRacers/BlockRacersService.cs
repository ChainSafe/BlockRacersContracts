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

        public Task<string> TokenQueryAsync(TokenFunction tokenFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TokenFunction, string>(tokenFunction, blockParameter);
        }

        
        public Task<string> TokenQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TokenFunction, string>(null, blockParameter);
        }

        public Task<BigInteger> TokenUnitQueryAsync(TokenUnitFunction tokenUnitFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TokenUnitFunction, BigInteger>(tokenUnitFunction, blockParameter);
        }

        
        public Task<BigInteger> TokenUnitQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<TokenUnitFunction, BigInteger>(null, blockParameter);
        }

        public Task<string> BlockRacersFeeAccountQueryAsync(BlockRacersFeeAccountFunction blockRacersFeeAccountFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<BlockRacersFeeAccountFunction, string>(blockRacersFeeAccountFunction, blockParameter);
        }

        
        public Task<string> BlockRacersFeeAccountQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<BlockRacersFeeAccountFunction, string>(null, blockParameter);
        }

        public Task<List<byte>> GetCarStatsQueryAsync(GetCarStatsFunction getCarStatsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetCarStatsFunction, List<byte>>(getCarStatsFunction, blockParameter);
        }

        
        public Task<List<byte>> GetCarStatsQueryAsync(BigInteger carId, BlockParameter blockParameter = null)
        {
            var getCarStatsFunction = new GetCarStatsFunction();
                getCarStatsFunction.CarId = carId;
            
            return ContractHandler.QueryAsync<GetCarStatsFunction, List<byte>>(getCarStatsFunction, blockParameter);
        }

        public Task<List<BigInteger>> GetItemDataQueryAsync(GetItemDataFunction getItemDataFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetItemDataFunction, List<BigInteger>>(getItemDataFunction, blockParameter);
        }

        
        public Task<List<BigInteger>> GetItemDataQueryAsync(byte itemType, BlockParameter blockParameter = null)
        {
            var getItemDataFunction = new GetItemDataFunction();
                getItemDataFunction.ItemType = itemType;
            
            return ContractHandler.QueryAsync<GetItemDataFunction, List<BigInteger>>(getItemDataFunction, blockParameter);
        }

        public Task<List<List<BigInteger>>> GetItemsDataQueryAsync(GetItemsDataFunction getItemsDataFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetItemsDataFunction, List<List<BigInteger>>>(getItemsDataFunction, blockParameter);
        }

        
        public Task<List<List<BigInteger>>> GetItemsDataQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetItemsDataFunction, List<List<BigInteger>>>(null, blockParameter);
        }

        public Task<BigInteger> GetNumberOfCarsMintedQueryAsync(GetNumberOfCarsMintedFunction getNumberOfCarsMintedFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetNumberOfCarsMintedFunction, BigInteger>(getNumberOfCarsMintedFunction, blockParameter);
        }

        
        public Task<BigInteger> GetNumberOfCarsMintedQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetNumberOfCarsMintedFunction, BigInteger>(null, blockParameter);
        }

        public Task<BigInteger> GetPriceQueryAsync(GetPriceFunction getPriceFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetPriceFunction, BigInteger>(getPriceFunction, blockParameter);
        }

        
        public Task<BigInteger> GetPriceQueryAsync(byte item, byte level, BlockParameter blockParameter = null)
        {
            var getPriceFunction = new GetPriceFunction();
                getPriceFunction.Item = item;
                getPriceFunction.Level = level;
            
            return ContractHandler.QueryAsync<GetPriceFunction, BigInteger>(getPriceFunction, blockParameter);
        }

        public Task<List<BigInteger>> GetUserCarsQueryAsync(GetUserCarsFunction getUserCarsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetUserCarsFunction, List<BigInteger>>(getUserCarsFunction, blockParameter);
        }

        
        public Task<List<BigInteger>> GetUserCarsQueryAsync(string account, BlockParameter blockParameter = null)
        {
            var getUserCarsFunction = new GetUserCarsFunction();
                getUserCarsFunction.Account = account;
            
            return ContractHandler.QueryAsync<GetUserCarsFunction, List<BigInteger>>(getUserCarsFunction, blockParameter);
        }

        public Task<bool> IsCarOwnerQueryAsync(IsCarOwnerFunction isCarOwnerFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<IsCarOwnerFunction, bool>(isCarOwnerFunction, blockParameter);
        }

        
        public Task<bool> IsCarOwnerQueryAsync(BigInteger carId, string account, BlockParameter blockParameter = null)
        {
            var isCarOwnerFunction = new IsCarOwnerFunction();
                isCarOwnerFunction.CarId = carId;
                isCarOwnerFunction.Account = account;
            
            return ContractHandler.QueryAsync<IsCarOwnerFunction, bool>(isCarOwnerFunction, blockParameter);
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

        public Task<string> MintCarRequestAsync(byte carLevel)
        {
            var mintCarFunction = new MintCarFunction();
                mintCarFunction.CarLevel = carLevel;
            
             return ContractHandler.SendRequestAsync(mintCarFunction);
        }

        public Task<TransactionReceipt> MintCarRequestAndWaitForReceiptAsync(byte carLevel, CancellationTokenSource cancellationToken = null)
        {
            var mintCarFunction = new MintCarFunction();
                mintCarFunction.CarLevel = carLevel;
            
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

        public Task<string> SerializePropertiesQueryAsync(SerializePropertiesFunction serializePropertiesFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<SerializePropertiesFunction, string>(serializePropertiesFunction, blockParameter);
        }

        
        public Task<string> SerializePropertiesQueryAsync(BigInteger carId, BlockParameter blockParameter = null)
        {
            var serializePropertiesFunction = new SerializePropertiesFunction();
                serializePropertiesFunction.CarId = carId;
            
            return ContractHandler.QueryAsync<SerializePropertiesFunction, string>(serializePropertiesFunction, blockParameter);
        }

        public Task<string> SetBaseUriRequestAsync(SetBaseUriFunction setBaseUriFunction)
        {
             return ContractHandler.SendRequestAsync(setBaseUriFunction);
        }

        public Task<TransactionReceipt> SetBaseUriRequestAndWaitForReceiptAsync(SetBaseUriFunction setBaseUriFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setBaseUriFunction, cancellationToken);
        }

        public Task<string> SetBaseUriRequestAsync(string uri)
        {
            var setBaseUriFunction = new SetBaseUriFunction();
                setBaseUriFunction.Uri = uri;
            
             return ContractHandler.SendRequestAsync(setBaseUriFunction);
        }

        public Task<TransactionReceipt> SetBaseUriRequestAndWaitForReceiptAsync(string uri, CancellationTokenSource cancellationToken = null)
        {
            var setBaseUriFunction = new SetBaseUriFunction();
                setBaseUriFunction.Uri = uri;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setBaseUriFunction, cancellationToken);
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

        public Task<string> SetPricesRequestAsync(SetPricesFunction setPricesFunction)
        {
             return ContractHandler.SendRequestAsync(setPricesFunction);
        }

        public Task<TransactionReceipt> SetPricesRequestAndWaitForReceiptAsync(SetPricesFunction setPricesFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setPricesFunction, cancellationToken);
        }

        public Task<string> SetPricesRequestAsync(List<List<ushort>> prices)
        {
            var setPricesFunction = new SetPricesFunction();
                setPricesFunction.Prices = prices;
            
             return ContractHandler.SendRequestAsync(setPricesFunction);
        }

        public Task<TransactionReceipt> SetPricesRequestAndWaitForReceiptAsync(List<List<ushort>> prices, CancellationTokenSource cancellationToken = null)
        {
            var setPricesFunction = new SetPricesFunction();
                setPricesFunction.Prices = prices;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setPricesFunction, cancellationToken);
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

        public Task<string> UpgradeRequestAsync(UpgradeFunction upgradeFunction)
        {
             return ContractHandler.SendRequestAsync(upgradeFunction);
        }

        public Task<TransactionReceipt> UpgradeRequestAndWaitForReceiptAsync(UpgradeFunction upgradeFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(upgradeFunction, cancellationToken);
        }

        public Task<string> UpgradeRequestAsync(BigInteger carId, byte item)
        {
            var upgradeFunction = new UpgradeFunction();
                upgradeFunction.CarId = carId;
                upgradeFunction.Item = item;
            
             return ContractHandler.SendRequestAsync(upgradeFunction);
        }

        public Task<TransactionReceipt> UpgradeRequestAndWaitForReceiptAsync(BigInteger carId, byte item, CancellationTokenSource cancellationToken = null)
        {
            var upgradeFunction = new UpgradeFunction();
                upgradeFunction.CarId = carId;
                upgradeFunction.Item = item;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(upgradeFunction, cancellationToken);
        }
    }
}
