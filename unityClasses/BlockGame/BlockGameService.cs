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
using BlockGame.BlockGame.ContractDefinition;

namespace BlockGame.BlockGame
{
    public partial class BlockGameService
    {
        public static Task<TransactionReceipt> DeployContractAndWaitForReceiptAsync(Nethereum.Web3.Web3 web3, BlockGameDeployment blockGameDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            return web3.Eth.GetContractDeploymentHandler<BlockGameDeployment>().SendRequestAndWaitForReceiptAsync(blockGameDeployment, cancellationTokenSource);
        }

        public static Task<string> DeployContractAsync(Nethereum.Web3.Web3 web3, BlockGameDeployment blockGameDeployment)
        {
            return web3.Eth.GetContractDeploymentHandler<BlockGameDeployment>().SendRequestAsync(blockGameDeployment);
        }

        public static async Task<BlockGameService> DeployContractAndGetServiceAsync(Nethereum.Web3.Web3 web3, BlockGameDeployment blockGameDeployment, CancellationTokenSource cancellationTokenSource = null)
        {
            var receipt = await DeployContractAndWaitForReceiptAsync(web3, blockGameDeployment, cancellationTokenSource);
            return new BlockGameService(web3, receipt.ContractAddress);
        }

        protected Nethereum.Web3.IWeb3 Web3{ get; }

        public ContractHandler ContractHandler { get; }

        public BlockGameService(Nethereum.Web3.Web3 web3, string contractAddress)
        {
            Web3 = web3;
            ContractHandler = web3.Eth.GetContractHandler(contractAddress);
        }

        public BlockGameService(Nethereum.Web3.IWeb3 web3, string contractAddress)
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

        public Task<string> FeeAccountQueryAsync(FeeAccountFunction feeAccountFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<FeeAccountFunction, string>(feeAccountFunction, blockParameter);
        }

        
        public Task<string> FeeAccountQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<FeeAccountFunction, string>(null, blockParameter);
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

        public Task<BigInteger> GetItemsCountQueryAsync(GetItemsCountFunction getItemsCountFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetItemsCountFunction, BigInteger>(getItemsCountFunction, blockParameter);
        }

        
        public Task<BigInteger> GetItemsCountQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetItemsCountFunction, BigInteger>(null, blockParameter);
        }

