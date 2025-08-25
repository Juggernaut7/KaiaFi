import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  Info,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import AIService, { RiskFactors, RiskAssessment, MarketPrediction } from '../services/AIService';

interface AIRiskAssessmentProps {
  userPosition?: {
    collateralValue: number;
    borrowedAmount: number;
    healthFactor: number;
    assets: string[];
  };
}

const AIRiskAssessment: React.FC<AIRiskAssessmentProps> = ({ userPosition }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [marketPrediction, setMarketPrediction] = useState<MarketPrediction | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock user position data for demo
  const mockPosition = userPosition || {
    collateralValue: 15000,
    borrowedAmount: 8000,
    healthFactor: 1.875,
    assets: ['USDT', 'KAI', 'KRW']
  };

  const analyzeRisk = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const factors: RiskFactors = {
        collateralValue: mockPosition.collateralValue,
        borrowedAmount: mockPosition.borrowedAmount,
        healthFactor: mockPosition.healthFactor,
        marketVolatility: 0.15 + Math.random() * 0.1,
        userHistory: 45 + Math.random() * 30,
        assetDiversity: mockPosition.assets.length,
        liquidationThreshold: 0.85,
        maxLTV: 0.75
      };

      const assessment = await AIService.assessRisk(factors);
      setRiskAssessment(assessment);

      // Get market prediction
      const prediction = await AIService.predictMarketTrends(
        0.08, // Current APY
        100000000, // Market cap
        50000000, // 24h volume
        0.12, // Volatility
        0.02 // Trend
      );
      setMarketPrediction(prediction);

    } catch (error) {
      console.error('Risk analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Auto-analyze on component mount
    analyzeRisk();
  }, []);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'MEDIUM': return <Info className="h-5 w-5 text-yellow-600" />;
      case 'HIGH': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'CRITICAL': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Risk Assessment</h2>
              <p className="text-sm text-gray-600">Powered by Machine Learning</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">AI is analyzing your position...</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        ) : riskAssessment ? (
          <div className="space-y-6">
            {/* Risk Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Risk Level</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(riskAssessment.riskLevel)}`}>
                    {riskAssessment.riskLevel}
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  {getRiskIcon(riskAssessment.riskLevel)}
                  <span className="ml-2 text-lg font-bold text-gray-900">
                    {(riskAssessment.riskScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <span className="text-sm text-gray-500">Liquidation Risk</span>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-lg font-bold text-gray-900">
                    {(riskAssessment.liquidationProbability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <span className="text-sm text-gray-500">Confidence</span>
                <div className="flex items-center mt-2">
                  <Target className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-lg font-bold text-gray-900">
                    {(riskAssessment.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Health Factor Analysis */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Health Factor Analysis</h3>
                <div className="flex items-center space-x-2">
                  {riskAssessment.healthFactorTrend === 'IMPROVING' && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                  {riskAssessment.healthFactorTrend === 'STABLE' && (
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  )}
                  {riskAssessment.healthFactorTrend === 'DECLINING' && (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-600">
                    {riskAssessment.healthFactorTrend}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Current Health Factor</span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {mockPosition.healthFactor.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Optimal Collateral</span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    ${riskAssessment.optimalCollateral.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Prediction */}
            {marketPrediction && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-3">Market Prediction</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Predicted APY</span>
                    <div className="text-xl font-bold text-gray-900 mt-1">
                      {(marketPrediction.predictedAPY * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Trend</span>
                    <div className="flex items-center mt-1">
                      {marketPrediction.trend === 'UP' && <TrendingUp className="h-4 w-4 text-green-600 mr-1" />}
                      {marketPrediction.trend === 'DOWN' && <TrendingDown className="h-4 w-4 text-red-600 mr-1" />}
                      <span className="text-lg font-bold text-gray-900">{marketPrediction.trend}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Action</span>
                    <div className="text-lg font-bold text-gray-900 mt-1">
                      {marketPrediction.optimalTiming}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">AI Recommendations</h3>
              <div className="space-y-2">
                {riskAssessment.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Analysis */}
            {showDetails && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Detailed Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Collateral Value:</span>
                    <span className="ml-2 font-medium">${mockPosition.collateralValue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Borrowed Amount:</span>
                    <span className="ml-2 font-medium">${mockPosition.borrowedAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Asset Diversity:</span>
                    <span className="ml-2 font-medium">{mockPosition.assets.length} assets</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Current LTV:</span>
                    <span className="ml-2 font-medium">
                      {((mockPosition.borrowedAmount / mockPosition.collateralValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={analyzeRisk}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Brain className="h-4 w-4 mr-2 inline" />
                Re-analyze Risk
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                <Shield className="h-4 w-4 mr-2 inline" />
                Optimize Position
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Click analyze to get started</p>
            <button
              onClick={analyzeRisk}
              className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRiskAssessment; 