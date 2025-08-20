import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { useLending } from '../context/LendingContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isConnected } = useWeb3();
  const { marketData, userPositions, lendingPools } = useLending();

  const totalUserValue = userPositions.reduce((sum, pos) => 
    sum + parseFloat(pos.collateralValue), 0
  );

  const totalUserBorrowed = userPositions.reduce((sum, pos) => 
    sum + parseFloat(pos.borrowValue), 0
  );

  const healthFactor = totalUserBorrowed > 0 ? totalUserValue / totalUserBorrowed : 999;

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome to KaiaFi - Your DeFi Lending Hub on Kaia Network
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {isConnected ? (
            <div className="flex space-x-3">
              <Link
                to="/lending"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Supply Assets
              </Link>
              <Link
                to="/borrowing"
                className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors"
              >
                <Minus className="h-4 w-4 mr-2" />
                Borrow Assets
              </Link>
            </div>
          ) : (
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                Connect your wallet to start lending and borrowing
              </p>
            </div>
          )}
        </div>
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
                    Total Value Locked
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${parseFloat(marketData.totalValueLocked).toLocaleString()}
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
                    ${parseFloat(marketData.totalSupplied).toLocaleString()}
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
                    ${parseFloat(marketData.totalBorrowed).toLocaleString()}
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
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average APY
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {marketData.averageAPY.toFixed(2)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Portfolio Summary */}
      {isConnected && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Your Portfolio</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Total Supplied</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  ${totalUserValue.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Total Borrowed</p>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  ${totalUserBorrowed.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Health Factor</p>
                <p className={`mt-2 text-3xl font-bold ${getHealthFactorColor(healthFactor)}`}>
                  {healthFactor.toFixed(2)}
                </p>
                <p className={`text-sm font-medium ${getHealthFactorColor(healthFactor)}`}>
                  {getHealthFactorStatus(healthFactor)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Lending Pools */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Top Lending Pools</h3>
            <Link
              to="/markets"
              className="text-sm font-medium text-green-600 hover:text-green-500 flex items-center"
            >
              View all markets
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
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
                  Supply APY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lendingPools.slice(0, 3).map((pool) => (
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
                    <div className="text-sm font-medium text-green-600">
                      {pool.supplyAPY}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {pool.utilizationRate}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to="/lending"
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Supply
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-4">
            Start Earning with Supply
          </h3>
          <p className="text-green-700 mb-4">
            Deposit your assets and start earning competitive APY rates. 
            Your funds remain liquid and can be withdrawn anytime.
          </p>
          <Link
            to="/lending"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Start Supplying
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">
            Access Liquidity with Borrow
          </h3>
          <p className="text-blue-700 mb-4">
            Use your supplied assets as collateral to borrow other tokens. 
            Flexible borrowing with competitive interest rates.
          </p>
          <Link
            to="/borrowing"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Start Borrowing
            <ArrowDownRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 