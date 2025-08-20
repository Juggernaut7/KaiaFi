import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X,
  Home,
  TrendingUp,
  Wallet,
  BarChart3,
  PieChart,
  History,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

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
    { name: 'History', href: '/history', icon: History },
  ];

  const externalLinks = [
    { name: 'Kaia Network', href: 'https://kaia.network', icon: ExternalLink },
    { name: 'Documentation', href: 'https://docs.kaia.network', icon: HelpCircle },
    { name: 'Discord', href: 'https://discord.gg/kaia', icon: ExternalLink },
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
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">KaiaFi</h1>
                <p className="text-xs text-gray-500">DeFi on Kaia</p>
              </div>
            </Link>
            
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Main
              </h3>
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => onClose()}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                        ${isActive(item.href)
                          ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className={`
                        mr-3 h-5 w-5 transition-colors
                        ${isActive(item.href)
                          ? 'text-green-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                        }
                      `} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* External Links */}
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Resources
              </h3>
              <div className="space-y-1">
                {externalLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-colors" />
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                🚀 Hackathon Project
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Korea Stablecoin Hackathon 2025
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Kaia Network</span>
                <span>DeFi Lending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 