export interface User {
  address: string;
  balance: string;
  isConnected: boolean;
}

export interface Asset {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  icon: string;
  price: number;
  apy: number;
}

export interface LendingPool {
  asset: Asset;
  totalSupply: string;
  totalBorrow: string;
  supplyAPY: number;
  borrowAPY: number;
  utilizationRate: number;
  maxLTV: number;
  liquidationThreshold: number;
  liquidationPenalty: number;
}

export interface UserPosition {
  asset: Asset;
  supplied: string;
  borrowed: string;
  collateralValue: string;
  borrowValue: string;
  healthFactor: number;
}

export interface Transaction {
  hash: string;
  type: 'supply' | 'borrow' | 'repay' | 'withdraw';
  asset: Asset;
  amount: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface MarketData {
  totalValueLocked: string;
  totalBorrowed: string;
  totalSupplied: string;
  averageAPY: number;
}

export interface LendingFormData {
  asset: Asset;
  amount: string;
  action: 'supply' | 'borrow' | 'repay' | 'withdraw';
} 