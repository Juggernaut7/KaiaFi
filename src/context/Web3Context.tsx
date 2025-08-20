import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { APP_CONFIG } from '../constants';

interface Web3ContextType {
  account: string | null;
  provider: any | null;
  signer: any | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<any | null>(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this app!');
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      
      // Mock provider and signer for demo
      const mockProvider = { 
        getNetwork: () => Promise.resolve({ chainId: APP_CONFIG.chainId }),
        getSigner: () => ({ getAddress: () => account })
      };
      const mockSigner = { getAddress: () => account };
      
      setAccount(account);
      setProvider(mockProvider);
      setSigner(mockSigner);
      setChainId(APP_CONFIG.chainId);
      setIsConnected(true);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      });

    } catch (error) {
      console.error('Error connecting to wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsConnected(false);
  };

  const switchNetwork = async (targetChainId: number) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Error switching network:', error);
      // Try to add the network if it doesn't exist
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${targetChainId.toString(16)}`,
            chainName: 'Kaia Kairos Testnet',
            nativeCurrency: {
              name: 'KAIA',
              symbol: 'KAIA',
              decimals: 18
            },
            rpcUrls: [APP_CONFIG.rpcUrl],
            blockExplorerUrls: [APP_CONFIG.explorerUrl]
          }],
        });
      } catch (addError) {
        console.error('Error adding network:', addError);
        alert('Failed to add Kaia Kairos Testnet. Please add it manually in MetaMask.');
      }
    }
  };

  useEffect(() => {
    // Check if already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
      setIsConnected(true);
    }
  }, []);

  const value: Web3ContextType = {
    account,
    provider,
    signer,
    chainId,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    switchNetwork,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

declare global {
  interface Window {
    ethereum?: any;
  }
} 