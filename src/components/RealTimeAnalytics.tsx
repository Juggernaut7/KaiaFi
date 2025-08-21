import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Target, DollarSign } from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

const RealTimeAnalytics: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { symbol: 'USDT', price: 1.00, change24h: 0.02, volume24h: 45000000, marketCap: 95000000000 },
    { symbol: 'KAI', price: 0.85, change24h: -2.5, volume24h: 1200000, marketCap: 85000000 },
    { symbol: 'KRW', price: 0.00075, change24h: 1.8, volume24h: 850000, marketCap: 75000000 }
  ]);

  const [isLive, setIsLive] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        setMarketData(prev => prev.map(asset => ({
          ...asset,
          price: asset.price + (Math.random() - 0.5) * 0.01,
          change24h: asset.change24h + (Math.random() - 0.5) * 0.5
        })));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-900">Real-Time Market Data</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-500">{isLive ? 'LIVE' : 'PAUSED'}</span>
          </div>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
            isLive 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketData.map((asset) => (
          <div key={asset.symbol} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-gray-700">{asset.symbol}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{asset.symbol}</h3>
                  <p className="text-sm text-gray-500">${asset.price.toFixed(4)}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${
                asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {asset.change24h >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">24h Volume</span>
                <span className="font-medium">${(asset.volume24h / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Market Cap</span>
                <span className="font-medium">${(asset.marketCap / 1000000).toFixed(0)}M</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Activity Feed */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Activity</h3>
        <div className="space-y-3">
          {[
            { type: 'supply', user: '0x1234...5678', amount: '1,000 USDT', time: '2 min ago' },
            { type: 'borrow', user: '0xabcd...efgh', amount: '500 KAI', time: '4 min ago' },
            { type: 'repay', user: '0x9876...5432', amount: '200 USDT', time: '6 min ago' },
            { type: 'withdraw', user: '0xfedc...ba98', amount: '750 KRW', time: '8 min ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'supply' ? 'bg-green-100' :
                activity.type === 'borrow' ? 'bg-blue-100' :
                activity.type === 'repay' ? 'bg-purple-100' : 'bg-yellow-100'
              }`}>
                {activity.type === 'supply' && <TrendingUp className="h-4 w-4 text-green-600" />}
                {activity.type === 'borrow' && <TrendingDown className="h-4 w-4 text-blue-600" />}
                {activity.type === 'repay' && <Target className="h-4 w-4 text-purple-600" />}
                {activity.type === 'withdraw' && <Zap className="h-4 w-4 text-yellow-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.user} {activity.type === 'supply' ? 'supplied' : 
                                  activity.type === 'borrow' ? 'borrowed' :
                                  activity.type === 'repay' ? 'repaid' : 'withdrew'} {activity.amount}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeAnalytics; 