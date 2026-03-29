"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  category?: string;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  title, 
  price, 
  imageUrl, 
  category, 
  index = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ y: -4 }}
      className="group w-full bg-white overflow-hidden"
    >
      <div className="relative aspect-square w-full bg-[#f5f5f7] rounded-[32px] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
        )}
      </div>

      <div className="mt-4 px-2">
        {category && (
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 block">
            {category}
          </span>
        )}
        <h3 className="text-sm font-semibold truncate text-black">{title}</h3>
        <p className="text-base font-bold text-black mt-2">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
        </p>
      </div>
    </motion.div>
  );
};
