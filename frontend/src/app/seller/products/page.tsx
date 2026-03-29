"use client";

import React, { useState } from 'react';
import { MobileLayout } from '@/components/ui/MobileLayout';
import { Button } from '@/components/ui/Button';
import { ProductTable } from './components/ProductTable';
import { ProductFormModal } from './components/ProductFormModal';
import { Plus, Package, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function SellerProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Initial mock data to show standard
  const products = [
    { id: 1, name: "Elite Watch S1", base_price: 1500000, stock: 45 },
    { id: 2, name: "Minimalist Sleeve", base_price: 350000, stock: 120 },
  ];

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const Header = (
    <>
      <div className="flex flex-col">
        <h2 className="text-xl font-black text-black tracking-tight">Products</h2>
        <span className="text-[10px] font-black uppercase text-gray-300">Inventory Management</span>
      </div>
      <Button variant="primary" size="sm" onClick={handleAdd}>
        <Plus className="w-4 h-4" /> New
      </Button>
    </>
  );

  return (
    <MobileLayout header={Header}>
      <div className="p-6 space-y-8">
        {/* Search & Stats */}
        <div className="space-y-4">
          <Input 
            placeholder="Search elite inventory..." 
            className="shadow-sm"
          />
          <div className="flex gap-4">
             <div className="flex-1 p-4 bg-white rounded-3xl border border-gray-100 flex flex-col items-center">
                <span className="text-xl font-black text-black">128</span>
                <span className="text-[8px] font-black uppercase text-gray-300">Total Items</span>
             </div>
             <div className="flex-1 p-4 bg-white rounded-3xl border border-gray-100 flex flex-col items-center">
                <span className="text-xl font-black text-orange-500">12</span>
                <span className="text-[8px] font-black uppercase text-gray-300">Out of Stock</span>
             </div>
          </div>
        </div>

        {/* Product List */}
        <ProductTable products={products} onEdit={handleEdit} />

        <ProductFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          product={editingProduct}
        />
      </div>
    </MobileLayout>
  );
}
