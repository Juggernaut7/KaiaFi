import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useLending } from '../context/LendingContext';
import { Asset } from '../types';
import { 
  Wallet, 
  AlertTriangle,
  Info,
  ArrowDownRight,
  Shield,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const Borrowing: React.FC = () => {
  const { isConnected } = useWeb3();
  const { lendingPools, userPositions, borrow, repay, getMaxBorrowAmount, calculateHealthFactor } = useLending();
  
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [collateralAsset, setCollateralAsset] = useState<Asset | null>(null);
  const [action, setAction] = useState<'borrow' | 'repay'>('borrow');
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleBorrow = async () => {
    if (!selectedAsset || !collateralAsset || !amount) return;
    
    try {
      const tx = await borrow(selectedAsset, amount, collateralAsset);
      toast.success(`Successfully borrowed ${amount} ${selectedAsset.symbol}!`);
      setAmount('');
      setShowModal(false);
    } catch (error) {
      toast.error('Borrow failed. Please try again.');
    }
  };

  const handleRepay = async () => {
    if (!selectedAsset || !amount) return;
    
    try {
      const tx = await repay(selectedAsset, amount);
      toast.success(`Successfully repaid ${amount} ${selectedAsset.symbol}!`);
      setAmount('');
      setShowModal(false);
    } catch (error) {
      toast.error('Repay failed. Please try again.');
    }
  };

  const getUserPosition = (asset: Asset) => {
    return userPositions.find(pos => pos.asset.symbol === asset.symbol);
  };

  const getMaxBorrow = (asset: Asset) => {
    if (!collateralAsset) return '0';
    const collateralPosition = getUserPosition(collateralAsset);
    if (!collateralPosition) return '0';
    return getMaxBorrowAmount(collateralAsset, collateralPosition.supplied);
  };

  const getHealthFactorAfterBorrow = (borrowAmount: string) => {
    if (!collateralAsset || !selectedAsset) return 999;
    
    const collateralPosition = getUserPosition(collateralAsset);
    if (!collateralPosition) return 999;
    
    const currentBorrowed = parseFloat(borrowAmount);
    const totalCollateral = parseFloat(collateralPosition.collateralValue);
    
    if (currentBorrowed === 0) return 999;
    return totalCollateral / currentBorrowed;
  };

  const openModal = (asset: Asset, actionType: 'borrow' | 'repay') => {
    setSelectedAsset(asset);
    setAction(actionType);
    setAmount('');
    setShowModal(true);
  };

  const availableCollateral = userPositions.filter(pos => parseFloat(pos.supplied) > 0);
  const borrowedAssets = userPositions.filter(pos => parseFloat(pos.borrowed) > 0);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Wallet Not Connected
        </h3>
        <p className="text-gray-600">
          Please connect your wallet to start borrowing assets.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Borrowing</h1>
        <p className="mt-2 text-sm text-gray-700">
          Borrow assets using your supplied assets as collateral
        </p>
      </div>

      {/* Health Factor Warning */}
      {borrowedAssets.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Monitor Your Health Factor</p>
              <p className="mt-1">
                Keep your health factor above 1.5 to avoid liquidation. 
                Current health factor: <span className="font-medium">{calculateHealthFactor(userPositions).toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Available Collateral */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Available Collateral</h3>
        </div>
        <div className="p-6">
          {availableCollateral.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCollateral.map((position) => (
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
                  
                  <div className="space-y-2 mb-4">
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
                      <span className="text-sm text-gray-500">Max Borrow:</span>
                      <span className="text-sm font-medium text-green-600">
                        ${getMaxBorrowAmount(position.asset, position.supplied)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setCollateralAsset(position.asset);
                      openModal(lendingPools[0].asset, 'borrow');
                    }}
                    className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Use as Collateral
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Collateral Available
              </h3>
              <p className="text-gray-600 mb-4">
                You need to supply assets first to use them as collateral for borrowing.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Borrowing Markets */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Borrowing Markets</h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Your Borrow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrow APY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Borrow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lendingPools.map((pool) => {
                const userPosition = getUserPosition(pool.asset);
                const hasBorrowed = userPosition && parseFloat(userPosition.borrowed) > 0;
                
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
                      {hasBorrowed ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {parseFloat(userPosition!.borrowed).toFixed(2)} {pool.asset.symbol}
                          </div>
                          <div className="text-sm text-gray-500">
                            ≈ ${userPosition!.borrowValue}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No borrow</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">
                        {pool.borrowAPY}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${parseFloat(pool.totalBorrow).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(pool.asset, 'borrow')}
                          disabled={availableCollateral.length === 0}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                        >
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          Borrow
                        </button>
                        {hasBorrowed && (
                          <button
                            onClick={() => openModal(pool.asset, 'repay')}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            Repay
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

      {/* Borrow/Repay Modal */}
      {showModal && selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {action === 'borrow' ? 'Borrow' : 'Repay'} {selectedAsset.symbol}
              </h3>
            </div>
            
            <div className="px-6 py-4">
              {action === 'borrow' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collateral Asset
                  </label>
                  <select
                    value={collateralAsset?.symbol || ''}
                    onChange={(e) => {
                      const asset = availableCollateral.find(pos => pos.asset.symbol === e.target.value)?.asset;
                      setCollateralAsset(asset || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select collateral</option>
                    {availableCollateral.map((pos) => (
                      <option key={pos.asset.symbol} value={pos.asset.symbol}>
                        {pos.asset.symbol} - ${pos.collateralValue}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-gray-500 text-sm">{selectedAsset.symbol}</span>
                  </div>
                </div>
                {action === 'borrow' && (
                  <div className="mt-2 text-sm text-gray-500">
                    Max: {getMaxBorrow(selectedAsset)} {selectedAsset.symbol}
                  </div>
                )}
              </div>
              
              {action === 'borrow' && collateralAsset && amount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Health Factor After Borrow:</p>
                      <p className="mt-1">
                        {getHealthFactorAfterBorrow(amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={action === 'borrow' ? handleBorrow : handleRepay}
                disabled={!amount || (action === 'borrow' && !collateralAsset)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {action === 'borrow' ? 'Borrow' : 'Repay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Borrowing; 