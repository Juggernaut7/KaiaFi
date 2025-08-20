import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, TrendingUp, Wallet, BarChart3, PieChart, History, HelpCircle, ExternalLink } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Lending', href: '/lending', icon: TrendingUp },
    { name: 'Borrowing', href: '/borrowing', icon: Wallet },
    { name: 'Portfolio', href: '/portfolio', icon: PieChart },
    { name: 'Markets', href: '/markets', icon: BarChart3 },
  ];

  const externalLinks = [
    { name: 'Documentation', href: 'https://docs.kaia.network', icon: HelpCircle },
    { name: 'Kaia Network', href: 'https://kaia.network', icon: ExternalLink },
    { name: 'Explorer', href: 'https://baobab.klaytnscope.com', icon: ExternalLink },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:inset-0 lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">KaiaFi</h1>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <Icon 
                    className={`
                      mr-3 h-5 w-5 transition-colors duration-200
                      ${isActive(item.href)
                        ? 'text-green-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                      }
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* External Links */}
        <div className="mt-8 px-3">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Resources
          </h3>
          <div className="mt-2 space-y-1">
            {externalLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors duration-200" />
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-700">KaiaFi</h3>
            </div>
            <p className="text-xs text-gray-500">
              Korea Stablecoin Hackathon 2025
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Built on Kaia Network
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 