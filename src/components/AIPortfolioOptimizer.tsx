import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BarChart3, 
  RefreshCw, 
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  PieChart,
  Settings
} from 'lucide-react';
import AIService, { PortfolioOptimization } from '../services/AIService';

interface Asset {
  symbol: string;
  currentWeight: number;
  suggestedWeight: number;
  apy: number;
  risk: number;
}

const AIPortfolioOptimizer: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<PortfolioOptimization | null>(null);
  const [riskTolerance, setRiskTolerance] = useState(0.5);
  const [targetReturn, setTargetReturn] = useState(0.12);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Mock portfolio data
  const mockPortfolio: Record<string, number> = {
    'USDT': 0.4,
    'KAI': 0.35,
    'KRW': 0.25
  };

  const mockAssets: Asset[] = [
    { symbol: 'USDT', currentWeight: 0.4, suggestedWeight: 0.4, apy: 0.08, risk: 0.1 },
    { symbol: 'KAI', currentWeight: 0.35, suggestedWeight: 0.35, apy: 0.12, risk: 0.3 },
    { symbol: 'KRW', currentWeight: 0.25, suggestedWeight: 0.25, apy: 0.06, risk: 0.2 }
  ];

  const optimizePortfolio = async () => {
    setIsOptimizing(true);
    
    try {
      // Simulate AI optimization time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = await AIService.optimizePortfolio(
        mockPortfolio,
        riskTolerance,
        targetReturn
      );
      
      setOptimization(result);
    } catch (error) {
      console.error('Portfolio optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  useEffect(() => {
    // Auto-optimize on component mount
    optimizePortfolio();
  }, []);

  const getRiskColor = (risk: number) => {
    if (risk < 0.2) return 'text-green-600 bg-green-100';
    if (risk < 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 0.2) return 'Low';
    if (risk < 0.4) return 'Medium';
    return 'High';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Portfolio Optimizer</h2>
              <p className="text-sm text-gray-600">Intelligent portfolio recommendations</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2 inline" />
            {showAdvanced ? 'Hide' : 'Advanced'}
          </button>
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Tolerance: {(riskTolerance * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Return: {(targetReturn * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0.05"
                max="0.25"
                step="0.01"
                value={targetReturn}
                onChange={(e) => setTargetReturn(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5%</span>
                <span>25%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {isOptimizing ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
              <span className="text-gray-600">AI is optimizing your portfolio...</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Analyzing market conditions and risk factors</p>
          </div>
        ) : optimization ? (
          <div className="space-y-6">
            {/* Optimization Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center">
                  <Target className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Expected Return</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(optimization.expectedReturn * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center">
                  <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Risk Level</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(optimization.riskLevel * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 border ${
                optimization.rebalancingNeeded 
                  ? 'bg-orange-50 border-orange-200' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center">
                  {optimization.rebalancingNeeded ? (
                    <AlertTriangle className="h-6 w-6 text-orange-600 mr-3" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-xl font-bold text-gray-900">
                      {optimization.rebalancingNeeded ? 'Rebalancing Needed' : 'Optimized'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Comparison */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
              <div className="space-y-3">
                {Object.entries(optimization.suggestedAllocation).map(([asset, weight]) => {
                  const currentWeight = mockPortfolio[asset] || 0;
                  const difference = weight - currentWeight;
                  const needsChange = Math.abs(difference) > 0.05;
                  
                  return (
                    <div key={asset} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-700">{asset}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{asset}</span>
                          {needsChange && (
                            <div className="text-xs text-gray-500">
                              Current: {(currentWeight * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {needsChange && (
                          <div className="text-sm text-gray-500">
                            {currentWeight > weight ? '↓' : '↑'}
                          </div>
                        )}
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {(weight * 100).toFixed(1)}%
                          </div>
                          {needsChange && (
                            <div className={`text-xs ${
                              difference > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {difference > 0 ? '+' : ''}{(difference * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Priority Actions */}
            {optimization.priorityActions.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3">Priority Actions</h3>
                <div className="space-y-2">
                  {optimization.priorityActions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Asset Analysis */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Asset Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockAssets.map((asset) => (
                  <div key={asset.symbol} className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-700">{asset.symbol}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(asset.risk)}`}>
                        {getRiskLabel(asset.risk)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">APY:</span>
                        <span className="font-medium">{(asset.apy * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Risk:</span>
                        <span className="font-medium">{(asset.risk * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Weight:</span>
                        <span className="font-medium">{(asset.suggestedWeight * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={optimizePortfolio}
                className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2 inline" />
                Re-optimize Portfolio
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                <ArrowRight className="h-4 w-4 mr-2 inline" />
                Apply Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Click optimize to get started</p>
            <button
              onClick={optimizePortfolio}
              className="mt-4 px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Optimization
            </button>
          </div>
        )}
      </div>

      {/* Custom CSS for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default AIPortfolioOptimizer; 