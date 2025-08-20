import { Asset, LendingPool } from '../types';

// Mock assets for demo purposes
export const MOCK_ASSETS: Asset[] = [
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0x1234567890123456789012345678901234567890',
    icon: '💵',
    price: 1.00,
    apy: 3.25
  },
  {
    symbol: 'KAI',
    name: 'Kaia Token',
    decimals: 18,
    address: '0x2345678901234567890123456789012345678901',
    icon: '🚀',
    price: 0.85,
    apy: 8.50
  },
  {
    symbol: 'KRW',
    name: 'Korean Won Stablecoin',
    decimals: 6,
    address: '0x3456789012345678901234567890123456789012',
    icon: '🇰🇷',
    price: 0.00075,
    apy: 4.20
  }
];

// Mock lending pools
export const MOCK_LENDING_POOLS: LendingPool[] = [
  {
    asset: MOCK_ASSETS[0], // USDT
    totalSupply: '1250000',
    totalBorrow: '450000',
    supplyAPY: 3.25,
    borrowAPY: 5.75,
    utilizationRate: 36.0,
    maxLTV: 85,
    liquidationThreshold: 90,
    liquidationPenalty: 5
  },
  {
    asset: MOCK_ASSETS[1], // KAI
    totalSupply: '850000',
    totalBorrow: '320000',
    supplyAPY: 8.50,
    borrowAPY: 12.25,
    utilizationRate: 37.6,
    maxLTV: 70,
    liquidationThreshold: 80,
    liquidationPenalty: 8
  },
  {
    asset: MOCK_ASSETS[2], // KRW
    totalSupply: '2100000',
    totalBorrow: '680000',
    supplyAPY: 4.20,
    borrowAPY: 6.80,
    utilizationRate: 32.4,
    maxLTV: 90,
    liquidationThreshold: 95,
    liquidationPenalty: 3
  }
];

// App configuration
export const APP_CONFIG = {
  name: 'KaiaFi Lending',
  description: 'Decentralized Lending & Borrowing on Kaia Network',
  version: '1.0.0',
  network: 'Kaia Testnet',
  rpcUrl: 'https://testnet-rpc.kaia.network',
  chainId: 1337, // Mock chain ID for demo
  explorerUrl: 'https://testnet-explorer.kaia.network',
  contractAddresses: {
    lendingPool: '0x5678901234567890123456789012345678901234',
    priceOracle: '0x6789012345678901234567890123456789012345',
    interestRateModel: '0x7890123456789012345678901234567890123456'
  }
};

// UI Constants
export const UI_CONFIG = {
  colors: {
    primary: '#10B981', // Green
    secondary: '#059669',
    accent: '#34D399',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }
}; 