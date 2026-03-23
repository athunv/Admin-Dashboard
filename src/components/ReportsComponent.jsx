import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { MoreHorizontal, ChevronDown, Download, FileText, Check, Sparkles } from 'lucide-react';

// --- Exact Mock Data from Screenshot ---
const MONTHLY_REVENUE = [
    { name: 'Jan', sales: 25, revenue: 20 },
    { name: 'Feb', sales: 35, revenue: 22 },
    { name: 'Mar', sales: 30, revenue: 25 },
    { name: 'Apr', sales: 45, revenue: 38 },
    { name: 'May', sales: 75, revenue: 64 },
    { name: 'Jun', sales: 55, revenue: 48 },
    { name: 'Jul', sales: 40, revenue: 35 },
    { name: 'Aug', sales: 48, revenue: 42 },
    { name: 'Sep', sales: 52, revenue: 45 },
    { name: 'Oct', sales: 42, revenue: 32 },
    { name: 'Nov', sales: 42, revenue: 36 },
    { name: 'Dec', sales: 50, revenue: 44 },
];

const CUSTOMER_ORDERS = [
    { name: 'Jun', value: 10 }, { name: 'Jul', value: 8 },
    { name: 'Aug', value: 15 }, { name: 'Sep', value: 12 },
    { name: 'Oct', value: 10 }, { name: 'Nov', value: 14 },
    { name: 'Dec', value: 13 }
];

const COUNTRY_DATA = [
    { name: 'United States', value: 40, color: '#3b82f6' }, // Blue
    { name: 'Brazil', value: 20, color: '#22c55e' },        // Green
    { name: 'Finland', value: 20, color: '#8b5cf6' },       // Purple
    { name: 'Bangladesh', value: 20, color: '#f97316' },    // Orange
];

const TOP_PRODUCTS = [
    { name: 'Adidas Ultraboost 22', cat: 'Running Shoes', price: '$180', img: 'bg-blue-800' },
    { name: 'Samsung Galaxy Watch 6', cat: 'Smartwatch', price: '$299', img: 'bg-slate-800' },
    { name: 'Sony WH-1000XM5', cat: 'Noise-Canceling Headphones', price: '$399', img: 'bg-gray-300' },
    { name: 'Apple AirPods Pro (2nd G...', cat: 'Wireless Earbuds', price: '$249', img: 'bg-gray-900' },
];


const REPORTS_DATA = [
    { id: 1, title: 'Monthly Sales Report', desc: 'Complete breakdown of sales by product, region, and channel', date: 'Jan 15, 2026', size: '2.4 MB' },
    { id: 2, title: 'Customer Analytics Report', desc: 'Customer acquisition, retention, and lifetime value metrics', date: 'Jan 14, 2026', size: '1.8 MB' },
    { id: 3, title: 'Inventory Status Report', desc: 'Stock levels, reorder alerts, and inventory turnover', date: 'Jan 13, 2026', size: '956 KB' },
    { id: 4, title: 'Financial Summary Q4', desc: 'Revenue, expenses, profit margins, and cash flow', date: 'Jan 10, 2026', size: '3.1 MB' },
];

