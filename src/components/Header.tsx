import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { 
  Menu, 
  Wallet, 
  Network, 
  ChevronDown,
  Bell,
  Settings
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { 
    account, 
    isConnected, 
    connect, 
    disconnect, 
    chainId, 
    switchNetwork,
    isConnecting 
  } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number | null) => {
    if (chainId === 1337) return 'Kaia Testnet';
    if (chainId === 1) return 'Ethereum';
    if (chainId === 137) return 'Polygon';
    return `Chain ${chainId}`;
  };

  const getNetworkColor = (chainId: number | null) => {
    if (chainId === 1337) return 'bg-green-500';
    if (chainId === 1) return 'bg-blue-500';
    if (chainId === 137) return 'bg-purple-500';
    return 'bg-gray-500';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">KaiaFi</h1>
                <p className="text-xs text-gray-500">DeFi on Kaia Network</p>
              </div>
            </Link>
          </div>

          {/* Center - Network Status */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${getNetworkColor(chainId)}`} />
              <span className="text-sm font-medium text-gray-700">
                {getNetworkName(chainId)}
              </span>
              {chainId !== 1337 && (
                <button
                  onClick={() => switchNetwork(1337)}
                  className="ml-2 text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  Switch to Kaia
                </button>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
              <Settings className="h-5 w-5" />
            </button>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-3">
                {/* Network Switch */}
                <button
                  onClick={() => switchNetwork(1337)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Network className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {getNetworkName(chainId)}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </button>

                {/* Wallet Info */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <Wallet className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {formatAddress(account!)}
                  </span>
                </div>

                {/* Disconnect */}
                <button
                  onClick={disconnect}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors"
              >
                <Wallet className="h-4 w-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 