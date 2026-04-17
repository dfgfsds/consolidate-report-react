import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, BarChart2, FileUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    { title: 'Total Stock', value: '4,234', change: '+12%', icon: <Package />, color: 'blue' },
    { title: 'Sales Today', value: '156', change: '+5%', icon: <ShoppingCart />, color: 'indigo' },
    { title: 'Purchases', value: '89', change: '-2%', icon: <BarChart2 />, color: 'emerald' },
    { title: 'Reports Ready', value: '24', change: '+8', icon: <FileUp />, color: 'amber' },
  ];

  const quickActions = [
    { name: 'Consolidate Stock', path: '/stock', desc: 'Merge multiple shop reports' },
    { name: 'Process Sales', path: '/sales', desc: 'Upload daily sales CSV' },
    { name: 'Vendor Invoices', path: '/purchase', desc: 'Sync purchase orders' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Welcome back to <span className="text-blue-400">Processor Pro.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl">
              Manage your hardware shop reports with ease. Consolidate inventory, process transactions, and generate MIS reports in seconds.
            </p>
            <div className="flex gap-4">
              <Link to="/stock" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold flex items-center gap-2 transition-all hover:gap-3 group">
                Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="hidden lg:block w-72 h-72 bg-slate-800 rounded-[3rem] border border-slate-700 shadow-inner p-8 rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="space-y-4">
              <div className="h-4 w-3/4 bg-slate-700 rounded-full"></div>
              <div className="h-4 w-1/2 bg-slate-700 rounded-full"></div>
              <div className="h-20 w-full bg-blue-500/20 rounded-2xl border border-blue-500/30 flex items-center justify-center">
                <LayoutDashboard className="text-blue-400" size={32} />
              </div>
              <div className="h-4 w-full bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
              {React.cloneElement(stat.icon, { size: 24 })}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{stat.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickActions.map((action, idx) => (
          <Link 
            key={idx} 
            to={action.path}
            className="group bg-white p-8 rounded-[2rem] border border-transparent border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-xl transition-all"
          >
            <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{action.name}</h4>
            <p className="text-gray-500 text-sm mb-6">{action.desc}</p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <span>Launch Module</span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
