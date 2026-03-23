import React, { useState } from 'react';
import {
  Bell, ChevronDown, DollarSign, ShoppingCart, Users, RotateCcw,
  MoreHorizontal, Download, Calendar, Menu, X, Check
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Tooltip
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import SalesComponent from './SalesComponent';
import CustomersComponent from './CustomersComponent';
import ReportsComponent from './ReportsComponent';
import OrderManagement from './OrderManagement';
import ProductManagement from './ProductManagement';
import ProfileSettings from './ProfileSettings';
import PageTitle from './PageTitle';

// --- Data ---
const profitData = [
  { name: 'Jan', sales: 25000, revenue: 20000 }, { name: 'Feb', sales: 35000, revenue: 15000 },
  { name: 'Mar', sales: 30000, revenue: 25000 }, { name: 'Apr', sales: 45000, revenue: 38000 },
  { name: 'May', sales: 75000, revenue: 65000 }, { name: 'Jun', sales: 55000, revenue: 48000 },
  { name: 'Jul', sales: 48000, revenue: 35000 }, { name: 'Aug', sales: 48000, revenue: 42000 },
  { name: 'Sep', sales: 52000, revenue: 45000 }, { name: 'Oct', sales: 32000, revenue: 45000 },
  { name: 'Nov', sales: 42000, revenue: 38000 }, { name: 'Dec', sales: 50000, revenue: 45000 },
];

const customerOrdersData = [
  { name: 'Jun', value: 3000 }, { name: 'Jul', value: 2800 },
  { name: 'Aug', value: 4500 }, { name: 'Sep', value: 3800 },
  { name: 'Oct', value: 3200 }, { name: 'Nov', value: 3900 },
  { name: 'Dec', value: 3800 },
];

const countryData = [
  { name: 'United States', value: 45, color: '#3b82f6' },
  { name: 'Brazil', value: 25, color: '#22c55e' },
  { name: 'Finland', value: 15, color: '#a855f7' },
  { name: 'Bangladesh', value: 15, color: '#f97316' },
];

const topProducts = [
  { name: 'Adidas Ultraboost 22', category: 'Running Shoes', price: '$180', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100&h=100&fit=crop' },
  { name: 'Samsung Galaxy Watch 6', category: 'Smartwatch', price: '$299', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=100&h=100&fit=crop' },
  { name: 'Sony WH-1000XM5', category: 'Noise-Canceling Headphones', price: '$399', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100&h=100&fit=crop' },
  { name: 'Apple AirPods Pro (2nd G...', category: 'Wireless Earbuds', price: '$249', img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&h=100&fit=crop' },
];

// --- Dropdown Wrapper ---
const DropdownWrapper = ({ isOpen, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-2"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default function RexoraDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navItems = ['Dashboard', 'Products', 'Sales', 'Customers', 'Reports', 'Orders'];

  const toggleDropdown = (name) => setActiveDropdown(activeDropdown === name ? null : name);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl">
          <p className="text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-8">
                <span className="text-sm font-medium" style={{ color: entry.color }}>
                  {entry.name} :
                </span>
                <span className="text-sm font-bold text-white">
                  {entry.value}k
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">

      <PageTitle title={activeTab} />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-100 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-101 p-6 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">

                  <span className="text-xl font-bold">Rexora</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map(item => (
                  <button
                    key={item}
                    onClick={() => { setActiveTab(item); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item ? 'bg-[#C1E1A6] text-black shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F9FAFB]/80 backdrop-blur-md px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-white rounded-xl shadow-sm">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1">
              {/* Use a version of the logo that is just the 'A2H' icon */}
              <img src="/images/logo.png" className='w-30 h-auto object-contain sm:block hidden' alt="A2Hun Logo" />
              <span className="text-2xl font-black font-serif tracking-tight text-slate-900">A2Hun</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center bg-white border border-gray-100 rounded-full px-2 py-1 shadow-sm">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === item ? 'bg-[#C1E1A6] text-slate-900' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button
                onClick={() => toggleDropdown('notif')}
                className={`p-2.5 rounded-xl transition-colors ${activeDropdown === 'notif' ? 'bg-orange-50 text-orange-500' : 'text-gray-400 hover:bg-white hover:shadow-sm'}`}
              >
                <Bell size={20} />
              </button>
              <DropdownWrapper isOpen={activeDropdown === 'notif'}>
                <p className="p-3 text-xs font-bold text-gray-400 uppercase">Notifications</p>
                <div className="space-y-1">
                  {[1, 2].map(n => (
                    <div key={n} className="flex gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Check size={14} /></div>
                      <div>
                        <p className="text-sm font-bold">Order #1234 Confirmed</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownWrapper>
            </div>

            <div className="relative">
              <button
                onClick={() => toggleDropdown('profile')}
                className="flex items-center gap-3 pl-2 md:pl-4"
              >
                <img src="https://i.pravatar.cc/150?u=sajib" alt="Avatar" className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold leading-none">Athun V</p>
                  <p className="text-xs text-gray-500 mt-1">Admin</p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </button>
              <DropdownWrapper isOpen={activeDropdown === 'profile'}>
                <div className="p-2 space-y-1">
                  <button onClick={() => { setActiveTab('Account'); setActiveDropdown(null) }} className="w-full text-left p-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">Profile Settings</button>
                  <button className="w-full text-left p-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">Billing</button>
                  <hr className="my-2 border-gray-100" />
                  <button className="w-full text-left p-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">Logout</button>
                </div>
              </DropdownWrapper>
            </div>
          </div>
        </div>
      </nav>

      <main className={`max-w-340 mx-auto px-4 md:px-8 pb-12 relative`}>
        {activeTab === 'Dashboard' && (
          <>
            <header className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
              <div>
                <h1 className="sm:text-4xl text-2xl font-serif italic font-bold tracking-tight">Welcome, Athun </h1>
                <p className="text-gray-700 mt-2 text-sm italic">An overview of customer insights, sales performance, and revenue analytics.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                  <Calendar size={16} /> This Week
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                  <Download size={16} /> Export Report
                </button>
              </div>
            </header>


            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard title="Total Revenue" value="$68,837" change="+2.4% WoW" changeColor="text-green-500" icon={DollarSign} />
              <StatCard title="Total Orders" value="12,485" change="+3.1% WoW" changeColor="text-green-500" icon={ShoppingCart} />
              <StatCard title="Active Customers" value="4,263" change="+1.8% WoW" changeColor="text-green-500" icon={Users} />
              <StatCard title="Refund Rate" value="1.5%" change="-0.6% WoW" changeColor="text-green-500" icon={RotateCcw} />
            </div>

            {/* Middle Row: Profit Overview + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Profit Overview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Total Profit Overview</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <h2 className="text-3xl font-bold">$98,643.24</h2>
                      <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#10B981] text-xs font-semibold rounded-full">+8.4% ↗</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                </div>

                <div className="flex justify-between items-end mb-6 text-xs text-gray-500">
                  <div className="flex items-center gap-4 font-medium">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" /> Total Sales</div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#F97316]" /> Total Revenue</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center rounded bg-[#D1FAE5] text-[#059669] font-bold">S</div>
                      <div className="leading-tight">
                        <div className="font-bold text-gray-900">Shopify</div>
                        <div className="text-[10px]">206 Payment</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center rounded bg-[#FFEDD5] text-[#EA580C] font-bold">a</div>
                      <div className="leading-tight">
                        <div className="font-bold text-gray-900">Amazon</div>
                        <div className="text-[10px]">400 Payment</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-62.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profitData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} ticks={[0, 20000, 40000, 60000, 80000]} tickFormatter={(val) => val === 0 ? '0k' : `${val / 1000}k`} />
                      <Bar dataKey="sales" fill="#E5E7EB" radius={[2, 2, 0, 0]} barSize={12} />
                      <Bar dataKey="revenue" fill="#F97316" radius={[2, 2, 0, 0]} barSize={12} />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 4 }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Top Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                </div>
                <div className="flex flex-col gap-5 flex-1 justify-center">
                  {topProducts.map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={product.img} alt={product.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{product.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Row: Customer Orders + Sales by Countries */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Customer Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                className="lg:col-span-1 bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Customer Orders</h3>
                    <p className="text-xs text-gray-400 mt-1">1 Jan - 12 Dec 2026</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">45,6370</h2>
                <div className="flex items-center gap-2 mt-2 mb-8">
                  <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#10B981] text-xs font-semibold rounded-full">+9.4% ↗</span>
                  <span className="text-xs font-medium text-gray-500">+245</span>
                </div>
                <div className="h-25 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={customerOrdersData}>
                      <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} dy={10} />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 4 }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorOrders)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Sales by Countries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Sales by Countries</h3>
                    <p className="text-xs text-gray-500 mt-1">Revenue distribution by region</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
                      All Products <ChevronDown size={14} />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
                      Top Countries <ChevronDown size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between w-full mt-4">
                  <div className="flex-1 space-y-6">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Top Performing Country</p>
                      <h3 className="text-2xl font-bold text-gray-900">$1,245,680</h3>
                      <p className="text-xs text-gray-500 mt-1">United States</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Revenue Growth</p>
                      <h3 className="text-xl font-bold text-[#10B981]">+34%</h3>
                      <p className="text-xs text-gray-500 mt-1">United States and Canada</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-gray-900">$2,401,420</h3>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center mt-6 md:mt-0">
                    <div className="h-45 w-full max-w-50">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={countryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {countryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 4 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs text-gray-600">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>United States</div>
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></div>Brazil</div>
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]"></div>Finland</div>
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></div>Bangladesh</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* --- Missing Tab Views --- */}
        {activeTab === 'Products' && <ProductManagement />}
        {activeTab === 'Sales' && (<SalesComponent />)}
        {activeTab === 'Customers' && <CustomersComponent />}
        {activeTab === 'Reports' && <ReportsComponent />}
        {activeTab === 'Orders' && <OrderManagement />}
        {activeTab === 'Account' && <ProfileSettings />}
      </main>
    </div>
  );
}

function StatCard({ title, value, change, changeColor, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-500 font-medium text-sm">{title}</span>
        <div className="p-2 bg-gray-100 rounded-full text-gray-500">
          <Icon size={18} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className={`text-xs mt-2 font-medium ${changeColor}`}>
          {change}
        </p>
      </div>
    </motion.div>
  );
}