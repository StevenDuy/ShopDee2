"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, ChevronDown, Layers, Check, RefreshCcw, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shopdee.io.vn/api";

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  parent_name: string | null;
  display_name: string;
}

interface CategorySearchPickerProps {
  selectedId: number | string;
  onSelect: (category: Category) => void;
}

export const CategorySearchPicker: React.FC<CategorySearchPickerProps> = ({ selectedId, onSelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/categories/flat`);
      setCategories(res.data);
    } catch (error) {
      console.error("Fetch categories error:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.id == selectedId);
  const filteredCategories = categories.filter(c => 
    c.display_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Category Taxonomy</label>
      
      <div className="relative">
        <div className={cn(
            "w-full bg-gray-100 border border-transparent rounded-2xl px-12 py-5 transition-all flex items-center shadow-sm",
            isOpen ? "ring-2 ring-black bg-white" : "hover:bg-gray-200"
        )}>
          <Search className="absolute left-4 w-4 h-4 text-gray-400" />
          
          <input 
            type="text"
            value={isOpen ? search : (selectedCategory?.display_name || "")}
            onChange={(e) => {
                setSearch(e.target.value);
                setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search Categories (e.g. Node > Sub-Node)..."
            className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0 placeholder:text-gray-400"
          />

          <div className="absolute right-4 flex items-center gap-2">
            {search && isOpen && (
                <button onClick={() => setSearch("")}>
                    <X className="w-3 h-3 text-gray-400 hover:text-black" />
                </button>
            )}
            <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute z-[130] top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[350px]"
            >
              <div className="overflow-y-auto custom-scrollbar p-2 space-y-1">
                {loading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2">
                    <RefreshCcw className="w-5 h-5 animate-spin text-gray-200" />
                    <span className="text-[8px] font-black uppercase text-gray-300">Syncing Taxonomy...</span>
                  </div>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelect(cat);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "w-full group px-5 py-4 rounded-xl text-left transition-all relative overflow-hidden flex items-center gap-3",
                        selectedId == cat.id ? "bg-black text-white" : "hover:bg-gray-50",
                        cat.parent_id && "pl-14 border-l-4 border-black/5 ml-2"
                      )}
                    >
                        {cat.parent_id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-gray-400" />
                        )}
                        {cat.parent_name ? (
                            <div className="flex flex-col">
                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-1",
                                    selectedId == cat.id ? "text-gray-500" : "text-gray-400"
                                )}>
                                    {cat.parent_name} <ArrowRight className="w-2 h-2" />
                                </span>
                                <span className="text-sm font-bold leading-tight">{cat.name}</span>
                            </div>
                        ) : (
                            <span className="text-sm font-black uppercase tracking-widest text-black/80">{cat.name}</span>
                        )}
                      
                      {selectedId == cat.id && <Check className="absolute right-6 top-1/2 -translate-y-1/2 w-3 h-3 text-white" />}
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-300 text-[10px] font-black uppercase tracking-widest">
                     No Matching Node 
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
