import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';
import { RandomForestRegression } from 'ml-random-forest';

export interface RiskFactors {
  collateralValue: number;
  borrowedAmount: number;
  healthFactor: number;
  marketVolatility: number;
  userHistory: number;
  assetDiversity: number;
  liquidationThreshold: number;
  maxLTV: number;
}

export interface RiskAssessment {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  recommendations: string[];
  liquidationProbability: number;
  optimalCollateral: number;
  healthFactorTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}

export interface MarketPrediction {
  predictedAPY: number;
  confidence: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  volatility: number;
  optimalTiming: 'NOW' | 'WAIT' | 'AVOID';
}

export interface PortfolioOptimization {
  suggestedAllocation: Record<string, number>;
  expectedReturn: number;
  riskLevel: number;
  rebalancingNeeded: boolean;
  priorityActions: string[];
}

class AIService {
  private riskModel: tf.LayersModel | null = null;
  private marketModel: tf.LayersModel | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Initialize TensorFlow.js backend
      await tf.ready();
      
      // Create and train risk assessment model
      await this.initializeRiskModel();
      
      // Create and train market prediction model
      await this.initializeMarketModel();
      
      this.isInitialized = true;
      console.log('AI Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI Service:', error);
      // Fallback to simple algorithms if ML fails
    }
  }

  private async initializeRiskModel() {
    // Create a simple neural network for risk assessment
    this.riskModel = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [8], units: 16, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.riskModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    // Generate synthetic training data
    const trainingData = this.generateTrainingData();
    const { inputs, outputs } = trainingData;

    // Train the model
    await this.riskModel.fit(inputs, outputs, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      verbose: 0
    });
  }

  private async initializeMarketModel() {
    // Create a simple neural network for market prediction
    this.marketModel = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [5], units: 12, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 6, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'tanh' })
      ]
    });

    this.marketModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    // Generate synthetic market training data
    const marketData = this.generateMarketTrainingData();
    const { inputs, outputs } = marketData;

    // Train the model
    await this.marketModel.fit(inputs, outputs, {
      epochs: 30,
      batchSize: 16,
      validationSplit: 0.2,
      verbose: 0
    });
  }

  private generateTrainingData() {
    const inputs: number[][] = [];
    const outputs: number[][] = [];

    // Generate 1000 synthetic training examples
    for (let i = 0; i < 1000; i++) {
      const collateralValue = Math.random() * 100000;
      const borrowedAmount = Math.random() * collateralValue * 0.8;
      const healthFactor = (collateralValue * 0.8) / borrowedAmount;
      const marketVolatility = Math.random() * 0.5;
      const userHistory = Math.random() * 100;
      const assetDiversity = Math.random() * 10;
      const liquidationThreshold = 0.8 + Math.random() * 0.2;
      const maxLTV = 0.7 + Math.random() * 0.3;

      const riskScore = this.calculateRiskScore({
        collateralValue,
        borrowedAmount,
        healthFactor,
        marketVolatility,
        userHistory,
        assetDiversity,
        liquidationThreshold,
        maxLTV
      });

      inputs.push([
        collateralValue / 100000, // Normalize
        borrowedAmount / 100000,
        healthFactor / 10,
        marketVolatility,
        userHistory / 100,
        assetDiversity / 10,
        liquidationThreshold,
        maxLTV
      ]);

      outputs.push([riskScore]);
    }

    return {
      inputs: tf.tensor2d(inputs),
      outputs: tf.tensor2d(outputs)
    };
  }

  private generateMarketTrainingData() {
    const inputs: number[][] = [];
    const outputs: number[][] = [];

    // Generate 500 synthetic market training examples
    for (let i = 0; i < 500; i++) {
      const currentAPY = 0.05 + Math.random() * 0.15;
      const marketCap = Math.random() * 1000000000;
      const volume24h = Math.random() * 100000000;
      const volatility = Math.random() * 0.3;
      const trend = Math.random() * 2 - 1;

      const predictedAPY = currentAPY + trend * 0.02 + (Math.random() - 0.5) * 0.01;

      inputs.push([
        currentAPY,
        marketCap / 1000000000,
        volume24h / 100000000,
        volatility,
        trend
      ]);

      outputs.push([predictedAPY]);
    }

    return {
      inputs: tf.tensor2d(inputs),
      outputs: tf.tensor2d(outputs)
    };
  }

  private calculateRiskScore(factors: RiskFactors): number {
    // Simple risk scoring algorithm as fallback
    let score = 0;
    
    // Health factor impact (most important)
    if (factors.healthFactor < 1.1) score += 0.4;
    else if (factors.healthFactor < 1.5) score += 0.2;
    else if (factors.healthFactor < 2.0) score += 0.1;
    
    // Market volatility impact
    score += factors.marketVolatility * 0.2;
    
    // User history impact
    score -= (factors.userHistory / 100) * 0.1;
    
    // Asset diversity impact
    score -= (factors.assetDiversity / 10) * 0.05;
    
    // LTV impact
    const currentLTV = factors.borrowedAmount / factors.collateralValue;
    if (currentLTV > factors.maxLTV * 0.9) score += 0.2;
    
    return Math.max(0, Math.min(1, score));
  }

  async assessRisk(factors: RiskFactors): Promise<RiskAssessment> {
    await this.initialize();

    let riskScore = 0;
    let confidence = 0.8;

    try {
      if (this.riskModel) {
        // Use ML model for prediction
        const input = tf.tensor2d([[
          factors.collateralValue / 100000,
          factors.borrowedAmount / 100000,
          factors.healthFactor / 10,
          factors.marketVolatility,
          factors.userHistory / 100,
          factors.assetDiversity / 10,
          factors.liquidationThreshold,
          factors.maxLTV
        ]]);
        
        const prediction = this.riskModel.predict(input) as tf.Tensor;
        riskScore = (await prediction.data())[0];
        confidence = 0.9;
        
        input.dispose();
        prediction.dispose();
      } else {
        // Fallback to simple algorithm
        riskScore = this.calculateRiskScore(factors);
        confidence = 0.7;
      }
    } catch (error) {
      console.error('ML prediction failed, using fallback:', error);
      riskScore = this.calculateRiskScore(factors);
      confidence = 0.6;
    }

    const riskLevel = this.getRiskLevel(riskScore);
    const liquidationProbability = this.calculateLiquidationProbability(riskScore, factors);
    const optimalCollateral = this.calculateOptimalCollateral(factors, riskScore);
    const healthFactorTrend = this.predictHealthFactorTrend(factors, riskScore);

    return {
      riskScore,
      riskLevel,
      confidence,
      recommendations: this.generateRecommendations(riskLevel, factors),
      liquidationProbability,
      optimalCollateral,
      healthFactorTrend
    };
  }

  async predictMarketTrends(
    currentAPY: number,
    marketCap: number,
    volume24h: number,
    volatility: number,
    trend: number
  ): Promise<MarketPrediction> {
    await this.initialize();

    let predictedAPY = currentAPY;
    let confidence = 0.7;

    try {
      if (this.marketModel) {
        const input = tf.tensor2d([[
          currentAPY,
          marketCap / 1000000000,
          volume24h / 100000000,
          volatility,
          trend
        ]]);
        
        const prediction = this.marketModel.predict(input) as tf.Tensor;
        predictedAPY = (await prediction.data())[0];
        confidence = 0.8;
        
        input.dispose();
        prediction.dispose();
      }
    } catch (error) {
      console.error('Market prediction failed:', error);
      // Use simple trend analysis
      predictedAPY = currentAPY + trend * 0.01;
    }

    const predictedTrend = predictedAPY > currentAPY ? 'UP' : predictedAPY < currentAPY ? 'DOWN' : 'STABLE';
    const optimalTiming = this.calculateOptimalTiming(predictedAPY, currentAPY, volatility);

    return {
      predictedAPY,
      confidence,
      trend: predictedTrend,
      volatility,
      optimalTiming
    };
  }

  async optimizePortfolio(
    currentAllocation: Record<string, number>,
    riskTolerance: number,
    targetReturn: number
  ): Promise<PortfolioOptimization> {
    // Simple portfolio optimization using modern portfolio theory concepts
    const assets = Object.keys(currentAllocation);
    const suggestedAllocation: Record<string, number> = {};
    
    // Calculate optimal weights based on risk tolerance
    const totalRisk = assets.reduce((sum, asset) => sum + (currentAllocation[asset] || 0), 0);
    
    assets.forEach(asset => {
      const currentWeight = currentAllocation[asset] || 0;
      const riskAdjustedWeight = currentWeight * (1 - riskTolerance * 0.3);
      suggestedAllocation[asset] = Math.max(0, riskAdjustedWeight);
    });
    
    // Normalize weights
    const totalWeight = Object.values(suggestedAllocation).reduce((sum, weight) => sum + weight, 0);
    Object.keys(suggestedAllocation).forEach(asset => {
      suggestedAllocation[asset] = suggestedAllocation[asset] / totalWeight;
    });

    const expectedReturn = targetReturn * (1 - riskTolerance * 0.2);
    const rebalancingNeeded = this.calculateRebalancingNeeded(currentAllocation, suggestedAllocation);
    const priorityActions = this.generatePriorityActions(currentAllocation, suggestedAllocation);

    return {
      suggestedAllocation,
      expectedReturn,
      riskLevel: riskTolerance,
      rebalancingNeeded,
      priorityActions
    };
  }

  private getRiskLevel(riskScore: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (riskScore < 0.25) return 'LOW';
    if (riskScore < 0.5) return 'MEDIUM';
    if (riskScore < 0.75) return 'HIGH';
    return 'CRITICAL';
  }

  private calculateLiquidationProbability(riskScore: number, factors: RiskFactors): number {
    const baseProbability = riskScore * 0.8;
    const healthFactorMultiplier = Math.max(0, 2 - factors.healthFactor) * 0.3;
    const volatilityMultiplier = factors.marketVolatility * 0.4;
    
    return Math.min(0.95, baseProbability + healthFactorMultiplier + volatilityMultiplier);
  }

  private calculateOptimalCollateral(factors: RiskFactors, riskScore: number): number {
    const currentLTV = factors.borrowedAmount / factors.collateralValue;
    const targetLTV = factors.maxLTV * 0.7; // Conservative target
    
    if (currentLTV <= targetLTV) return factors.collateralValue;
    
    const requiredCollateral = factors.borrowedAmount / targetLTV;
    return requiredCollateral;
  }

  private predictHealthFactorTrend(factors: RiskFactors, riskScore: number): 'IMPROVING' | 'STABLE' | 'DECLINING' {
    if (riskScore < 0.3) return 'IMPROVING';
    if (riskScore < 0.6) return 'STABLE';
    return 'DECLINING';
  }

  private calculateOptimalTiming(predictedAPY: number, currentAPY: number, volatility: number): 'NOW' | 'WAIT' | 'AVOID' {
    const apyDifference = predictedAPY - currentAPY;
    const volatilityThreshold = 0.1;
    
    if (apyDifference > volatilityThreshold) return 'NOW';
    if (apyDifference > -volatilityThreshold) return 'WAIT';
    return 'AVOID';
  }

  private calculateRebalancingNeeded(
    current: Record<string, number>,
    suggested: Record<string, number>
  ): boolean {
    const threshold = 0.05; // 5% difference threshold
    
    return Object.keys(current).some(asset => {
      const difference = Math.abs((current[asset] || 0) - (suggested[asset] || 0));
      return difference > threshold;
    });
  }

  private generateRecommendations(riskLevel: string, factors: RiskFactors): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'CRITICAL') {
      recommendations.push('Immediately add collateral to avoid liquidation');
      recommendations.push('Consider repaying some borrowed amount');
      recommendations.push('Monitor market conditions closely');
    } else if (riskLevel === 'HIGH') {
      recommendations.push('Add collateral to improve health factor');
      recommendations.push('Diversify your asset portfolio');
      recommendations.push('Set up liquidation alerts');
    } else if (riskLevel === 'MEDIUM') {
      recommendations.push('Monitor health factor trends');
      recommendations.push('Consider adding more collateral for safety');
      recommendations.push('Diversify across different assets');
    } else {
      recommendations.push('Your position is well-balanced');
      recommendations.push('Consider optimizing for better yields');
      recommendations.push('Explore additional lending opportunities');
    }
    
    if (factors.healthFactor < 1.5) {
      recommendations.push('Health factor is below recommended threshold');
    }
    
    if (factors.assetDiversity < 3) {
      recommendations.push('Low asset diversity increases portfolio risk');
    }
    
    return recommendations;
  }

  private generatePriorityActions(
    current: Record<string, number>,
    suggested: Record<string, number>
  ): string[] {
    const actions: string[] = [];
    const sortedAssets = Object.keys(current).sort((a, b) => {
      const currentDiff = Math.abs((current[a] || 0) - (suggested[a] || 0));
      const suggestedDiff = Math.abs((current[b] || 0) - (suggested[b] || 0));
      return suggestedDiff - currentDiff;
    });
    
    sortedAssets.slice(0, 3).forEach(asset => {
      const currentWeight = current[asset] || 0;
      const suggestedWeight = suggested[asset] || 0;
      
      if (suggestedWeight > currentWeight) {
        actions.push(`Increase ${asset} allocation to ${(suggestedWeight * 100).toFixed(1)}%`);
      } else if (suggestedWeight < currentWeight) {
        actions.push(`Reduce ${asset} allocation to ${(suggestedWeight * 100).toFixed(1)}%`);
      }
    });
    
    return actions;
  }

  // Cleanup method to free memory
  dispose() {
    if (this.riskModel) {
      this.riskModel.dispose();
    }
    if (this.marketModel) {
      this.marketModel.dispose();
    }
  }
}

export default new AIService(); 