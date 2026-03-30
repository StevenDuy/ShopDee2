"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from '@/components/ui/ProductCard';
import { motion } from 'framer-motion';
import { RefreshCcw, PackageSearch } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

interface ProductGridProps {
  title: string;
  type?: 'new' | 'top';
  limit?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ title, type, limit = 8 }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products?type=${type || ''}&limit=${limit}`);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Product grid fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [type, limit]);

  if (loading) return (
    <div className="py-24 flex flex-col items-center justify-center gap-6 opacity-30">
        <RefreshCcw className="w-8 h-8 animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Scanning Node Cluster...</span>
    </div>
  );

  if (!products.length) return (
    <div className="py-24 border border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center gap-4 opacity-50">
        <PackageSearch className="w-12 h-12 text-gray-200" />
        <p className="text-[12px] font-black uppercase tracking-widest text-gray-400">Inventory Sync Failed | Cluster Empty</p>
    </div>
  );

  return (
    <section className="py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="max-w-xl">
          <h2 className="text-5xl font-black text-black tracking-tighter uppercase mb-4 leading-[0.9]">
            {title}
          </h2>
          <p className="text-gray-400 text-sm font-bold tracking-tight">
            High-fidelity synchronized asset deployment from our logistics cluster. Optimized for real-time commerce research.
          </p>
        </div>
        
        <button className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors flex items-center gap-4 group">
            Browse All Nodes
            <div className="w-12 h-[1px] bg-gray-200 group-hover:w-20 group-hover:bg-black transition-all" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
