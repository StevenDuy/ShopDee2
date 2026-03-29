"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProductTableProps {
  products: any[];
  onEdit: (product: any) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit }) => {
  return (
    <div className="space-y-4">
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="p-6 bg-white rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#f5f5f7] rounded-3xl overflow-hidden flex items-center justify-center">
               <span className="text-gray-300 font-black">P</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-black">{p.name || "Untitled Product"}</h4>
              <p className="text-[10px] font-black uppercase text-gray-400">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.base_price || 0)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onEdit(p)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </motion.div>
      ))}

      {products.length === 0 && (
        <div className="p-12 text-center text-gray-300">
          <p className="text-[10px] font-black uppercase tracking-widest">No products in inventory</p>
        </div>
      )}
    </div>
  );
};
