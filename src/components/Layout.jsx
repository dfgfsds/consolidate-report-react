import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  const location = useLocation();
  const pageTitle = location.pathname.replace('/', '') || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen transition-all duration-300">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-[5]">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight capitalize">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
              <span className="text-sm font-bold">FTDS</span>
            </div>
          </div>
        </header>
        <main className="p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default Layout;
