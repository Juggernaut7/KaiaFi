import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import AIService, { MarketPrediction } from '../services/AIService';

interface MarketData {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  volatility: number;
  volume24h: number;
  marketCap: number;
}

interface TradingSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  timeHorizon: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

const AIMarketIntelligence: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketPredictions, setMarketPredictions] = useState<MarketData[]>([]);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Mock market data
  const mockMarketData: MarketData[] = [
    {
      symbol: 'USDT',
      currentPrice: 1.00,
      predictedPrice: 1.002,
      confidence: 0.85,
      trend: 'UP',
      volatility: 0.02,
      volume24h: 45000000,
      marketCap: 95000000000
    },
    {
      symbol: 'KAI',
      currentPrice: 0.85,
      predictedPrice: 0.87,
      confidence: 0.72,
      trend: 'UP',
      volatility: 0.15,
      volume24h: 1200000,
      marketCap: 85000000
    },
    {
      symbol: 'KRW',
      currentPrice: 0.00075,
      predictedPrice: 0.00073,
      confidence: 0.68,
      trend: 'DOWN',
      volatility: 0.08,
      volume24h: 850000,
      marketCap: 75000000
    }
  ];

  const analyzeMarkets = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis time
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate AI predictions for each asset
      const predictions = await Promise.all(
        mockMarketData.map(async (asset) => {
          const prediction = await AIService.predictMarketTrends(
            asset.currentPrice * 0.08, // Mock APY
            asset.marketCap,
            asset.volume24h,
            asset.volatility,
            asset.trend === 'UP' ? 0.02 : asset.trend === 'DOWN' ? -0.02 : 0
          );
          
          return {
            ...asset,
            predictedPrice: asset.currentPrice * (1 + (prediction.predictedAPY - 0.08) * 0.1),
            confidence: prediction.confidence,
            trend: prediction.trend
          };
        })
      );
      
      setMarketPredictions(predictions);
      
      // Generate trading signals
      const signals = generateTradingSignals(predictions);
      setTradingSignals(signals);
      
    } catch (error) {
      console.error('Market analysis failed:', error);
      setMarketPredictions(mockMarketData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTradingSignals = (markets: MarketData[]): TradingSignal[] => {
    return markets.map(market => {
      const priceChange = (market.predictedPrice - market.currentPrice) / market.currentPrice;
      const volatility = market.volatility;
      
      let action: 'BUY' | 'SELL' | 'HOLD';
      let reasoning = '';
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
      
      if (priceChange > volatility * 0.5 && market.confidence > 0.7) {
        action = 'BUY';
        reasoning = `Strong upward momentum with ${(priceChange * 100).toFixed(1)}% expected gain`;
        riskLevel = volatility > 0.1 ? 'HIGH' : 'MEDIUM';
      } else if (priceChange < -volatility * 0.5 && market.confidence > 0.7) {
        action = 'SELL';
        reasoning = `Downward trend expected with ${Math.abs(priceChange * 100).toFixed(1)}% potential loss`;
        riskLevel = volatility > 0.1 ? 'HIGH' : 'MEDIUM';
      } else {
        action = 'HOLD';
        reasoning = 'Market conditions suggest maintaining current position';
        riskLevel = 'LOW';
      }
      
      return {
        symbol: market.symbol,
        action,
        confidence: market.confidence,
        reasoning,
        timeHorizon: selectedTimeframe,
        riskLevel
      };
    });
  };

  useEffect(() => {
    // Auto-analyze on component mount
    analyzeMarkets();
  }, [selectedTimeframe]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'DOWN': return <TrendingDown className="h-5 w-5 text-red-600" />;
      default: return <BarChart3 className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'UP': return 'text-green-600 bg-green-100';
      case 'DOWN': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-green-600 bg-green-100 border-green-200';
      case 'SELL': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Brain className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Market Intelligence</h2>
              <p className="text-sm text-gray-600">Real-time predictions and trading signals</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
            </select>
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              {showAdvanced ? 'Hide' : 'Advanced'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-gray-600">AI is analyzing market conditions...</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Processing real-time data and generating predictions</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Market Predictions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Predictions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketPredictions.map((market) => (
                  <div key={market.symbol} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-sm font-bold text-gray-700">{market.symbol}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{market.symbol}</h4>
                          <p className="text-sm text-gray-500">${market.currentPrice.toFixed(4)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTrendColor(market.trend)}`}>
                          {market.trend}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Predicted Price:</span>
                        <span className="font-medium">${market.predictedPrice.toFixed(4)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Price Change:</span>
                        <span className={`font-medium ${
                          market.predictedPrice > market.currentPrice ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {market.predictedPrice > market.currentPrice ? '+' : ''}
                          {((market.predictedPrice - market.currentPrice) / market.currentPrice * 100).toFixed(2)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Confidence:</span>
                        <span className="font-medium">{(market.confidence * 100).toFixed(0)}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Volatility:</span>
                        <span className="font-medium">{(market.volatility * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Signals */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Trading Signals</h3>
              <div className="space-y-3">
                {tradingSignals.map((signal) => (
                  <div key={signal.symbol} className={`border rounded-lg p-4 ${getActionColor(signal.action)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-sm font-bold text-gray-700">{signal.symbol}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{signal.action}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(signal.riskLevel)}`}>
                              {signal.riskLevel} Risk
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{signal.reasoning}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          Confidence: {(signal.confidence * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {signal.timeHorizon}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">Market Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Best Opportunity</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mt-1">KAI</div>
                  <div className="text-xs text-gray-500">Strong upward momentum</div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-900">High Risk</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mt-1">KRW</div>
                  <div className="text-xs text-gray-500">Declining trend detected</div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Stable</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mt-1">USDT</div>
                  <div className="text-xs text-gray-500">Low volatility, steady growth</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={analyzeMarkets}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2 inline" />
                Refresh Analysis
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                <Zap className="h-4 w-4 mr-2 inline" />
                Execute Signals
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMarketIntelligence; 