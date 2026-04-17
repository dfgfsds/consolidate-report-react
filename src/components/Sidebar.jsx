import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileUp, ShoppingCart, BarChart2, Package } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Stock', path: '/stock', icon: <Package size={20} /> },
    { name: 'Sales', path: '/sales', icon: <ShoppingCart size={20} /> },
    { name: 'Purchase', path: '/purchase', icon: <BarChart2 size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileUp size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar text-gray-300 flex flex-col fixed left-0 top-0 shadow-xl z-10 transition-all duration-300">
      <div className="p-6 flex items-center gap-3 border-b border-gray-700/50">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">
          C
        </div>
        <span className="text-xl font-bold text-white tracking-wider">CONSOLIDATE</span>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'hover:bg-sidebar-hover hover:text-white'
              }`
            }
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mb-4 mx-4 bg-sidebar-hover/50 rounded-2xl border border-gray-700/30">
        <p className="text-xs text-gray-400 mb-1 px-2">SYSTEM STATUS</p>
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300 font-medium tracking-tight">API Connected</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
