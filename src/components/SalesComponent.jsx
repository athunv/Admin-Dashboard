import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, X, ChevronLeft, ChevronRight, 
  MoreHorizontal, Edit3, Trash2, Check
} from 'lucide-react';

// --- Constants ---
const INITIAL_SALES = [
  { id: '#ORD-7421', customer: 'Dianne Russell', date: 'Mar 14, 2026', amount: '$450.00', status: 'Completed', color: 'text-green-600 bg-green-50' },
  { id: '#ORD-7422', customer: 'Wade Warren', date: 'Mar 14, 2026', amount: '$1,200.50', status: 'Pending', color: 'text-orange-600 bg-orange-50' },
  { id: '#ORD-7423', customer: 'Albert Flores', date: 'Mar 13, 2026', amount: '$89.99', status: 'Completed', color: 'text-green-600 bg-green-50' },
  { id: '#ORD-7424', customer: 'Bessie Cooper', date: 'Mar 13, 2026', amount: '$540.00', status: 'Cancelled', color: 'text-red-600 bg-red-50' },
];

const STATUS_CONFIG = {
  Completed: 'text-green-600 bg-green-50',
  Pending: 'text-orange-600 bg-orange-50',
  Cancelled: 'text-red-600 bg-red-50'
};

// --- Order Modal Component ---
const OrderModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({ customer: '', amount: '', status: 'Pending' });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ 
          customer: initialData.customer, 
          amount: initialData.amount.replace(/[$,]/g, ''), 
          status: initialData.status 
        });
      } else {
        setFormData({ customer: '', amount: '', status: 'Pending' });
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      id: initialData?.id || `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: initialData?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: STATUS_CONFIG[formData.status],
      amount: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.amount)
    };
    onSubmit(finalData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-900">{initialData ? 'Edit Order' : 'New Order'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Customer Name</label>
            <input 
              required
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-slate-200 outline-none font-bold"
              value={formData.customer}
              onChange={e => setFormData({...formData, customer: e.target.value})}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Amount</label>
            <input 
              required
              type="number" step="0.01"
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-slate-200 outline-none font-bold"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Status</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl outline-none font-bold appearance-none"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-slate-200">
            <Check size={18} /> {initialData ? 'Update Order' : 'Create Order'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- Main Sales Component ---
const SalesComponent = () => {
  const [sales, setSales] = useState(INITIAL_SALES);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const itemsPerPage = 4;

  // Filtering Logic
  const filteredData = useMemo(() => {
    return sales.filter((item) => {
      const matchesSearch = item.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, sales]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handlers
  const handleAddEdit = (order) => {
    setSales(prev => {
      const exists = prev.some(s => s.id === order.id);
      if (exists) {
        return prev.map(s => s.id === order.id ? order : s);
      }
      return [order, ...prev];
    });
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleDelete = (id) => {
    setSales(prev => prev.filter(s => s.id !== id));
    setActiveMenuId(null);
  };

  // Action Menu Sub-component
  const ActionMenu = ({ order, onClose }) => {
    const menuRef = useRef(null);

    useEffect(() => {
      const clickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
      };
      document.addEventListener('mousedown', clickOutside);
      return () => document.removeEventListener('mousedown', clickOutside);
    }, [onClose]);

    return (
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.9, y: -10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-[110] py-2 overflow-hidden"
      >
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            setEditingOrder(order); 
            setIsModalOpen(true); 
            onClose(); 
          }} 
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-gray-50 transition-colors"
        >
          <Edit3 size={16} /> Edit Order
        </button>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            handleDelete(order.id); 
          }} 
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} /> Delete Order
        </button>
      </motion.div>
    );
  };

  return (
    <div className="bg-white p-4  rounded-[40px] border border-gray-100 shadow-sm mt-8 max-w-340 mx-auto">
      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingOrder(null); }} 
        onSubmit={handleAddEdit}
        initialData={editingOrder}
      />

      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
        <div>
          <h3 className="sm:text-4xl text-2xl font-black text-slate-900 tracking-tight font-serif italic">Recent Transactions</h3>
          <p className="text-sm text-gray-400 mt-1 font-bold">{filteredData.length} total orders found</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search ID or Name..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-slate-200 outline-none transition-all font-bold"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-600 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button 
            onClick={() => { setEditingOrder(null); setIsModalOpen(true); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-100"
          >
            <Plus size={18} /> New Order
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-[11px] font-black uppercase tracking-[0.15em]">
              <th className="px-6 pb-2">Order ID</th>
              <th className="px-6 pb-2">Customer</th>
              <th className="px-6 pb-2">Amount</th>
              <th className="px-6 pb-2">Status</th>
              <th className="px-6 pb-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {paginatedData.map((order) => (
                <motion.tr 
                  key={order.id} layout
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 font-bold text-sm text-slate-900 border-y border-l border-gray-50 rounded-l-[24px]">{order.id}</td>
                  <td className="px-6 py-5 border-y border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-500 uppercase">{order.customer.charAt(0)}</div>
                      <span className="text-sm font-bold text-slate-800">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-slate-900 border-y border-gray-50">{order.amount}</td>
                  <td className="px-6 py-5 border-y border-gray-50">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide ${order.color}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-5 text-right border-y border-r border-gray-50 rounded-r-[24px] relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === order.id ? null : order.id)} 
                      className="p-2 text-gray-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    <AnimatePresence>
                      {activeMenuId === order.id && (
                        <ActionMenu order={order} onClose={() => setActiveMenuId(null)} />
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedData.map((order) => (
          <div key={order.id} className="p-6 border border-gray-100 rounded-[32px] bg-white shadow-sm relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-sm font-black text-slate-700">{order.customer.charAt(0)}</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 leading-none mb-1">{order.id}</p>
                  <p className="font-bold text-slate-900">{order.customer}</p>
                </div>
              </div>
              <div className="relative">
                <button onClick={() => setActiveMenuId(activeMenuId === order.id ? null : order.id)} className="p-2 text-gray-400"><MoreHorizontal size={20} /></button>
                <AnimatePresence>
                  {activeMenuId === order.id && <ActionMenu order={order} onClose={() => setActiveMenuId(null)} />}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex justify-between items-end pt-5 border-t border-gray-50">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Amount</p>
                <p className="text-xl font-black text-slate-900">{order.amount}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${order.color}`}>{order.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="py-20 text-center">
          <div className="bg-gray-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-300" size={24} />
          </div>
          <h4 className="font-bold text-slate-900">No transactions found</h4>
          <p className="text-sm text-gray-400">Try adjusting your filters or search term</p>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400 font-bold">Showing <span className="text-slate-900">{paginatedData.length}</span> of {filteredData.length} results</p>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)} 
            className="p-3 border border-gray-200 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages || totalPages === 0} 
            onClick={() => setCurrentPage(p => p + 1)} 
            className="p-3 border border-gray-200 rounded-2xl disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesComponent;