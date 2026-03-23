import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, X, ChevronLeft, ChevronRight, 
  MoreHorizontal, Edit3, Trash2, Check, UserPlus, 
  Download, TrendingUp, Users
} from 'lucide-react';

// --- Constants ---
const INITIAL_CUSTOMERS = [
  { id: 'CUST-101', name: 'Dianne Russell', email: 'dianne.r@gmail.com', spent: 4250.00, orders: 12, tier: 'VIP', status: 'Active' },
  { id: 'CUST-102', name: 'Wade Warren', email: 'wade.w@outlook.com', spent: 1200.50, orders: 5, tier: 'Regular', status: 'Active' },
  { id: 'CUST-103', name: 'Albert Flores', email: 'albert.f@yahoo.com', spent: 89.99, orders: 1, tier: 'New', status: 'Inactive' },
  { id: 'CUST-104', name: 'Bessie Cooper', email: 'bessie.c@gmail.com', spent: 540.00, orders: 3, tier: 'Regular', status: 'Active' },
  { id: 'CUST-105', name: 'Guy Hawkins', email: 'guy.h@msn.com', spent: 0, orders: 0, tier: 'New', status: 'Inactive' },
];

const TIER_CONFIG = {
  VIP: 'text-purple-600 bg-purple-50 border-purple-100',
  Regular: 'text-blue-600 bg-blue-50 border-blue-100',
  New: 'text-slate-600 bg-slate-50 border-slate-100'
};

// --- Modal Component ---
const CustomerModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ name: '', email: '', tier: 'New', status: 'Active', spent: 0 });

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? { ...initialData } : { name: '', email: '', tier: 'New', status: 'Active', spent: 0 });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-900">{initialData ? 'Edit Customer' : 'Add Customer'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-5">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
            <input required className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-slate-200 outline-none font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Email</label>
            <input required type="email" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-slate-200 outline-none font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Tier</label>
              <select className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none font-bold" value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})}>
                {Object.keys(TIER_CONFIG).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Status</label>
              <select className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none font-bold" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4 shadow-xl">
            <Check size={18} /> {initialData ? 'Save Changes' : 'Create Customer'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const CustomersComponent = () => {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // --- Calculations ---
  const filteredData = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [searchTerm, tierFilter, statusFilter, customers]);

  const stats = useMemo(() => {
    const totalRevenue = filteredData.reduce((acc, curr) => acc + curr.spent, 0);
    const avgSpent = filteredData.length > 0 ? totalRevenue / filteredData.length : 0;
    return {
      total: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue),
      average: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(avgSpent),
      count: filteredData.length
    };
  }, [filteredData]);

  // --- Handlers ---
  const handleAddEdit = (data) => {
    const finalObj = {
      ...data,
      id: data.id || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      orders: data.orders || 0,
      spent: Number(data.spent) || 0
    };
    setCustomers(prev => {
      const exists = prev.some(c => c.id === finalObj.id);
      return exists ? prev.map(c => c.id === finalObj.id ? finalObj : c) : [finalObj, ...prev];
    });
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setActiveMenuId(null);
  };

  // --- Action Menu Component ---
  const ActionMenu = ({ customer, onClose }) => {
    const menuRef = useRef(null);
    useEffect(() => {
      const clickOutside = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) onClose(); };
      document.addEventListener('mousedown', clickOutside);
      return () => document.removeEventListener('mousedown', clickOutside);
    }, [onClose]);

    return (
      <motion.div ref={menuRef} initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-[110] py-2 overflow-hidden"
      >
        <button onClick={(e) => { e.stopPropagation(); setEditingCustomer(customer); setIsModalOpen(true); onClose(); }} 
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-gray-50 transition-colors">
          <Edit3 size={16} /> Edit Profile
        </button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }} 
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
          <Trash2 size={16} /> Delete Customer
        </button>
      </motion.div>
    );
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-[48px] border border-gray-100 shadow-sm max-w-7xl mx-auto my-10 font-sans">
      <CustomerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddEdit} initialData={editingCustomer} />
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10">
        <div>
          <h2 className="sm:text-4xl text-2xl font-black text-slate-900 tracking-tight font-serif italic">Customers</h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-slate-400 font-bold">Audience Intelligence</p>
            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
            <p className="text-slate-900 font-black">{stats.count} filtered</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
            {['All', 'Active', 'Inactive'].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${statusFilter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search customers..." className="pl-11 pr-4 py-3.5 bg-gray-50 rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-200 border border-transparent outline-none w-64 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <button onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all">
            <UserPlus size={18}  /> New Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden group">
          <TrendingUp className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/5 rotate-12 transition-transform group-hover:rotate-0" />
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Dynamic Revenue</p>
          <h3 className="text-3xl font-black">{stats.total}</h3>
          <p className="text-xs font-bold text-slate-400 mt-2">From filtered set</p>
        </div>
        <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Average LTV</p>
          <h3 className="text-3xl font-black text-slate-900">{stats.average}</h3>
          <p className="text-xs font-bold text-slate-400 mt-2">Lifetime value</p>
        </div>
        <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Segment Size</p>
          <h3 className="text-3xl font-black text-slate-900">{stats.count}</h3>
          <p className="text-xs font-bold text-slate-400 mt-2">Active Profiles</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-[11px] font-black uppercase tracking-[0.15em]">
              <th className="px-6 pb-2">Profile</th>
              <th className="px-6 pb-2">Status</th>
              <th className="px-6 pb-2">Segment</th>
              <th className="px-6 pb-2">Orders</th>
              <th className="px-6 pb-2">Spent</th>
              <th className="px-6 pb-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {filteredData.map((customer) => (
                <motion.tr key={customer.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="group">
                  <td className="px-6 py-5 bg-gray-50/30 group-hover:bg-gray-50 rounded-l-[24px] transition-colors border-y border-l border-transparent group-hover:border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-black text-slate-700 shadow-sm">{customer.name.charAt(0)}</div>
                      <div>
                        <p className="font-black text-slate-900 text-sm leading-none mb-1">{customer.name}</p>
                        <p className="text-xs text-gray-400 font-bold">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 bg-gray-50/30 group-hover:bg-gray-50 border-y border-transparent group-hover:border-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${customer.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`}></span>
                      <span className="text-xs font-black text-slate-700 uppercase">{customer.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 bg-gray-50/30 group-hover:bg-gray-50 border-y border-transparent group-hover:border-gray-100 transition-colors">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${TIER_CONFIG[customer.tier]}`}>{customer.tier}</span>
                  </td>
                  <td className="px-6 py-5 bg-gray-50/30 group-hover:bg-gray-50 border-y border-transparent group-hover:border-gray-100 font-bold text-slate-600 text-sm">{customer.orders}</td>
                  <td className="px-6 py-5 bg-gray-50/30 group-hover:bg-gray-50 border-y border-transparent group-hover:border-gray-100 font-black text-slate-900 text-sm">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(customer.spent)}
                  </td>
                  <td className="px-6 py-5 bg-gray-50/30 group-hover:bg-gray-50 rounded-r-[24px] border-y border-r border-transparent group-hover:border-gray-100 text-right relative">
                    <button onClick={() => setActiveMenuId(activeMenuId === customer.id ? null : customer.id)} className="p-2.5 text-gray-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm">
                      <MoreHorizontal size={18} />
                    </button>
                    <AnimatePresence>
                      {activeMenuId === customer.id && <ActionMenu customer={customer} onClose={() => setActiveMenuId(null)} />}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersComponent;