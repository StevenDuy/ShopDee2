"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useProductDetail } from '@/hooks/customer/useProductDetail';
import { Package, Plus, Trash2 } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ 
  isOpen, 
  onClose, 
  product 
}) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    base_price: product?.base_price || 0,
    stock: product?.stock_quantity || 0,
  });

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={product ? "Edit Product" : "New Elite Product"}
    >
      <div className="space-y-8 p-2">
        <div className="space-y-4">
          <Input 
            label="Product Title" 
            placeholder="Name your elite product"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Base Price (VND)" 
            type="number"
            value={formData.base_price}
            onChange={(e) => setFormData({...formData, base_price: parseFloat(e.target.value)})}
          />
        </div>

        {/* Variants Section - Simplified for now */}
        <div className="glass-form p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-black">Multi-Level Variants</h4>
            <Button variant="secondary" size="sm">
              <Plus className="w-3 h-3" /> Add Tier
            </Button>
          </div>
          <p className="text-xs text-gray-400">Add up to 3 levels of variants (e.g. Color > Material > Size).</p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Discard</Button>
          <Button variant="primary" className="flex-1">
            {product ? "Update Product" : "Launch Product"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
