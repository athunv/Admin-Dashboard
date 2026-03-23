import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronDown, MoreHorizontal, 
  Download, Trash2, Eye, CheckCircle2, 
  X, Plus, CreditCard, ShoppingBag
} from 'lucide-react';

const OrderManagement = () => {
  // --- Core State Management ---
  const [orders, setOrders] = useState([
    { id: '#ORD-7729', date: '2026-03-14', customer: 'Darrell Steward', email: 'darrell@example.com', total: 450.00, status: 'Completed', method: 'Shopify' },
    { id: '#ORD-7730', date: '2026-03-14', customer: 'Wade Warren', email: 'wade.w@gmail.com', total: 1299.00, status: 'Processing', method: 'Amazon' },
    { id: '#ORD-7731', date: '2026-03-13', customer: 'Jane Cooper', email: 'jane_c@outlook.com', total: 89.99, status: 'Cancelled', method: 'Shopify' },
    { id: '#ORD-7732', date: '2026-03-13', customer: 'Guy Hawkins', email: 'guy.h@hawkins.io', total: 240.50, status: 'Completed', method: 'Direct' },
  ]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // --- New Order Form State ---
  const [newOrder, setNewOrder] = useState({ customer: '', email: '', total: '', method: 'Shopify' });

  // --- Filtering Logic (Working) ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.customer.toLowerCase().includes(search.toLowerCase()) || order.id.includes(search);
      const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, filterStatus]);

  // --- Actions ---
  const handleCreateOrder = (e) => {
    e.preventDefault();
    const order = {
      ...newOrder,
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      total: parseFloat(newOrder.total) || 0
    };
    setOrders([order, ...orders]);
    setIsCreateModalOpen(false);
    setNewOrder({ customer: '', email: '', total: '', method: 'Shopify' });
  };

  const deleteSelected = () => {
    setOrders(orders.filter(o => !selectedOrders.includes(o.id)));
    setSelectedOrders([]);
  };

  const getStatusStyle = (s) => {
    if (s === 'Completed') return 'bg-[#e7f7ef] text-[#0faf62]';
    if (s === 'Processing') return 'bg-blue-50 text-blue-600';
    if (s === 'Cancelled') return 'bg-red-50 text-red-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="bg-[#f8f9fa]  p-4 min-h-screen font-sans text-[#1a1d1f]">
      <div className="max-w-340 mx-auto  ">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="sm:text-4xl text-2xl font-black font-serif italic tracking-tight">Orders Management</h1>
            <p className="text-sm italic text-[#6f767e] font-medium">Manage your sales channels in real-time</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#eff0f1] rounded-xl text-xs font-bold shadow-sm">
              <Download size={16} /> Export
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-[#1a1d1f] text-white rounded-xl text-xs font-bold shadow-md hover:bg-black transition-all"
            >
              <Plus size={16} /> Create New Order
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-2xl p-4 border border-[#eff0f1] shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9fa5]" size={18} />
              <input 
                type="text" placeholder="Search orders..." 
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-200"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
              {['All', 'Processing', 'Completed', 'Cancelled'].map(s => (
                <button 
                  key={s} onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === s ? 'bg-[#1a1d1f] text-white' : 'text-[#6f767e] hover:bg-[#f8f9fa]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedOrders.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="bg-[#1a1d1f] text-white px-6 py-3 rounded-2xl flex items-center justify-between mb-6 shadow-xl"
            >
              <p className="text-xs font-bold">{selectedOrders.length} Orders Selected</p>
              <div className="flex gap-4">
                <button onClick={deleteSelected} className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300"><Trash2 size={14}/> Delete</button>
                <button onClick={() => setSelectedOrders([])} className="text-[#9a9fa5] hover:text-white"><X size={16}/></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orders Table */}
        <div className="bg-white rounded-[24px] border border-[#eff0f1] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfcfc] border-b border-[#eff0f1]">
                <th className="p-5 w-10">
                  <input type="checkbox" onChange={(e) => setSelectedOrders(e.target.checked ? orders.map(o => o.id) : [])} />
                </th>
                <th className="p-5 text-[11px] font-bold text-[#9a9fa5] uppercase tracking-wider">Order</th>
                <th className="p-5 text-[11px] font-bold text-[#9a9fa5] uppercase tracking-wider">Customer</th>
                <th className="p-5 text-[11px] font-bold text-[#9a9fa5] uppercase tracking-wider">Total</th>
                <th className="p-5 text-[11px] font-bold text-[#9a9fa5] uppercase tracking-wider">Status</th>
                <th className="p-5 text-[11px] font-bold text-[#9a9fa5] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff0f1]">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-[#f8f9fa] group transition-colors">
                  <td className="p-5">
                    <input type="checkbox" checked={selectedOrders.includes(order.id)} 
                      onChange={() => setSelectedOrders(prev => prev.includes(order.id) ? prev.filter(i => i !== order.id) : [...prev, order.id])} 
                    />
                  </td>
                  <td className="p-5">
                    <p className="text-sm font-bold text-[#1a1d1f]">{order.id}</p>
                    <p className="text-[10px] text-[#9a9fa5] font-medium">{order.date}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{order.customer}</span>
                      <span className="text-[11px] text-[#6f767e]">{order.email}</span>
                    </div>
                  </td>
                  <td className="p-5 text-sm font-bold">${order.total.toFixed(2)}</td>
                  <td className="p-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button onClick={() => setViewingOrder(order)} className="p-2 hover:bg-gray-200 rounded-lg text-[#6f767e] hover:text-[#1a1d1f]">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Order Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <motion.form onSubmit={handleCreateOrder} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
              >
                <h2 className="text-xl font-bold mb-6">Create New Order</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#6f767e] mb-1 block">Customer Name</label>
                    <input required className="w-full p-3 bg-[#f8f9fa] rounded-xl border-none text-sm" 
                      value={newOrder.customer} onChange={e => setNewOrder({...newOrder, customer: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#6f767e] mb-1 block">Email</label>
                    <input required type="email" className="w-full p-3 bg-[#f8f9fa] rounded-xl border-none text-sm" 
                      value={newOrder.email} onChange={e => setNewOrder({...newOrder, email: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#6f767e] mb-1 block">Total Amount ($)</label>
                      <input required type="number" className="w-full p-3 bg-[#f8f9fa] rounded-xl border-none text-sm" 
                        value={newOrder.total} onChange={e => setNewOrder({...newOrder, total: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6f767e] mb-1 block">Method</label>
                      <select className="w-full p-3 bg-[#f8f9fa] rounded-xl border-none text-sm font-bold"
                        value={newOrder.method} onChange={e => setNewOrder({...newOrder, method: e.target.value})}
                      >
                        <option>Shopify</option>
                        <option>Amazon</option>
                        <option>Direct</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-[#6f767e]">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#1a1d1f] text-white rounded-xl text-sm font-bold shadow-lg">Create Order</button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>

        {/* Order Details Slide-over (Working) */}
        <AnimatePresence>
          {viewingOrder && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingOrder(null)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80]" />
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
                className="fixed right-0 top-0 h-screen w-full max-w-sm bg-white z-[90] shadow-2xl p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-lg">Order Details</h3>
                  <button onClick={() => setViewingOrder(null)} className="p-2 bg-gray-100 rounded-full"><X size={18}/></button>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-[10px] font-bold text-[#9a9fa5] uppercase">Order Amount</p>
                    <h2 className="text-3xl font-bold">${viewingOrder.total.toFixed(2)}</h2>
                  </div>
                  <div className="space-y-4">
                    <DetailRow label="ID" value={viewingOrder.id} />
                    <DetailRow label="Customer" value={viewingOrder.customer} />
                    <DetailRow label="Channel" value={viewingOrder.method} />
                    <DetailRow label="Status" value={viewingOrder.status} />
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold mb-3 flex items-center justify-center gap-2">
                      <CreditCard size={14}/> Send Payment Link
                    </button>
                    <button className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                      <ShoppingBag size={14}/> Print Invoice
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-50 pb-3">
    <span className="text-xs font-bold text-[#6f767e]">{label}</span>
    <span className="text-xs font-bold text-[#1a1d1f]">{value}</span>
  </div>
);

export default OrderManagement;