        public Task<List<List<BigInteger>>> GetItemsDataQueryAsync(GetItemsDataFunction getItemsDataFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetItemsDataFunction, List<List<BigInteger>>>(getItemsDataFunction, blockParameter);
        }

        
        public Task<List<List<BigInteger>>> GetItemsDataQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetItemsDataFunction, List<List<BigInteger>>>(null, blockParameter);
        }

        public Task<BigInteger> GetNumberOfObjectsMintedQueryAsync(GetNumberOfObjectsMintedFunction getNumberOfObjectsMintedFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetNumberOfObjectsMintedFunction, BigInteger>(getNumberOfObjectsMintedFunction, blockParameter);
        }

        
        public Task<BigInteger> GetNumberOfObjectsMintedQueryAsync(BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetNumberOfObjectsMintedFunction, BigInteger>(null, blockParameter);
        }

        public Task<List<byte>> GetObjectStatsQueryAsync(GetObjectStatsFunction getObjectStatsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetObjectStatsFunction, List<byte>>(getObjectStatsFunction, blockParameter);
        }

        
        public Task<List<byte>> GetObjectStatsQueryAsync(BigInteger objectId, BlockParameter blockParameter = null)
        {
            var getObjectStatsFunction = new GetObjectStatsFunction();
                getObjectStatsFunction.ObjectId = objectId;
            
            return ContractHandler.QueryAsync<GetObjectStatsFunction, List<byte>>(getObjectStatsFunction, blockParameter);
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

        public Task<List<BigInteger>> GetUserObjectsQueryAsync(GetUserObjectsFunction getUserObjectsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<GetUserObjectsFunction, List<BigInteger>>(getUserObjectsFunction, blockParameter);
        }

        
        public Task<List<BigInteger>> GetUserObjectsQueryAsync(string account, BlockParameter blockParameter = null)
        {
            var getUserObjectsFunction = new GetUserObjectsFunction();
                getUserObjectsFunction.Account = account;
            
            return ContractHandler.QueryAsync<GetUserObjectsFunction, List<BigInteger>>(getUserObjectsFunction, blockParameter);
        }

        public Task<GetUserObjectsWithStatsOutputDTO> GetUserObjectsWithStatsQueryAsync(GetUserObjectsWithStatsFunction getUserObjectsWithStatsFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryDeserializingToObjectAsync<GetUserObjectsWithStatsFunction, GetUserObjectsWithStatsOutputDTO>(getUserObjectsWithStatsFunction, blockParameter);
        }

        public Task<GetUserObjectsWithStatsOutputDTO> GetUserObjectsWithStatsQueryAsync(string account, BlockParameter blockParameter = null)
        {
            var getUserObjectsWithStatsFunction = new GetUserObjectsWithStatsFunction();
                getUserObjectsWithStatsFunction.Account = account;
            
            return ContractHandler.QueryDeserializingToObjectAsync<GetUserObjectsWithStatsFunction, GetUserObjectsWithStatsOutputDTO>(getUserObjectsWithStatsFunction, blockParameter);
        }

        public Task<bool> IsObjectOwnerQueryAsync(IsObjectOwnerFunction isObjectOwnerFunction, BlockParameter blockParameter = null)
        {
            return ContractHandler.QueryAsync<IsObjectOwnerFunction, bool>(isObjectOwnerFunction, blockParameter);
        }

        
        public Task<bool> IsObjectOwnerQueryAsync(BigInteger objectId, string account, BlockParameter blockParameter = null)
        {
            var isObjectOwnerFunction = new IsObjectOwnerFunction();
                isObjectOwnerFunction.ObjectId = objectId;
                isObjectOwnerFunction.Account = account;
            
            return ContractHandler.QueryAsync<IsObjectOwnerFunction, bool>(isObjectOwnerFunction, blockParameter);
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

        public Task<string> MintObjectRequestAsync(MintObjectFunction mintObjectFunction)
        {
             return ContractHandler.SendRequestAsync(mintObjectFunction);
        }

        public Task<TransactionReceipt> MintObjectRequestAndWaitForReceiptAsync(MintObjectFunction mintObjectFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(mintObjectFunction, cancellationToken);
        }

        public Task<string> MintObjectRequestAsync(byte objectType)
        {
            var mintObjectFunction = new MintObjectFunction();
                mintObjectFunction.ObjectType = objectType;
            
             return ContractHandler.SendRequestAsync(mintObjectFunction);
        }

        public Task<TransactionReceipt> MintObjectRequestAndWaitForReceiptAsync(byte objectType, CancellationTokenSource cancellationToken = null)
        {
            var mintObjectFunction = new MintObjectFunction();
                mintObjectFunction.ObjectType = objectType;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(mintObjectFunction, cancellationToken);
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

        
        public Task<string> SerializePropertiesQueryAsync(BigInteger objectId, BlockParameter blockParameter = null)
        {
            var serializePropertiesFunction = new SerializePropertiesFunction();
                serializePropertiesFunction.ObjectId = objectId;
            
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

        public Task<string> SetFeeAccountRequestAsync(SetFeeAccountFunction setFeeAccountFunction)
        {
             return ContractHandler.SendRequestAsync(setFeeAccountFunction);
        }

        public Task<TransactionReceipt> SetFeeAccountRequestAndWaitForReceiptAsync(SetFeeAccountFunction setFeeAccountFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setFeeAccountFunction, cancellationToken);
        }

        public Task<string> SetFeeAccountRequestAsync(string newFeeAccount)
        {
            var setFeeAccountFunction = new SetFeeAccountFunction();
                setFeeAccountFunction.NewFeeAccount = newFeeAccount;
            
             return ContractHandler.SendRequestAsync(setFeeAccountFunction);
        }

        public Task<TransactionReceipt> SetFeeAccountRequestAndWaitForReceiptAsync(string newFeeAccount, CancellationTokenSource cancellationToken = null)
        {
            var setFeeAccountFunction = new SetFeeAccountFunction();
                setFeeAccountFunction.NewFeeAccount = newFeeAccount;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setFeeAccountFunction, cancellationToken);
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

        public Task<string> SetPricesForItemRequestAsync(SetPricesForItemFunction setPricesForItemFunction)
        {
             return ContractHandler.SendRequestAsync(setPricesForItemFunction);
        }

        public Task<TransactionReceipt> SetPricesForItemRequestAndWaitForReceiptAsync(SetPricesForItemFunction setPricesForItemFunction, CancellationTokenSource cancellationToken = null)
        {
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setPricesForItemFunction, cancellationToken);
        }

        public Task<string> SetPricesForItemRequestAsync(byte item, List<ushort> prices)
        {
            var setPricesForItemFunction = new SetPricesForItemFunction();
                setPricesForItemFunction.Item = item;
                setPricesForItemFunction.Prices = prices;
            
             return ContractHandler.SendRequestAsync(setPricesForItemFunction);
        }

        public Task<TransactionReceipt> SetPricesForItemRequestAndWaitForReceiptAsync(byte item, List<ushort> prices, CancellationTokenSource cancellationToken = null)
        {
            var setPricesForItemFunction = new SetPricesForItemFunction();
                setPricesForItemFunction.Item = item;
                setPricesForItemFunction.Prices = prices;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(setPricesForItemFunction, cancellationToken);
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

        public Task<string> UpgradeRequestAsync(BigInteger objectId, byte item)
        {
            var upgradeFunction = new UpgradeFunction();
                upgradeFunction.ObjectId = objectId;
                upgradeFunction.Item = item;
            
             return ContractHandler.SendRequestAsync(upgradeFunction);
        }

        public Task<TransactionReceipt> UpgradeRequestAndWaitForReceiptAsync(BigInteger objectId, byte item, CancellationTokenSource cancellationToken = null)
        {
            var upgradeFunction = new UpgradeFunction();
                upgradeFunction.ObjectId = objectId;
                upgradeFunction.Item = item;
            
             return ContractHandler.SendRequestAndWaitForReceiptAsync(upgradeFunction, cancellationToken);
        }
    }
}
