"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Package, 
  Search, 
  Filter, 
  RefreshCcw,
  Zap,
  Loader2
} from 'lucide-react';
import { ProductTable } from './components/ProductTable';
import { ProductFormModal } from './components/ProductFormModal';
import { PaginationControl } from '@/components/PaginationControl';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shopdee.io.vn/api";

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const fetchProducts = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/seller/products?page=${page}`);
      // Laravel Pagination returns { data: [...], current_page: X, last_page: Y }
      setProducts(res.data.data);
      setPagination({
        current: res.data.current_page,
        last: res.data.last_page
      });
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to decommission this product node?")) return;
    try {
      await axios.delete(`${API_URL}/seller/products/${id}`);
      fetchProducts(pagination.current);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
        await axios.patch(`${API_URL}/seller/products/${id}/toggle`);
        fetchProducts(pagination.current);
    } catch (error) {
        console.error("Toggle error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-8 md:p-12 space-y-12 animate-in fade-in duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <span className="bg-black text-white p-3 rounded-2xl shadow-2xl">
                <Package className="w-6 h-6" />
             </span>
             <h1 className="text-5xl font-black tracking-tighter text-black uppercase">Inventory Fleet</h1>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Strategic Node Deployment Control</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           <button 
              onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
              className="flex-1 md:flex-none bg-black text-white px-8 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] uppercase tracking-widest text-sm"
           >
             <Plus className="w-5 h-5" />
             Deploy Component
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm">
         <div className="relative w-full md:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
            <input 
               type="text" 
               placeholder="Search product clusters..."
               className="w-full bg-gray-100 border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-black transition-all placeholder:text-gray-400"
            />
         </div>
         
         <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <button className="flex-1 md:flex-none p-5 md:p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center">
               <Filter className="w-5 h-5 text-gray-400" />
            </button>
            <button 
               onClick={() => fetchProducts(pagination.current)}
               className="flex-1 md:flex-none p-5 md:p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
               <RefreshCcw className={cn("w-5 h-5 text-gray-400", loading && "animate-spin")} />
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
           <Loader2 className="w-12 h-12 animate-spin text-gray-200" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Synchronizing Local Fleet...</p>
        </div>
      ) : (
        <div className="space-y-12">
            <ProductTable 
                products={products} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                onToggleStatus={handleToggleStatus}
            />

            <PaginationControl 
                currentPage={pagination.current}
                lastPage={pagination.last}
                onPageChange={(page) => fetchProducts(page)}
            />
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal 
        key={editingProduct?.id || 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchProducts(pagination.current)}
        initialData={editingProduct}
      />
    </div>
  );
}
