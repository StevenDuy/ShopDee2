"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, 
  Trash2, 
  Layers, 
  Package, 
  Tag,
  Circle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductTableProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ 
  products, 
  onEdit, 
  onDelete,
  onToggleStatus
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {products.map((p, i) => {
          const heroImage = p.media?.find((m: any) => m.is_primary)?.url || 
                            p.media?.[0]?.url;
          
          const isActive = p.status === 'active';

          return (
            <motion.div
              layout
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
            >
              {/* Product Visual */}
              <div className="aspect-[4/3] relative bg-gray-50 overflow-hidden">
                {heroImage ? (
                    <img 
                      src={heroImage} 
                      alt={p.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
                       <Package className="w-16 h-16" />
                       <span className="text-[8px] font-black uppercase tracking-widest mt-2">No Visual Data</span>
                    </div>
                )}

                {/* Fixed Corner Actions - High Contrast (Like MediaManager) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                    className="p-3 bg-white text-black rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all border border-gray-100"
                    title="Edit Product"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleStatus(p.id); }}
                    className={cn(
                        "p-3 rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all border border-gray-100",
                        isActive ? "bg-emerald-500 text-white" : "bg-white text-gray-400"
                    )}
                    title={isActive ? "Deactivate" : "Activate"}
                  >
                    <Zap className={cn("w-4 h-4", isActive && "fill-current")} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                    className="p-3 bg-white text-red-500 rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all border border-gray-100"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-4 left-4">
                  <span className={cn(
                    "px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md border",
                    isActive 
                      ? "bg-emerald-500/80 text-white border-white/20 shadow-lg shadow-emerald-500/20" 
                      : "bg-gray-800/80 text-gray-300 border-white/10"
                  )}>
                    <Circle className={cn("w-1.5 h-1.5 fill-current", isActive && "animate-pulse")} />
                    {p.status || 'Draft'}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-8 space-y-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> {p.category?.name || "Uncategorized"}
                  </span>
                  <h3 className="text-lg font-black text-gray-900 truncate leading-tight">
                    {p.title || "Unknown Deployment"}
                  </h3>
                </div>

                <div className="flex justify-between items-end gap-4 pt-4 border-t border-gray-50">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Inventory</p>
                    <p className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-gray-300" />
                      {p.stock_quantity || 0} <span className="text-[10px] text-gray-400 font-bold tracking-tighter">Units</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Valuation</p>
                    <div className="flex items-baseline gap-0.5 justify-end">
                      <span className="text-xs font-black text-gray-400">$</span>
                      <span className="text-xl font-black text-gray-900">
                        {Number(p.base_price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Variant Snippet */}
                {p.options && p.options.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-gray-50 text-gray-400 text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 border border-gray-100/50">
                      <Layers className="w-2.5 h-2.5" />
                      {p.options.length} {p.options.length === 1 ? 'Cluster' : 'Clusters'}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {products.length === 0 && (
        <div className="col-span-full py-32 flex flex-col items-center justify-center gap-6 opacity-30 text-gray-400">
          <div className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.4em]">No Network Data Detected</p>
        </div>
      )}
    </div>
  );
};
