"use client";

import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, ChevronDown, Package, Tag, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartNumberInput } from './SmartNumberInput';

interface SubOption {
  id: string;
  value: string;
  price: number;
  stock: number;
}

interface Option {
  id: string;
  name: string;
  subOptions: SubOption[];
  isExpanded?: boolean;
  price?: number;
  stock?: number;
}

interface OptionManagerProps {
  options: Option[];
  onChange: (options: Option[]) => void;
  onStatsUpdate: (stats: { minPrice: number, totalStock: number }) => void;
}

export const OptionManagerV2: React.FC<OptionManagerProps> = ({ options, onChange, onStatsUpdate }) => {
  // Sync stats with parent logic
  React.useEffect(() => {
    let minPrice = Infinity;
    let totalStock = 0;
    if (options.length === 0) {
      onStatsUpdate({ minPrice: 0, totalStock: 0 });
      return;
    }
    options.forEach(opt => {
      if (opt.subOptions.length > 0) {
        opt.subOptions.forEach(sub => {
          if (sub.price > 0 && sub.price < minPrice) minPrice = sub.price;
          totalStock += sub.stock || 0;
        });
      } else {
        if (opt.price && opt.price > 0 && opt.price < minPrice) minPrice = opt.price;
        totalStock += opt.stock || 0;
      }
    });
    onStatsUpdate({ minPrice: minPrice === Infinity ? 0 : minPrice, totalStock });
  }, [options, onStatsUpdate]);

  const addOptionSet = () => {
    const t = Date.now();
    onChange([...options, 
      { id: `o1-${t}`, name: "", subOptions: [], isExpanded: true },
      { id: `o2-${t}`, name: "", subOptions: [], isExpanded: true }
    ]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) {
        if (confirm("Variant sets must exist in pairs. Deleting this will clear all. Proceed?")) onChange([]);
        return;
    }
    onChange(options.filter(opt => opt.id !== id));
  };

  const updateSubOption = (optionId: string, subId: string, field: keyof SubOption, value: any) => {
    onChange(options.map(opt => opt.id === optionId ? {
      ...opt,
      subOptions: opt.subOptions.map(s => s.id === subId ? { ...s, [field]: value } : s)
    } : opt));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4">
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Variants</h4>
          <p className="text-[8px] text-gray-300 font-bold uppercase mt-1">Classification Cluster</p>
        </div>
        <button type="button" onClick={addOptionSet} className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
          <Plus className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Add Set</span>
        </button>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <div key={option.id} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 bg-gray-50/50">
              <button 
                type="button" 
                onClick={() => onChange(options.map(o => o.id === option.id ? {...o, isExpanded: !o.isExpanded} : o))}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm"
              >
                {option.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              <div className="relative flex-1">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  type="text" placeholder="e.g. Color" value={option.name}
                  onChange={(e) => onChange(options.map(o => o.id === option.id ? {...o, name: e.target.value} : o))}
                  className="w-full bg-gray-100 border-none rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-black"
                />
              </div>

              {option.subOptions.length === 0 && (
                <div className="flex items-center gap-2">
                  <SmartNumberInput 
                    className="w-24 md:w-32" value={option.price || 0}
                    onChange={(v) => onChange(options.map(o => o.id === option.id ? {...o, price: v} : o))}
                    placeholder="Price" prefix={<span className="font-black">$</span>}
                    inputClassName="bg-white border border-gray-100 rounded-xl"
                  />
                  <SmartNumberInput 
                    className="w-24 md:w-32" value={option.stock || 0}
                    onChange={(v) => onChange(options.map(o => o.id === option.id ? {...o, stock: v} : o))}
                    placeholder="Stock" icon={<Package className="w-3 h-3 text-gray-400" />}
                    inputClassName="bg-white border border-gray-100 rounded-xl"
                  />
                </div>
              )}

              <button type="button" onClick={() => removeOption(option.id)} className="p-4 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence>
              {option.isExpanded && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-50">
                  <div className="p-4 md:p-8 space-y-4">
                    {option.subOptions.map((sub) => (
                      <div key={sub.id} className="flex flex-col md:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full md:w-auto">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                          <input 
                            type="text" placeholder="Value" value={sub.value}
                            onChange={(e) => updateSubOption(option.id, sub.id, 'value', e.target.value)}
                            className="w-full bg-gray-100 border-none rounded-xl pl-10 pr-4 py-3 text-sm font-medium"
                          />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <SmartNumberInput 
                            className="flex-1 md:w-32" value={sub.price}
                            onChange={(v) => updateSubOption(option.id, sub.id, 'price', v)}
                            placeholder="Price" prefix={<span className="font-black">$</span>}
                            inputClassName="bg-gray-100 border-none rounded-xl"
                          />
                          <SmartNumberInput 
                            className="flex-1 md:w-32" value={sub.stock}
                            onChange={(v) => updateSubOption(option.id, sub.id, 'stock', v)}
                            placeholder="Stock" icon={<Package className="w-3 h-3 text-gray-400" />}
                            inputClassName="bg-gray-100 border-none rounded-xl"
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => {
                            const parent = options.find(o => o.id === option.id);
                            if (parent && parent.subOptions.length <= 2) {
                                if (confirm("Must exist in pairs. Clear all?")) {
                                    onChange(options.map(o => o.id === option.id ? {...o, subOptions: []} : o));
                                }
                            } else {
                                onChange(options.map(o => o.id === option.id ? {...o, subOptions: o.subOptions.filter(s => s.id !== sub.id)} : o));
                            }
                          }}
                          className="p-3 text-gray-300 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-center md:justify-start">
                      <button 
                        type="button" 
                        onClick={() => {
                          const t = Date.now();
                          onChange(options.map(o => o.id === option.id ? {
                            ...o, subOptions: [...o.subOptions, {id: `s1-${t}`, value: "", price: 0, stock: 0}, {id: `s2-${t}`, value: "", price: 0, stock: 0}]
                          } : o));
                        }}
                        className="w-full md:w-auto px-6 py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-black/20 hover:text-black transition-all"
                      >
                        + Add Sub-Value Set
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
