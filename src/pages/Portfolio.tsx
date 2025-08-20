import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useLending } from '../context/LendingContext';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Shield,
  Clock,
  ExternalLink
} from 'lucide-react';

const Portfolio: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const { userPositions, userTransactions, calculateHealthFactor } = useLending();

  const totalSupplied = userPositions.reduce((sum, pos) => 
    sum + parseFloat(pos.collateralValue), 0
  );

  const totalBorrowed = userPositions.reduce((sum, pos) => 
    sum + parseFloat(pos.borrowValue), 0
  );

  const healthFactor = calculateHealthFactor(userPositions);
  const netWorth = totalSupplied - totalBorrowed;

  const getHealthFactorColor = (hf: number) => {
    if (hf >= 2) return 'text-green-600';
    if (hf >= 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthFactorStatus = (hf: number) => {
    if (hf >= 2) return 'Healthy';
    if (hf >= 1.5) return 'Warning';
    return 'Danger';
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Wallet Not Connected
        </h3>
        <p className="text-gray-600">
          Please connect your wallet to view your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of your lending and borrowing positions
        </p>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Supplied
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalSupplied.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Borrowed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalBorrowed.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Net Worth
                  </dt>
                  <dd className={`text-lg font-medium ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netWorth.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Health Factor
                  </dt>
                  <dd className={`text-lg font-medium ${getHealthFactorColor(healthFactor)}`}>
                    {healthFactor.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Factor Warning */}
      {healthFactor < 2 && (
        <div className={`border rounded-lg p-4 ${
          healthFactor < 1.5 
            ? 'bg-red-50 border-red-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start">
            <Shield className={`h-5 w-5 mt-0.5 mr-2 flex-shrink-0 ${
              healthFactor < 1.5 ? 'text-red-600' : 'text-yellow-600'
            }`} />
            <div className={`text-sm ${
              healthFactor < 1.5 ? 'text-red-800' : 'text-yellow-800'
            }`}>
              <p className="font-medium">
                Health Factor: {getHealthFactorStatus(healthFactor)}
              </p>
              <p className="mt-1">
                {healthFactor < 1.5 
                  ? 'Your position is at risk of liquidation. Consider repaying debt or adding collateral.'
                  : 'Monitor your health factor closely. Consider repaying some debt to improve your position.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Asset Positions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Asset Positions</h3>
        </div>
        <div className="p-6">
          {userPositions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPositions.map((position) => (
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
                    {parseFloat(position.supplied) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Supplied:</span>
                        <span className="text-sm font-medium text-green-600">
                          {parseFloat(position.supplied).toFixed(2)} {position.asset.symbol}
                        </span>
                      </div>
                    )}
                    {parseFloat(position.borrowed) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Borrowed:</span>
                        <span className="text-sm font-medium text-red-600">
                          {parseFloat(position.borrowed).toFixed(2)} {position.asset.symbol}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Value:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${position.collateralValue}
                      </span>
                    </div>
                    {parseFloat(position.borrowed) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Borrow Value:</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${position.borrowValue}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <PieChart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Positions
              </h3>
              <p className="text-gray-600">
                Start lending and borrowing to see your positions here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="p-6">
          {userTransactions.length > 0 ? (
            <div className="space-y-4">
              {userTransactions.slice(0, 10).map((tx) => (
                <div key={tx.hash} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'supply' ? 'bg-green-100' : 
                      tx.type === 'withdraw' ? 'bg-blue-100' :
                      tx.type === 'borrow' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      {tx.type === 'supply' && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {tx.type === 'withdraw' && <TrendingDown className="h-4 w-4 text-blue-600" />}
                      {tx.type === 'borrow' && <TrendingDown className="h-4 w-4 text-purple-600" />}
                      {tx.type === 'repay' && <TrendingUp className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {tx.type} {tx.asset.symbol}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {tx.amount} {tx.asset.symbol}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Transactions
              </h3>
              <p className="text-gray-600">
                Your transaction history will appear here once you start using the protocol.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Wallet Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address
              </label>
              <div className="flex items-center space-x-2">
                <code className="px-3 py-2 bg-gray-100 rounded text-sm font-mono">
                  {account}
                </code>
                <button className="text-green-600 hover:text-green-700">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network
              </label>
              <div className="px-3 py-2 bg-green-100 text-green-800 rounded text-sm font-medium">
                Kaia Testnet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio; 