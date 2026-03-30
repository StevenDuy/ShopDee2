"use client";

import React, { useState, useCallback } from 'react';
import { X, Save, ArrowLeft, Image as ImageIcon, Package, Info, LayoutList, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { MediaManager } from './MediaManager';
import { OptionManagerV2 } from './OptionManagerV2';
import { SpecificationBuilder } from './SpecificationBuilder';
import { CategorySearchPicker } from './CategorySearchPicker';
import { SmartNumberInput } from './SmartNumberInput';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shopdee.io.vn/api";

const mapInitialOptions = (options: any[]) => {
  if (!options || options.length === 0) return [];
  const mainOpt = options[0];
  if (!mainOpt || !mainOpt.values) return [];
  const vals = mainOpt.values;
  const parents = vals.filter((v: any) => !v.parent_id);
  return parents.map((p: any) => ({
    id: `o-${p.id}`,
    name: p.value,
    price: p.price_adjustment,
    stock: p.stock_quantity,
    isExpanded: false,
    subOptions: vals.filter((v: any) => v.parent_id === p.id).map((s: any) => ({
      id: `s-${s.id}`,
      value: s.value,
      price: s.price_adjustment,
      stock: s.stock_quantity
    }))
  }));
};

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialData 
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category_id: initialData?.category_id || "",
    base_price: initialData?.base_price || 0,
    stock_quantity: initialData?.stock_quantity || 0,
  });

  const [media, setMedia] = useState<any[]>(
    initialData?.media?.map((m: any) => ({
      url: m.url, type: m.type, is_hero: m.is_primary, id: m.id || Math.random().toString(36).substr(2, 9)
    })) || []
  );

  const [specifications, setSpecifications] = useState<any[]>(
    initialData?.attributes?.map((a: any) => ({
      id: a.id || Math.random().toString(36).substr(2, 9), name: a.name, value: a.value
    })) || []
  );

  const [options, setOptions] = useState<any[]>(mapInitialOptions(initialData?.options || []));
  const [stats, setStats] = useState({ minPrice: 0, totalStock: 0 });

  const handleStatsUpdate = useCallback((newStats: { minPrice: number; totalStock: number }) => {
    setStats(newStats);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadedMedia = await Promise.all(media.map(async (item) => {
        if (item.file) {
          const data = new FormData();
          data.append('file', item.file);
          const res = await axios.post(`${API_URL}/seller/media/upload`, data);
          return {
            url: res.data.url,
            type: res.data.type,
            is_primary: item.is_hero,
            cloudinary_id: res.data.cloudinary_id
          };
        }
        return {
          url: item.url,
          type: item.type,
          is_primary: item.is_hero
        };
      }));
      const finalPrice = options.length > 0 ? stats.minPrice : formData.base_price;
      const finalStock = options.length > 0 ? stats.totalStock : formData.stock_quantity;

      const payload = {
        ...formData,
        base_price: finalPrice, stock_quantity: finalStock, media: uploadedMedia,
        specifications: specifications.map(s => ({ name: s.name, value: s.value })),
        options: options.map(opt => ({
          name: opt.name, price: opt.price || 0, stock: opt.stock || 0,
          sub_options: opt.subOptions?.map((sub: any) => ({ value: sub.value, price: sub.price || 0, stock: sub.stock || 0 })) || []
        }))
      };

      if (initialData?.id) await axios.put(`${API_URL}/seller/products/${initialData.id}`, payload);
      else await axios.post(`${API_URL}/seller/products`, payload);
      
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); setSuccess(false); }, 2000);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
        className="absolute top-0 right-0 h-full w-full max-w-4xl bg-white rounded-l-[3.5rem] shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-10">
            {/* Admin-style Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-black tracking-tighter uppercase">{initialData ? "Refine Product" : "Launch Product"}</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Strategic Fleet Deployment V2.0</p>
              </div>
              <button type="button" onClick={onClose} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-6 h-6 text-black" />
              </button>
            </div>

            {/* Core Info */}
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Display Title</label>
                        <input 
                            required type="text" value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Premium Hardware Name"
                            className="w-full bg-gray-100 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black font-bold text-sm placeholder:text-gray-400"
                        />
                    </div>
                    <div className="space-y-2">
                        <CategorySearchPicker selectedId={formData.category_id} onSelect={(cat) => setFormData({...formData, category_id: cat.id})} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Media Inventory</label>
                    <MediaManager media={media} onChange={setMedia} />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                    <div className="flex border-b border-gray-50 bg-gray-50/30">
                        <button type="button" onClick={() => setActiveTab('description')} className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest ${activeTab === 'description' ? 'bg-white text-black border-r border-gray-100' : 'text-gray-300'}`}>Product Intel</button>
                        <button type="button" onClick={() => setActiveTab('specifications')} className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest ${activeTab === 'specifications' ? 'bg-white text-black border-l border-gray-100' : 'text-gray-300'}`}>Tech Specs</button>
                    </div>
                    <div className="p-8">
                        {activeTab === 'description' ? (
                            <textarea rows={10} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Deep specifications..." className="w-full bg-gray-100 border-none rounded-3xl p-8 text-sm font-medium leading-relaxed focus:ring-2 focus:ring-black placeholder:text-gray-300 resize-none" />
                        ) : (
                            <SpecificationBuilder specifications={specifications} onChange={setSpecifications} />
                        )}
                    </div>
                </div>

                <OptionManagerV2 options={options} onChange={setOptions} onStatsUpdate={handleStatsUpdate} />
            </div>

            {/* Admin-styled Bottom Actions */}
            <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] pl-1">Min. Val.</label>
                        <div className="flex items-center gap-2 bg-gray-100 px-5 py-3 rounded-xl">
                            <span className="text-gray-400 font-bold">$</span>
                            <SmartNumberInput 
                                disabled={options.length > 0}
                                value={options.length > 0 ? stats.minPrice : formData.base_price}
                                onChange={(val) => setFormData({...formData, base_price: val})}
                                className="w-24" inputClassName="bg-transparent border-none p-0 text-sm font-black focus:ring-0"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] pl-1">Inventory</label>
                        <div className="flex items-center gap-2 bg-gray-100 px-5 py-3 rounded-xl">
                            <span className="text-gray-400 font-bold">#</span>
                            <SmartNumberInput 
                                disabled={options.length > 0}
                                value={options.length > 0 ? stats.totalStock : formData.stock_quantity}
                                onChange={(val) => setFormData({...formData, stock_quantity: val})}
                                className="w-24" inputClassName="bg-transparent border-none p-0 text-sm font-black focus:ring-0"
                            />
                        </div>
                    </div>
               </div>

               <button form="product-form" type="submit" disabled={loading || success} className="w-full md:w-64 bg-black text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 disabled:bg-gray-100 transition-all flex items-center justify-center gap-3">
                  {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : success ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  <span>{initialData ? "Push Changes" : "Deploy Component"}</span>
               </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
