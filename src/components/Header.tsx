import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { APP_CONFIG } from '../constants';
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
  const { account, isConnected, connect, disconnect, chainId, switchNetwork, isConnecting } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = () => {
    if (chainId === APP_CONFIG.chainId) {
      return 'Kaia Kairos Testnet';
    }
    return 'Unknown Network';
  };

  const getNetworkColor = () => {
    if (chainId === APP_CONFIG.chainId) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const handleNetworkSwitch = () => {
    switchNetwork(APP_CONFIG.chainId);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-green-600">KaiaFi</h1>
              </div>
            </Link>
          </div>

          {/* Right side - Network and Wallet */}
          <div className="flex items-center space-x-4">
            {/* Network Status */}
            <div className="hidden sm:flex items-center space-x-2">
              <Network className="h-4 w-4 text-gray-400" />
              <button
                onClick={handleNetworkSwitch}
                className={`px-3 py-1 rounded-full text-xs font-medium ${getNetworkColor()} hover:opacity-80 transition-opacity`}
              >
                {getNetworkName()}
                <ChevronDown className="inline ml-1 h-3 w-3" />
              </button>
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
              <Bell className="h-5 w-5" />
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
              <Settings className="h-5 w-5" />
            </button>

            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block">
                  <div className="text-sm text-gray-500">Connected</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatAddress(account!)}
                  </div>
                </div>
                <button
                  onClick={disconnect}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 