import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { APP_CONFIG } from '../constants';
import { 
  Menu, 
  Wallet, 
  Network, 
  ChevronDown,
  Bell,
  Settings,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { account, isConnected, connect, disconnect, chainId, switchNetwork, isConnecting } = useWeb3();
  const [showNotifications, setShowNotifications] = useState(false);

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

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Transaction Successful',
      message: 'Successfully supplied 1000 USDT',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'Health Factor Alert',
      message: 'Your health factor is 1.8 - consider adding collateral',
      time: '5 minutes ago'
    },
    {
      id: 3,
      type: 'success',
      title: 'Interest Earned',
      message: 'You earned 2.5 USDT in interest',
      time: '1 hour ago'
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-3"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center group">
              <div className="flex-shrink-0">
                <img 
                  src="/KF logo.png" 
                  alt="KaiaFi Logo" 
                  className="h-16 w-20 rounded-xl transition-transform duration-200 group-hover:scale-105"
                />
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
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-500">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200 relative">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200">
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
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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