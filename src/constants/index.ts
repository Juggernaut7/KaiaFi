import { Asset, LendingPool } from '../types';

// Live Contract Addresses from Kaia Kairos Testnet
export const CONTRACT_ADDRESSES = {
  // Core Protocol Contracts
  lendingPool: '0x69BFf0d74bBb734cfac1bE3938488E026F02Bc86',
  interestRateModel: '0x0BD0DC85E111cA42363D8c67949c2A4ae85b1Bb7',
  liquidation: '0xc328abADc8e0B205948ECD359F341bd9F3d7ebD2',
  
  // Token Contracts
  mockUSDT: '0x74864Cb942cf73aFABc9633438c1Bb060d7FEa94',
  mockKAI: '0x77131bAEDd82bED0583E9e17Feb51b788C632893',
  mockKRW: '0x6c23508A9b310C5f2eb2e2eFeBeB748067478667',
};

export const MOCK_ASSETS: Asset[] = [
  { 
    symbol: 'USDT', 
    name: 'Tether USD', 
    decimals: 6, 
    address: CONTRACT_ADDRESSES.mockUSDT, 
    icon: '💵', 
    price: 1.00, 
    apy: 3.25 
  },
  { 
    symbol: 'KAI', 
    name: 'Kaia Token', 
    decimals: 18, 
    address: CONTRACT_ADDRESSES.mockKAI, 
    icon: '🚀', 
    price: 0.85, 
    apy: 8.50 
  },
  { 
    symbol: 'KRW', 
    name: 'Korean Won Stablecoin', 
    decimals: 6, 
    address: CONTRACT_ADDRESSES.mockKRW, 
    icon: '🇰🇷', 
    price: 0.00075, 
    apy: 4.20 
  }
];

export const MOCK_LENDING_POOLS: LendingPool[] = [
  {
    asset: MOCK_ASSETS[0], // USDT
    totalSupply: '1000000.00',
    totalBorrow: '250000.00',
    supplyAPY: 3.25,
    borrowAPY: 5.50,
    utilizationRate: 25.0,
    maxLTV: 0.75,
    liquidationThreshold: 0.80,
    liquidationPenalty: 0.05
  },
  {
    asset: MOCK_ASSETS[1], // KAI
    totalSupply: '50000.00',
    totalBorrow: '15000.00',
    supplyAPY: 8.50,
    borrowAPY: 12.75,
    utilizationRate: 30.0,
    maxLTV: 0.60,
    liquidationThreshold: 0.65,
    liquidationPenalty: 0.05
  },
  {
    asset: MOCK_ASSETS[2], // KRW
    totalSupply: '1000000.00',
    totalBorrow: '300000.00',
    supplyAPY: 4.20,
    borrowAPY: 6.80,
    utilizationRate: 30.0,
    maxLTV: 0.85,
    liquidationThreshold: 0.90,
    liquidationPenalty: 0.05
  }
];

export const APP_CONFIG = {
  name: 'KaiaFi Lending',
  description: 'Decentralized Lending & Borrowing on Kaia Network',
  version: '1.0.0',
  network: 'Kaia Kairos Testnet',
  rpcUrl: 'https://public-en-kairos.node.kaia.io',
  chainId: 1001,
  explorerUrl: 'https://baobab.klaytnscope.com',
  contractAddresses: CONTRACT_ADDRESSES
};

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
    '2xl': '3rem',
    '3xl': '4rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
}; 