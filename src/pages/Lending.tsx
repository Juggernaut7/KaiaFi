import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useLending } from '../context/LendingContext';
import { Asset } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight,
  Info,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';
import toast from 'react-hot-toast';

const Lending: React.FC = () => {
  const { isConnected } = useWeb3();
  const { lendingPools, userPositions, supply, withdraw, isLoading } = useLending();
  
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [action, setAction] = useState<'supply' | 'withdraw'>('supply');
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSupply = async () => {
    if (!selectedAsset || !amount) return;
    
    try {
      const tx = await supply(selectedAsset, amount);
      toast.success(`Successfully supplied ${amount} ${selectedAsset.symbol}!`);
      setAmount('');
      setShowModal(false);
    } catch (error) {
      toast.error('Supply failed. Please try again.');
    }
  };

  const handleWithdraw = async () => {
    if (!selectedAsset || !amount) return;
    
    try {
      const tx = await withdraw(selectedAsset, amount);
      toast.success(`Successfully withdrew ${amount} ${selectedAsset.symbol}!`);
      setAmount('');
      setShowModal(false);
    } catch (error) {
      toast.error('Withdraw failed. Please try again.');
    }
  };

  const getUserPosition = (asset: Asset) => {
    return userPositions.find(pos => pos.asset.symbol === asset.symbol);
  };

  const getMaxWithdraw = (asset: Asset) => {
    const position = getUserPosition(asset);
    return position ? position.supplied : '0';
  };

  const openModal = (asset: Asset, actionType: 'supply' | 'withdraw') => {
    setSelectedAsset(asset);
    setAction(actionType);
    setAmount('');
    setShowModal(true);
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Wallet Not Connected
        </h3>
        <p className="text-gray-600">
          Please connect your wallet to start lending and borrowing assets.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lending</h1>
        <p className="mt-2 text-sm text-gray-700">
          Supply your assets to earn interest and provide liquidity to the protocol
        </p>
      </div>

      {/* Market Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lending Markets</h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Your Supply
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supply APY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Supply
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lendingPools.map((pool) => {
                const userPosition = getUserPosition(pool.asset);
                const hasPosition = userPosition && parseFloat(userPosition.supplied) > 0;
                
                return (
                  <tr key={pool.asset.symbol} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{pool.asset.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {pool.asset.symbol}
                          </div>
                          <div className="text-sm text-gray-500">
                            {pool.asset.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hasPosition ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {parseFloat(userPosition!.supplied).toFixed(2)} {pool.asset.symbol}
                          </div>
                          <div className="text-sm text-gray-500">
                            ≈ ${userPosition!.collateralValue}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No supply</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {pool.supplyAPY}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${parseFloat(pool.totalSupply).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(pool.asset, 'supply')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Supply
                        </button>
                        {hasPosition && (
                          <button
                            onClick={() => openModal(pool.asset, 'withdraw')}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="h-3 w-3 mr-1" />
                            Withdraw
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Your Positions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Your Lending Positions</h3>
        </div>
        <div className="p-6">
          {userPositions.filter(pos => parseFloat(pos.supplied) > 0).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPositions
                .filter(pos => parseFloat(pos.supplied) > 0)
                .map((position) => (
                  <div key={position.asset.symbol} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{position.asset.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {position.asset.symbol}
                          </div>
                          <div className="text-sm text-gray-500">
                            {position.asset.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Supplied:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {parseFloat(position.supplied).toFixed(2)} {position.asset.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Value:</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${position.collateralValue}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">APY:</span>
                        <span className="text-sm font-medium text-green-600">
                          {position.asset.apy}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => openModal(position.asset, 'supply')}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Supply More
                      </button>
                      <button
                        onClick={() => openModal(position.asset, 'withdraw')}
                        className="flex-1 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Lending Positions
              </h3>
              <p className="text-gray-600 mb-4">
                Start earning interest by supplying your assets to the protocol.
              </p>
              <button
                onClick={() => openModal(lendingPools[0].asset, 'supply')}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Start Supplying
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Supply/Withdraw Modal */}
      {showModal && selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {action === 'supply' ? 'Supply' : 'Withdraw'} {selectedAsset.symbol}
              </h3>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-500 text-sm">{selectedAsset.symbol}</span>
                  </div>
                </div>
                {action === 'withdraw' && (
                  <div className="mt-2 text-sm text-gray-500">
                    Max: {getMaxWithdraw(selectedAsset)} {selectedAsset.symbol}
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">
                      {action === 'supply' ? 'Supply APY:' : 'Current Balance:'}
                    </p>
                    <p className="mt-1">
                      {action === 'supply' 
                        ? `${selectedAsset.apy}%` 
                        : `${getMaxWithdraw(selectedAsset)} ${selectedAsset.symbol}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={action === 'supply' ? handleSupply : handleWithdraw}
                disabled={!amount || isLoading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {isLoading ? 'Processing...' : (action === 'supply' ? 'Supply' : 'Withdraw')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lending; 