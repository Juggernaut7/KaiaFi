import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MOCK_LENDING_POOLS, MOCK_ASSETS } from '../constants';
import { LendingPool, UserPosition, Transaction, MarketData, Asset } from '../types';

interface LendingContextType {
  // Market data
  lendingPools: LendingPool[];
  marketData: MarketData;
  
  // User data
  userPositions: UserPosition[];
  userTransactions: Transaction[];
  
  // Actions
  supply: (asset: Asset, amount: string) => Promise<Transaction>;
  withdraw: (asset: Asset, amount: string) => Promise<Transaction>;
  borrow: (asset: Asset, amount: string, collateral: Asset) => Promise<Transaction>;
  repay: (asset: Asset, amount: string) => Promise<Transaction>;
  
  // State
  isLoading: boolean;
  error: string | null;
  
  // Utilities
  calculateHealthFactor: (positions: UserPosition[]) => number;
  getMaxBorrowAmount: (collateral: Asset, collateralAmount: string) => string;
}

const LendingContext = createContext<LendingContextType | undefined>(undefined);

export const useLending = () => {
  const context = useContext(LendingContext);
  if (context === undefined) {
    throw new Error('useLending must be used within a LendingProvider');
  }
  return context;
};

interface LendingProviderProps {
  children: ReactNode;
}

export const LendingProvider: React.FC<LendingProviderProps> = ({ children }) => {
  const [lendingPools, setLendingPools] = useState<LendingPool[]>(MOCK_LENDING_POOLS);
  const [userPositions, setUserPositions] = useState<UserPosition[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate market data from pools
  const marketData: MarketData = {
    totalValueLocked: lendingPools
      .reduce((sum, pool) => sum + parseFloat(pool.totalSupply), 0)
      .toFixed(2),
    totalBorrowed: lendingPools
      .reduce((sum, pool) => sum + parseFloat(pool.totalBorrow), 0)
      .toFixed(2),
    totalSupplied: lendingPools
      .reduce((sum, pool) => sum + parseFloat(pool.totalSupply), 0)
      .toFixed(2),
    averageAPY: lendingPools
      .reduce((sum, pool) => sum + pool.supplyAPY, 0) / lendingPools.length
  };

  // Mock user positions (in real app, this would come from blockchain)
  useEffect(() => {
    const mockPositions: UserPosition[] = [
      {
        asset: MOCK_ASSETS[0], // USDT
        supplied: '1000',
        borrowed: '0',
        collateralValue: '1000',
        borrowValue: '0',
        healthFactor: 999 // Very healthy
      },
      {
        asset: MOCK_ASSETS[1], // KAI
        supplied: '500',
        borrowed: '200',
        collateralValue: '425',
        borrowValue: '170',
        healthFactor: 2.5
      }
    ];
    setUserPositions(mockPositions);
  }, []);

  const supply = async (asset: Asset, amount: string): Promise<Transaction> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transaction: Transaction = {
        hash: `0x${Math.random().toString(36).substr(2, 64)}`,
        type: 'supply',
        asset,
        amount,
        timestamp: Date.now(),
        status: 'confirmed'
      };
      
      // Update user positions
      const existingPosition = userPositions.find(p => p.asset.symbol === asset.symbol);
      if (existingPosition) {
        setUserPositions(prev => prev.map(p => 
          p.asset.symbol === asset.symbol 
            ? { ...p, supplied: (parseFloat(p.supplied) + parseFloat(amount)).toString() }
            : p
        ));
      } else {
        setUserPositions(prev => [...prev, {
          asset,
          supplied: amount,
          borrowed: '0',
          collateralValue: amount,
          borrowValue: '0',
          healthFactor: 999
        }]);
      }
      
      // Add transaction to history
      setUserTransactions(prev => [transaction, ...prev]);
      
      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Supply failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async (asset: Asset, amount: string): Promise<Transaction> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transaction: Transaction = {
        hash: `0x${Math.random().toString(36).substr(2, 64)}`,
        type: 'withdraw',
        asset,
        amount,
        timestamp: Date.now(),
        status: 'confirmed'
      };
      
      // Update user positions
      setUserPositions(prev => prev.map(p => 
        p.asset.symbol === asset.symbol 
          ? { ...p, supplied: Math.max(0, parseFloat(p.supplied) - parseFloat(amount)).toString() }
          : p
      ));
      
      setUserTransactions(prev => [transaction, ...prev]);
      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Withdraw failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const borrow = async (asset: Asset, amount: string, collateral: Asset): Promise<Transaction> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transaction: Transaction = {
        hash: `0x${Math.random().toString(36).substr(2, 64)}`,
        type: 'borrow',
        asset,
        amount,
        timestamp: Date.now(),
        status: 'confirmed'
      };
      
      // Update user positions
      setUserPositions(prev => prev.map(p => 
        p.asset.symbol === asset.symbol 
          ? { ...p, borrowed: (parseFloat(p.borrowed) + parseFloat(amount)).toString() }
          : p
      ));
      
      setUserTransactions(prev => [transaction, ...prev]);
      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Borrow failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const repay = async (asset: Asset, amount: string): Promise<Transaction> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transaction: Transaction = {
        hash: `0x${Math.random().toString(36).substr(2, 64)}`,
        type: 'repay',
        asset,
        amount,
        timestamp: Date.now(),
        status: 'confirmed'
      };
      
      // Update user positions
      setUserPositions(prev => prev.map(p => 
        p.asset.symbol === asset.symbol 
          ? { ...p, borrowed: Math.max(0, parseFloat(p.borrowed) - parseFloat(amount)).toString() }
          : p
      ));
      
      setUserTransactions(prev => [transaction, ...prev]);
      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Repay failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateHealthFactor = (positions: UserPosition[]): number => {
    if (positions.length === 0) return 999;
    
    const totalCollateral = positions.reduce((sum, pos) => sum + parseFloat(pos.collateralValue), 0);
    const totalBorrowed = positions.reduce((sum, pos) => sum + parseFloat(pos.borrowValue), 0);
    
    if (totalBorrowed === 0) return 999;
    
    return totalCollateral / totalBorrowed;
  };

  const getMaxBorrowAmount = (collateral: Asset, collateralAmount: string): string => {
    const pool = lendingPools.find(p => p.asset.symbol === collateral.symbol);
    if (!pool) return '0';
    
    const maxLTV = pool.maxLTV / 100;
    return (parseFloat(collateralAmount) * maxLTV).toFixed(2);
  };

  const value: LendingContextType = {
    lendingPools,
    marketData,
    userPositions,
    userTransactions,
    supply,
    withdraw,
    borrow,
    repay,
    isLoading,
    error,
    calculateHealthFactor,
    getMaxBorrowAmount,
  };

  return (
    <LendingContext.Provider value={value}>
      {children}
    </LendingContext.Provider>
  );
}; 