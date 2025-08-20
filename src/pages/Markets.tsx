import React from 'react';
import { useLending } from '../context/LendingContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Info,
  ArrowUpRight
} from 'lucide-react';

const Markets: React.FC = () => {
  const { lendingPools } = useLending();

  const totalTVL = lendingPools.reduce((sum, pool) => 
    sum + parseFloat(pool.totalSupply), 0
  );

  const totalBorrowed = lendingPools.reduce((sum, pool) => 
    sum + parseFloat(pool.totalBorrow), 0
  );

  const averageSupplyAPY = lendingPools.reduce((sum, pool) => 
    sum + pool.supplyAPY, 0
  ) / lendingPools.length;

  const averageBorrowAPY = lendingPools.reduce((sum, pool) => 
    sum + pool.borrowAPY, 0
  ) / lendingPools.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Markets</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of all lending markets and their current rates
        </p>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total TVL
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalTVL.toLocaleString()}
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
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Supplied
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${totalTVL.toLocaleString()}
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
                    ${totalBorrowed.toLocaleString()}
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
                  <BarChart3 className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Supply APY
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {averageSupplyAPY.toFixed(2)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Markets Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Markets</h3>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Supply
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Borrow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supply APY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrow APY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max LTV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lendingPools.map((pool) => (
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
                    <div className="text-sm text-gray-900">
                      ${parseFloat(pool.totalSupply).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${parseFloat(pool.totalBorrow).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {pool.supplyAPY}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-red-600">
                      {pool.borrowAPY}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${pool.utilizationRate}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">
                        {pool.utilizationRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {pool.maxLTV}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 transition-colors">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Supply
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Borrow
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supply Rates */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Supply Rates</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lendingPools.map((pool) => (
                <div key={pool.asset.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{pool.asset.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {pool.asset.symbol}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pool.asset.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {pool.supplyAPY}%
                    </div>
                    <div className="text-sm text-gray-500">
                      APY
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Borrow Rates */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Borrow Rates</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lendingPools.map((pool) => (
                <div key={pool.asset.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{pool.asset.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {pool.asset.symbol}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pool.asset.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {pool.borrowAPY}%
                    </div>
                    <div className="text-sm text-gray-500">
                      APY
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Parameters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Risk Parameters</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lendingPools.map((pool) => (
              <div key={pool.asset.symbol} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">{pool.asset.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {pool.asset.symbol}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pool.asset.name}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Max LTV:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {pool.maxLTV}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Liquidation Threshold:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {pool.liquidationThreshold}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Liquidation Penalty:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {pool.liquidationPenalty}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Information */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-start">
          <Info className="h-6 w-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-green-900 mb-2">
              Understanding Lending Markets
            </h3>
            <div className="text-green-800 space-y-2">
              <p>
                <strong>Supply APY:</strong> The annual percentage yield you earn by supplying assets to the protocol.
              </p>
              <p>
                <strong>Borrow APY:</strong> The annual percentage rate you pay when borrowing assets.
              </p>
              <p>
                <strong>Max LTV:</strong> Maximum loan-to-value ratio allowed when using an asset as collateral.
              </p>
              <p>
                <strong>Utilization Rate:</strong> Percentage of supplied assets that are currently borrowed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets; 