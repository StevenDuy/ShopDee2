"use client";

import React from 'react';
import { Plus, Trash2, LayoutList, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface Specification {
  id: string;
  name: string;
  value: string;
}

interface SpecificationBuilderProps {
  specifications: Specification[];
  onChange: (specs: Specification[]) => void;
}

export const SpecificationBuilder: React.FC<SpecificationBuilderProps> = ({ specifications, onChange }) => {
  const addSpec = () => {
    onChange([...specifications, { id: Math.random().toString(36).substr(2, 9), name: '', value: '' }]);
  };

  const updateSpec = (id: string, field: keyof Specification, value: string) => {
    onChange(specifications.map(spec => spec.id === id ? { ...spec, [field]: value } : spec));
  };

  const removeSpec = (id: string) => {
    onChange(specifications.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pl-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          Product Specifications
        </label>
        <button 
          type="button" onClick={addSpec}
          className="bg-black text-white p-3 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-black/20"
        >
          <Plus className="w-5 h-5 md:w-4 md:h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <Reorder.Group axis="y" values={specifications} onReorder={onChange} className="space-y-3">
          <AnimatePresence>
            {specifications.map((spec) => (
              <Reorder.Item 
                key={spec.id} value={spec}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative flex items-center gap-3 bg-white p-4 md:p-3 rounded-2xl group border border-gray-100 shadow-sm cursor-grab active:cursor-grabbing hover:border-black/5"
              >
                <div className="flex-shrink-0 text-gray-300 px-1">
                    <GripVertical className="w-5 h-5 md:w-4 md:h-4" />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    type="text" value={spec.name}
                    onChange={(e) => updateSpec(spec.id, 'name', e.target.value)}
                    placeholder="e.g. Memory"
                    className="w-full bg-gray-100 border-none rounded-xl px-4 py-4 md:py-3 text-sm md:text-xs font-bold focus:ring-2 focus:ring-black placeholder:text-gray-400"
                  />
                  <input 
                    type="text" value={spec.value}
                    onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
                    placeholder="e.g. 16GB"
                    className="w-full bg-gray-100 border-none rounded-xl px-4 py-4 md:py-3 text-sm md:text-xs font-bold focus:ring-2 focus:ring-black placeholder:text-gray-400"
                  />
                </div>
                
                <button 
                  type="button"
                  onClick={() => removeSpec(spec.id)}
                  className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                </button>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {specifications.length === 0 && (
          <div className="py-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 opacity-30">
            <LayoutList className="w-10 h-10 text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 grayscale">No Specifications Node</span>
          </div>
        )}
      </div>
    </div>
  );
};
