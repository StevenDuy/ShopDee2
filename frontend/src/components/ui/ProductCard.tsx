"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const heroImage = product.media?.find((m: any) => m.is_primary)?.url || 
                    product.media?.[0]?.url;

  return (
    <Link href={`/customer/products/${product.id}`} className="block group">
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-[0_45px_90px_-25px_rgba(0,0,0,0.12)] transition-all duration-500 shadow-sm"
      >
        <div className="aspect-[4/5] relative bg-gray-50 overflow-hidden">
          {heroImage ? (
            <img 
              src={heroImage} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-10">
               <Package className="w-16 h-16 text-black" />
            </div>
          )}
        </div>

        <div className="p-8">
          <h3 className="font-black text-xl text-black line-clamp-1 mb-2 group-hover:text-gray-600 transition-colors tracking-tight">
            {product.title}
          </h3>
          
          <div className="mt-4 flex flex-col">
            <span className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] mb-1">Asset Value</span>
            <span className="text-2xl font-black text-black tracking-tighter">
              {Number(product.base_price).toLocaleString()}đ
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
