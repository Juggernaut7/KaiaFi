import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Lending from './pages/Lending';
import Borrowing from './pages/Borrowing';
import Portfolio from './pages/Portfolio';
import Markets from './pages/Markets';

// Context
import { Web3Provider } from './context/Web3Context';
import { LendingProvider } from './context/LendingContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <LendingProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex">
              {/* Sidebar */}
              <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              
              {/* Main Content Area */}
              <div className="main-content">
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(true)} />
                
                {/* Page Content */}
                <main className="page-content">
                  <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/lending" element={<Lending />} />
                      <Route path="/borrowing" element={<Borrowing />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/markets" element={<Markets />} />
                    </Routes>
                  </div>
                </main>
              </div>
              
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#10B981',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </LendingProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;