const ReportsComponent = () => {
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isCountryFilterOpen, setIsCountryFilterOpen] = useState(false);
    const [selectedCountryFilter, setSelectedCountryFilter] = useState('Top Countries');
    const [openReportId, setOpenReportId] = useState(null);
    const exportRef = useRef(null);
    const filterRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportRef.current && !exportRef.current.contains(event.target)) setIsExportOpen(false);
            if (filterRef.current && !filterRef.current.contains(event.target)) setIsCountryFilterOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl">
                    <p className="text-slate-100 text-xs font-bold mb-2 uppercase tracking-wider">{label}</p>
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
        <div className="bg-[#f8f9fa] p-4  min-h-screen font-sans text-[#1a1d1f]">
            <div className="max-w-350 mx-auto ">

                {/* Global Export Button (Requested previously) */}
                <div className="flex gap-2 justify-between mb-6" ref={exportRef}>
                    <h1 className='sm:text-4xl text-2xl font-black italic font-serif tracking-tight text-slate-900'>
                        Financial & Sales Reports
                    </h1>
                    <div className="relative">

                        <button
                            onClick={() => setIsExportOpen(!isExportOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eff0f1] rounded-xl text-xs font-bold shadow-sm hover:bg-[#f3f3f4]  transition-all"
                        >
                            <Sparkles size={14} className='hidden sm:block' /> Generate Report
                        </button>
                    </div>
                </div>

                {/* Top Row: Main Chart & Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                    {/* Main Revenue Bar Chart */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#eff0f1] shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-[32px] md:text-[40px] font-bold leading-none">$98,643.24</h2>
                                    <span className="bg-[#e7f7ef] text-[#0faf62] px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                        +18.4% <span className="text-[10px]">↗</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 mt-6">
                                    <div className="flex items-center gap-2 text-xs font-medium text-[#6f767e]">
                                        <div className="w-3 h-3 rounded-full bg-[#e2e4e8]" /> Total Sales
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-[#6f767e]">
                                        <div className="w-3 h-3 rounded-full bg-[#f97316]" /> Total Revenue
                                    </div>
                                </div>
                            </div>

                            {/* Payment Gateways Badges */}
                            <div className="flex gap-3">
                                <div className="flex items-center gap-3 px-3 py-2 bg-[#f8f9fa] rounded-xl border border-[#eff0f1]">
                                    <div className="w-6 h-6 rounded bg-[#e7f7ef] text-[#0faf62] flex items-center justify-center font-bold text-xs">S</div>
                                    <div>
                                        <p className="text-xs font-bold leading-tight">Shopify</p>
                                        <p className="text-[10px] text-[#6f767e]">206 Payment</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2 bg-[#f8f9fa] rounded-xl border border-[#eff0f1]">
                                    <div className="w-6 h-6 rounded bg-[#ffedd5] text-[#f97316] flex items-center justify-center font-bold text-xs">a</div>
                                    <div>
                                        <p className="text-xs font-bold leading-tight">Amazon</p>
                                        <p className="text-[10px] text-[#6f767e]">400 Payment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-65 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MONTHLY_REVENUE} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f4" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9a9fa5', fontSize: 11 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9a9fa5', fontSize: 11 }} tickFormatter={(val) => `${val}k`} />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 4 }}
                                    />
                                    <Bar dataKey="sales" fill="#e2e4e8" radius={[4, 4, 0, 0]} barSize={16} />
                                    <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Sellers List */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eff0f1] shadow-sm flex flex-col justify-center">
                        <div className="space-y-6">
                            {TOP_PRODUCTS.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Placeholder for actual product images */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${item.img}`}>
                                            <span className="text-xs opacity-50">IMG</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#1a1d1f] leading-tight mb-0.5">{item.name}</p>
                                            <p className="text-[11px] text-[#6f767e] font-medium">{item.cat}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold">{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Customer Orders Sparkline */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#eff0f1] shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-[15px] font-bold text-[#1a1d1f]">Customer Orders</h3>
                                <p className="text-xs text-[#6f767e] mt-1">1 Jan - 12 Dec 2026</p>
                            </div>
                            <button className="text-[#9a9fa5] hover:text-[#1a1d1f] transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="mt-2 mb-6">
                            <h2 className="text-[32px] md:text-[40px] font-bold leading-none mb-3">45,6370</h2>
                            <div className="flex items-center gap-2">
                                <span className="bg-[#e7f7ef] text-[#0faf62] px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                                    +9.4% ↗
                                </span>
                                <span className="text-[#6f767e] text-xs font-medium">+245</span>
                            </div>
                        </div>

                        <div className="h-25 w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={CUSTOMER_ORDERS} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 4 }}
                                    />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9a9fa5', fontSize: 10 }} dy={10} />
                                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#colorWave)" />
                                </AreaChart>

                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sales by Countries Card */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#eff0f1] shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                            <div>
                                <h3 className="text-[15px] font-bold text-[#1a1d1f]">Sales by Countries</h3>
                                <p className="text-xs text-[#6f767e] mt-1">Revenue distribution by region</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto" ref={filterRef}>
                                <button className="flex-1 sm:flex-none flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-[#eff0f1] rounded-lg text-[11px] font-medium text-[#1a1d1f]">
                                    All Products <ChevronDown size={14} className="text-[#9a9fa5]" />
                                </button>
                                <div className="relative flex-1 sm:flex-none">
                                    <button
                                        onClick={() => setIsCountryFilterOpen(!isCountryFilterOpen)}
                                        className="w-full flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-[#eff0f1] rounded-lg text-[11px] font-medium text-[#1a1d1f]"
                                    >
                                        {selectedCountryFilter} <ChevronDown size={14} className="text-[#9a9fa5]" />
                                    </button>
                                    {isCountryFilterOpen && (
                                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#eff0f1] rounded-xl shadow-lg z-50 py-1">
                                            {['Top Countries', 'Lowest Countries', 'All Regions'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => { setSelectedCountryFilter(opt); setIsCountryFilterOpen(false); }}
                                                    className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-medium text-[#6f767e] hover:bg-[#f8f9fa]"
                                                >
                                                    {opt} {selectedCountryFilter === opt && <Check size={12} className="text-[#1a1d1f]" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Left Side Stats */}
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[11px] text-[#6f767e] font-medium mb-1">Top Performing Country</p>
                                    <h4 className="text-[22px] font-bold text-[#1a1d1f] leading-none mb-1">$1,245,680</h4>
                                    <p className="text-[11px] text-[#6f767e] font-medium">United States</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-[#6f767e] font-medium mb-1">Revenue Growth</p>
                                    <h4 className="text-[22px] font-bold text-[#0faf62] leading-none mb-1">+34%</h4>
                                    <p className="text-[11px] text-[#6f767e] font-medium">United States and Canada</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-[#6f767e] font-medium mb-1">Total Revenue</p>
                                    <h4 className="text-[22px] font-bold text-[#1a1d1f] leading-none">$2,401,420</h4>
                                </div>
                            </div>

                            {/* Right Side Donut & Legend */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="h-50 w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={COUNTRY_DATA}
                                                innerRadius={65}
                                                outerRadius={95}
                                                paddingAngle={4}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {COUNTRY_DATA.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                content={<CustomTooltip />}
                                                cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 4 }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Exact Legend Grid from Screenshot */}
                                <div className="grid grid-cols-2 gap-x-12 gap-y-3 mt-4 w-max">
                                    {COUNTRY_DATA.map(item => (
                                        <div key={item.name} className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-[11px] font-medium text-[#6f767e]">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Available Reports Section */}
            <div className="mt-8 bg-white rounded-3xl p-6 md:p-8 border border-[#eff0f1] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-[#1a1d1f]">Available Reports</h3>
                        <p className="text-sm text-[#6f767e]">Download or schedule automated reports</p>
                    </div>
                    <button className="px-4 py-2 text-xs font-bold border border-[#eff0f1] rounded-xl hover:bg-gray-50 transition-colors">
                        View All Reports
                    </button>
                </div>

                <div className="space-y-4">
                    {REPORTS_DATA.map((report) => (
                        <div
                            key={report.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#eff0f1] rounded-2xl hover:border-[#f97316]/30 hover:bg-orange-50/10 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#f8f9fa] rounded-xl flex items-center justify-center text-[#6f767e] group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#1a1d1f]">{report.title}</h4>
                                    <p className="text-xs text-[#6f767e] mt-0.5">{report.desc}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="flex items-center gap-1 text-[10px] font-medium text-[#9a9fa5]">
                                            <MoreHorizontal size={10} className="rotate-90" /> Generated {report.date}
                                        </span>
                                        <span className="text-[10px] font-medium text-[#9a9fa5]">{report.size}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='relative'>
                                <button
                                    onClick={() => setOpenReportId(openReportId === report.id ? null : report.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eff0f1] rounded-xl text-xs font-bold shadow-sm hover:bg-[#f3f3f4] transition-all"
                                >
                                    <Download size={14} className='hidden sm:block' />
                                    Export Report
                                    <ChevronDown size={14} className={`text-[#9a9fa5] transition-transform ${openReportId === report.id ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {openReportId === report.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#eff0f1] rounded-xl shadow-lg z-50 py-1"
                                        >
                                            <button className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#6f767e] hover:bg-[#f8f9fa] hover:text-[#1a1d1f]">
                                                <FileText size={14} /> Download PDF
                                            </button>
                                            <button className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#6f767e] hover:bg-[#f8f9fa] hover:text-[#1a1d1f]">
                                                <Download size={14} /> Export CSV
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ReportsComponent;