import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { useLending } from '../context/LendingContext';
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Plus, Minus, Activity, Target, Zap, Shield } from 'lucide-react';
import RealTimeAnalytics from '../components/RealTimeAnalytics';

const Dashboard: React.FC = () => {
  const { isConnected } = useWeb3();
  const { marketData, userPositions, lendingPools } = useLending();
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Calculate user portfolio data
  const totalUserValue = userPositions.reduce((total, position) => total + parseFloat(position.supplied || '0'), 0);
  const totalUserBorrowed = userPositions.reduce((total, position) => total + parseFloat(position.borrowed || '0'), 0);
  const healthFactor = 2.5; // Mock health factor

  const getHealthFactorColor = (factor: number) => {
    if (factor >= 2) return 'text-green-600';
    if (factor >= 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthFactorStatus = (factor: number) => {
    if (factor >= 2) return 'Excellent';
    if (factor >= 1.5) return 'Good';
    if (factor >= 1) return 'Warning';
    return 'Danger';
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Logo */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
        <div className="flex items-center space-x-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to KaiaFi
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Decentralized Lending & Borrowing on Kaia Network
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Korea Stablecoin Hackathon 2025 • Live on Kaia Kairos Testnet
            </p>
          </div>
        </div>
        
        {!isConnected ? (
          <div className="bg-white rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🚀 Get Started with DeFi
            </h3>
            <p className="text-gray-600 mb-4">
              Connect your wallet to start lending, borrowing, and earning on Kaia Network
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/lending"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start Lending
              </Link>
              <Link
                to="/borrowing"
                className="inline-flex items-center px-4 py-2 bg-white text-green-600 font-medium rounded-lg border border-green-300 hover:bg-green-50 transition-colors duration-200"
              >
                <Minus className="h-4 w-4 mr-2" />
                Start Borrowing
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Supplied</p>
                  <p className="text-2xl font-bold text-gray-900">${totalUserValue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Borrowed</p>
                  <p className="text-2xl font-bold text-gray-900">${totalUserBorrowed.toFixed(2)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Health Factor</p>
                  <p className={`text-2xl font-bold ${getHealthFactorColor(healthFactor)}`}>
                    {healthFactor.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{getHealthFactorStatus(healthFactor)}</p>
                </div>
                <Wallet className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Performance Analytics</h2>
            <div className="flex space-x-2">
              {['7d', '30d', '90d'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average APY</p>
                  <p className="text-2xl font-bold text-gray-900">5.2%</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+0.3%</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Volume</p>
                  <p className="text-2xl font-bold text-gray-900">$2.4M</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Protocol Safety</p>
                  <p className="text-xs text-gray-500">Audited & Secure</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">A+</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Liquidation Risk</p>
                  <p className="text-xs text-gray-500">Very Low</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-600">2.5%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Market Volatility</p>
                  <p className="text-xs text-gray-500">Stable</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-yellow-600">Low</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Analytics */}
      <RealTimeAnalytics />

      {/* Market Overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start">
              <div className="p-2 bg-green-100 rounded-xl flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500">Total Value Locked</p>
                <p className="text-xl font-semibold text-gray-900 truncate">${marketData.totalValueLocked}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-xl flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500">Total Supplied</p>
                <p className="text-xl font-semibold text-gray-900 truncate">${marketData.totalSupplied}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start">
              <div className="p-2 bg-purple-100 rounded-xl flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500">Total Borrowed</p>
                <p className="text-xl font-semibold text-gray-900 truncate">${marketData.totalBorrowed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start">
              <div className="p-2 bg-yellow-100 rounded-xl flex-shrink-0">
                <Wallet className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500">Average APY</p>
                <p className="text-xl font-semibold text-gray-900 truncate">{marketData.averageAPY}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Lending Pools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Top Lending Pools</h2>
          <Link
            to="/markets"
            className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
          >
            View All Markets
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
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
                          <div className="text-sm font-medium text-gray-900">{pool.asset.symbol}</div>
                          <div className="text-sm text-gray-500">{pool.asset.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${pool.totalSupply}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {pool.supplyAPY}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pool.utilizationRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to="/lending"
                        className="text-green-600 hover:text-green-700"
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
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/lending"
            className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                  Start Lending
                </h3>
                <p className="text-gray-600 mt-2">
                  Supply assets and earn interest on your deposits
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-200">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Link>
          
          <Link
            to="/borrowing"
            className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                  Start Borrowing
                </h3>
                <p className="text-gray-600 mt-2">
                  Borrow against your collateral with competitive rates
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-200">
                <Minus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 