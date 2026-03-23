import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Edit3, Trash2, Filter, Download, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, 
  XCircle, Box, RotateCcw, X, AlertTriangle, Save
} from 'lucide-react';

const ProductManagement = () => {
  // --- State: Products Data ---
  const [products, setProducts] = useState(Array.from({ length: 45 }).map((_, i) => ({
    id: `PROD-${1000 + i}`,
    name: i % 3 === 0 ? 'Adidas Ultraboost 22' : i % 2 === 0 ? 'Sony WH-1000XM5' : 'Apple AirPods Pro',
    category: i % 3 === 0 ? 'Footwear' : i % 2 === 0 ? 'Electronics' : 'Audio',
    price: Math.floor(Math.random() * 500) + 50,
    stock: Math.floor(Math.random() * 100),
    sku: `SKU-${8800 + i}`,
    status: i % 15 === 0 ? 'Out of Stock' : i % 7 === 0 ? 'Low Stock' : 'Active',
    channels: i % 2 === 0 ? ['Shopify', 'Amazon'] : ['Direct']
  })));

  // --- State: UI & Pagination ---
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- State: Modals & Drawers ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // --- State: Actions (Add/Edit/Delete) ---
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({ name: '', sku: '', category: 'Electronics', price: '', stock: '', status: 'Active' });

  // --- State: Advanced Filters ---
  const [activeFilters, setActiveFilters] = useState({ category: 'All', status: 'All', minPrice: '', maxPrice: '' });

  // --- Search & Multi-Filter Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeFilters.category === 'All' || p.category === activeFilters.category;
      const matchesStatus = activeFilters.status === 'All' || p.status === activeFilters.status;
      const matchesMinPrice = activeFilters.minPrice === '' || p.price >= parseFloat(activeFilters.minPrice);
      const matchesMaxPrice = activeFilters.maxPrice === '' || p.price <= parseFloat(activeFilters.maxPrice);
      return matchesSearch && matchesCategory && matchesStatus && matchesMinPrice && matchesMaxPrice;
    });
  }, [products, search, activeFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedData = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasActiveFilters = activeFilters.category !== 'All' || activeFilters.status !== 'All' || activeFilters.minPrice !== '' || activeFilters.maxPrice !== '';

  // Prevent empty pages after deleting items
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // --- Handlers: Checkboxes ---
  const toggleSelectAll = () => selectedItems.length === paginatedData.length && paginatedData.length > 0 ? setSelectedItems([]) : setSelectedItems(paginatedData.map(p => p.id));
  const toggleSelect = (id) => setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  // --- Handlers: CRUD Operations ---
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', sku: `SKU-${Math.floor(Math.random() * 9000) + 1000}`, category: 'Electronics', price: '', stock: '', status: 'Active' });
    setIsProductModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      channels: formData.channels || ['Direct']
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formattedData } : p));
    } else {
      setProducts([{ id: `PROD-${Math.floor(Math.random() * 90000) + 10000}`, ...formattedData }, ...products]);
    }
    setIsProductModalOpen(false);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    setProducts(products.filter(p => p.id !== productToDelete.id));
    setSelectedItems(selectedItems.filter(id => id !== productToDelete.id));
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-[#e7f7ef] text-[#0faf62]',
      'Low Stock': 'bg-[#fff7ed] text-[#f97316]',
      'Out of Stock': 'bg-[#fef2f2] text-[#ef4444]'
    };
    return <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles['Active']}`}>{status}</span>;
  };

  return (
    <div className="bg-[#f8f9fa] p-4  min-h-screen font-sans text-[#1a1d1f]">
      <div className="max-w-340 mx-auto">
        
        {/* Top Management Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="sm:text-4xl text-2xl font-black italic font-serif tracking-tight">Product Catalog</h1>
            <p className="text-sm text-[#6f767e] font-medium mt-1">Managing <span className="text-[#1a1d1f] font-bold">{products.length}</span> total items</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#eff0f1] rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:border-[#d1d5db] transition-all">
              <Download size={16} /> Export
            </button>
            <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1d1f] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#33383d] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        {/* Global Inventory Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Box className="text-blue-500" />} label="Total Inventory" value={products.reduce((acc, p) => acc + p.stock, 0).toLocaleString()} trend="Units" />
          <StatCard icon={<AlertCircle className="text-orange-500" />} label="Low Stock" value={products.filter(p => p.status === 'Low Stock').length} trend="Items" />
          <StatCard icon={<XCircle className="text-red-500" />} label="Out of Stock" value={products.filter(p => p.status === 'Out of Stock').length} trend="Items" />
          <StatCard icon={<CheckCircle2 className="text-green-500" />} label="Active" value={products.filter(p => p.status === 'Active').length} trend="Items" />
        </div>

        {/* Advanced Filter UI */}
        <div className="bg-white rounded-[24px] border border-[#eff0f1] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#eff0f1] flex flex-col lg:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9fa5]" size={18} />
              <input 
                type="text" 
                placeholder="Search by SKU, Name, or ID..." 
                className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-transparent rounded-2xl text-sm focus:bg-white focus:border-[#d1d5db] focus:ring-4 focus:ring-gray-100 transition-all outline-none"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFilterOpen(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${hasActiveFilters ? 'bg-[#1a1d1f] text-white border-[#1a1d1f]' : 'bg-[#f8f9fa] text-[#6f767e] border-transparent hover:bg-gray-100'}`}
              >
                <Filter size={16} /> Filters
                {hasActiveFilters && <span className="ml-1 w-2 h-2 bg-orange-500 rounded-full" />}
              </button>
              {hasActiveFilters && (
                <button onClick={() => { setActiveFilters({ category: 'All', status: 'All', minPrice: '', maxPrice: '' }); setSearch(''); }} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors">
                  <RotateCcw size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfcfc] border-b border-[#eff0f1]">
                  <th className="p-5 w-10"><input type="checkbox" className="rounded border-gray-300 text-[#1a1d1f] focus:ring-[#1a1d1f]" checked={selectedItems.length === paginatedData.length && paginatedData.length > 0} onChange={toggleSelectAll} /></th>
                  <th className="p-5 text-[11px] font-bold text-[#9a9fa5] uppercase tracking-wider">Product Info</th>
                  <th className="p-5 text-[11px] font-bold text-[#9a9fa5] uppercase tracking-wider">Inventory</th>
                  <th className="p-5 text-[11px] font-bold text-[#9a9fa5] uppercase tracking-wider">Status</th>
                  <th className="p-5 text-[11px] font-bold text-[#9a9fa5] uppercase tracking-wider text-right">Price</th>
                  <th className="p-5 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eff0f1]">
                {paginatedData.length > 0 ? paginatedData.map((product) => (
                  <tr key={product.id} className="hover:bg-[#f8f9fa] transition-colors group">
                    <td className="p-5"><input type="checkbox" className="rounded border-gray-300 text-[#1a1d1f] focus:ring-[#1a1d1f]" checked={selectedItems.includes(product.id)} onChange={() => toggleSelect(product.id)} /></td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-[#eff0f1]">
                          <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}&backgroundColor=f8f9fa`} alt="Product" className="w-8 h-8 rounded-md opacity-80" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1a1d1f] mb-0.5">{product.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#9a9fa5] font-bold uppercase">{product.category}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-[10px] text-[#9a9fa5] font-bold uppercase">{product.sku}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-bold text-[#1a1d1f]">{product.stock} units</p>
                      <div className="w-24 h-1.5 bg-[#f4f4f4] rounded-full mt-2 overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${product.stock < 20 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(product.stock, 100)}%` }} />
                      </div>
                    </td>
                    <td className="p-5">{getStatusBadge(product.status)}</td>
                    <td className="p-5 text-right font-bold text-sm text-[#1a1d1f]">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="p-5">
                      <div className="flex justify-end gap-2 ">
                        <button onClick={() => openEditModal(product)} className="p-2 bg-white border border-[#eff0f1] hover:border-gray-300 rounded-lg text-[#6f767e] hover:text-[#1a1d1f] shadow-sm transition-all"><Edit3 size={16}/></button>
                        <button onClick={() => confirmDelete(product)} className="p-2 bg-white border border-[#eff0f1] hover:border-red-200 hover:bg-red-50 rounded-lg text-red-500 shadow-sm transition-all"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="p-20 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                        <Search size={24} className="text-gray-400" />
                      </div>
                      <p className="text-base font-bold text-[#1a1d1f]">No products found</p>
                      <p className="text-sm text-[#9a9fa5] mt-1 mb-4">We couldn't find anything matching your search or filters.</p>
                      <button onClick={() => { setSearch(''); setActiveFilters({ category: 'All', status: 'All', minPrice: '', maxPrice: '' }); }} className="text-sm font-bold text-blue-600 hover:underline">Clear all filters</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-[#eff0f1] flex items-center justify-between text-sm font-medium text-[#6f767e]">
            <p>Showing <span className="font-bold text-[#1a1d1f]">{(currentPage - 1) * itemsPerPage + (paginatedData.length > 0 ? 1 : 0)}</span> to <span className="font-bold text-[#1a1d1f]">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-bold text-[#1a1d1f]">{filteredProducts.length}</span></p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border border-[#eff0f1] hover:bg-gray-50 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent transition-all"><ChevronLeft size={18}/></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border border-[#eff0f1] hover:bg-gray-50 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent transition-all"><ChevronRight size={18}/></button>
            </div>
          </div>
        </div>

        {/* --- MODALS & DRAWERS --- */}

        {/* Add/Edit Product Modal */}
        <AnimatePresence>
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-[#eff0f1] flex justify-between items-center bg-[#fcfcfc]">
                  <h2 className="text-xl font-bold text-[#1a1d1f]">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <button onClick={() => setIsProductModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"><X size={18} /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                  <form id="productForm" onSubmit={handleSaveProduct} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-[#6f767e] uppercase tracking-wider mb-2">Product Name <span className="text-red-500">*</span></label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-[#f8f9fa] border border-[#eff0f1] rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none" placeholder="e.g. Sony Wireless Headphones" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#6f767e] uppercase tracking-wider mb-2">SKU</label>
                        <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full p-3 bg-[#f8f9fa] border border-[#eff0f1] rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none" placeholder="SKU-XXXX" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#6f767e] uppercase tracking-wider mb-2">Category</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-[#f8f9fa] border border-[#eff0f1] rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none">
                          <option>Electronics</option><option>Audio</option><option>Footwear</option><option>Apparel</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#6f767e] uppercase tracking-wider mb-2">Price ($) <span className="text-red-500">*</span></label>
                        <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-[#f8f9fa] border border-[#eff0f1] rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none" placeholder="0.00" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#6f767e] uppercase tracking-wider mb-2">Stock Level <span className="text-red-500">*</span></label>
                        <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-3 bg-[#f8f9fa] border border-[#eff0f1] rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none" placeholder="0" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#6f767e] uppercase tracking-wider mb-2">Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-3 bg-[#f8f9fa] border border-[#eff0f1] rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none appearance-none">
                        <option>Active</option><option>Low Stock</option><option>Out of Stock</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div className="p-6 border-t border-[#eff0f1] bg-[#fcfcfc] flex justify-end gap-3">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#6f767e] hover:bg-gray-100 transition-colors">Cancel</button>
                  <button type="submit" form="productForm" className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1d1f] text-white rounded-xl text-sm font-bold shadow-md hover:bg-black hover:shadow-lg transition-all">
                    <Save size={16} /> {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#1a1d1f] mb-2">Delete Product?</h3>
                <p className="text-sm text-[#6f767e] mb-6">Are you sure you want to delete <span className="font-bold text-[#1a1d1f]">{productToDelete?.name}</span>? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-bold bg-gray-100 text-[#6f767e] hover:bg-gray-200 transition-colors">Cancel</button>
                  <button onClick={executeDelete} className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transition-all">Yes, Delete</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Filter Drawer Sidebar (Same as previous iteration but positioned higher z-index) */}
        <AnimatePresence>
          {isFilterOpen && (
             <div className="fixed inset-0 z-40 flex justify-end">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterOpen(false)} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative h-screen w-full max-w-sm bg-white shadow-2xl p-8 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={18}/></button>
                </div>
                <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#9a9fa5] uppercase tracking-widest block mb-3">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {['All', 'Footwear', 'Electronics', 'Audio', 'Apparel'].map(cat => (
                        <button key={cat} onClick={() => setActiveFilters({...activeFilters, category: cat})} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activeFilters.category === cat ? 'bg-[#1a1d1f] text-white border-[#1a1d1f]' : 'bg-white text-[#6f767e] border-[#eff0f1] hover:border-gray-300'}`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#9a9fa5] uppercase tracking-widest block mb-3">Status</label>
                    <div className="space-y-2">
                      {['All', 'Active', 'Low Stock', 'Out of Stock'].map(stat => (
                        <button key={stat} onClick={() => setActiveFilters({...activeFilters, status: stat})} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold border transition-all ${activeFilters.status === stat ? 'bg-[#1a1d1f] text-white border-[#1a1d1f]' : 'bg-white text-[#6f767e] border-[#eff0f1] hover:border-gray-300'}`}>{stat}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#9a9fa5] uppercase tracking-widest block mb-3">Price Range ($)</label>
                    <div className="flex items-center gap-3">
                      <input type="number" placeholder="Min" value={activeFilters.minPrice} onChange={(e) => setActiveFilters({...activeFilters, minPrice: e.target.value})} className="w-full p-3 bg-[#f8f9fa] border border-[#eff0f1] rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
                      <span className="text-[#9a9fa5]">-</span>
                      <input type="number" placeholder="Max" value={activeFilters.maxPrice} onChange={(e) => setActiveFilters({...activeFilters, maxPrice: e.target.value})} className="w-full p-3 bg-[#f8f9fa] border border-[#eff0f1] rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all" />
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-[#eff0f1] space-y-3 mt-auto">
                  <button onClick={() => setIsFilterOpen(false)} className="w-full py-4 bg-[#1a1d1f] text-white rounded-2xl text-sm font-bold shadow-md hover:bg-black transition-all">Show {filteredProducts.length} Results</button>
                  <button onClick={() => setActiveFilters({ category: 'All', status: 'All', minPrice: '', maxPrice: '' })} className="w-full py-2 text-xs font-bold text-[#6f767e] hover:text-[#1a1d1f] transition-colors">Clear All Filters</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }) => (
  <div className="bg-white p-5 rounded-[24px] border border-[#eff0f1] shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2.5 bg-[#f8f9fa] rounded-xl">{icon}</div>
      <span className="text-xs font-bold text-[#6f767e] uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-black text-[#1a1d1f] tracking-tight">{value}</h3>
      <span className="text-[10px] font-bold text-[#9a9fa5] bg-gray-50 px-2 py-1 rounded-md">{trend}</span>
    </div>
  </div>
);

export default ProductManagement;