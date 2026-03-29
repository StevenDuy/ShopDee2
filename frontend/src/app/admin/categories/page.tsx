"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Layers,
  Edit,
  X,
  RefreshCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shopdee.io.vn/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  children?: Category[];
  level?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent_id: "" as string | number,
    parent_name: "Root Level (No Parent)",
  });
  
  const [parentSearch, setParentSearch] = useState("");
  const [isParentDropdownOpen, setIsParentDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchFlatCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlatCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/categories/flat`);
      setFlatCategories(res.data);
    } catch (error) {
      console.error("Fetch list error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, parent_id: formData.parent_id === "" ? null : formData.parent_id };
      if (editingCategory) {
        await axios.put(`${API_URL}/admin/categories/${editingCategory.id}`, payload);
      } else {
        await axios.post(`${API_URL}/admin/categories`, payload);
      }
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
      fetchFlatCategories();
    } catch (error: any) {
      const errorMsg = error.response?.data?.errors?.name 
        ? "Tên danh mục này đã tồn tại." 
        : (error.response?.data?.message || "Lỗi lưu danh mục");
      alert(errorMsg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deleting this category will remove all sub-categories. Proceed?")) return;
    try {
      await axios.delete(`${API_URL}/admin/categories/${id}`);
      fetchCategories();
      fetchFlatCategories();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", parent_id: "", parent_name: "Root Level (No Parent)" });
    setEditingCategory(null);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    const parent = flatCategories.find(c => c.id == cat.parent_id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      parent_id: cat.parent_id || "",
      parent_name: parent ? parent.name : "Root Level (No Parent)",
    });
    setParentSearch("");
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black">Categories</h1>
          <p className="text-gray-400 mt-2 font-medium tracking-tight text-xs md:text-sm">Structured taxonomy management. Max 2 levels (Root & Sub-category).</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-full md:w-auto bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all font-bold shadow-xl md:shadow-2xl shadow-black/10 text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-gray-100 p-4 md:p-12 shadow-sm relative">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <CategoryNode key={cat.id} category={cat} onEdit={openEditModal} onDelete={handleDelete} />
            ))}
            {categories.length === 0 && (
                <div className="py-20 text-center opacity-20">
                    <Layers className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-black uppercase tracking-[0.2em] text-xs">No Nodes Deployed</p>
                </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl p-6 md:p-12 mx-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-3xl font-black tracking-tighter">{editingCategory ? "Edit Node" : "Deploy Node"}</h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-50 p-3 rounded-full hover:bg-gray-100 transition-colors">
                    <X className="w-6 h-6 text-black" />
                  </button>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Category Identification</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 md:py-5 focus:ring-2 focus:ring-black font-bold text-sm" placeholder="Node Name (e.g. Home Appliances)" />
                  </div>

                  <div className="space-y-2 relative text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Parent Hierarchy Mapping</label>
                    
                    <div className="relative group">
                        <input 
                            type="text" 
                            className="w-full bg-gray-50 border-none rounded-2xl px-12 py-4 md:py-5 focus:ring-2 focus:ring-black font-bold text-sm"
                            placeholder="Select parent or start typing..."
                            value={isParentDropdownOpen ? parentSearch : formData.parent_name}
                            onFocus={() => {
                                setIsParentDropdownOpen(true);
                                setParentSearch("");
                            }}
                            onChange={(e) => setParentSearch(e.target.value)}
                        />
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <ChevronDown className={cn("absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 transition-transform", isParentDropdownOpen && "rotate-180")} />
                    </div>

                    <AnimatePresence>
                        {isParentDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-[115]" onClick={() => setIsParentDropdownOpen(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                    className="absolute z-[120] left-0 right-0 mt-3 bg-white border border-gray-100 rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] overflow-hidden"
                                >
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1 text-left">
                                        <div 
                                            onClick={() => { 
                                                setFormData({...formData, parent_id: "", parent_name: "Root Level (No Parent)"}); 
                                                setIsParentDropdownOpen(false); 
                                            }}
                                            className={cn(
                                                "p-4 rounded-xl text-[10px] font-black cursor-pointer uppercase tracking-widest transition-all mb-1",
                                                formData.parent_id === "" ? "bg-black text-white" : "text-gray-400 hover:bg-gray-50"
                                            )}
                                        >
                                            [ ROOT LEVEL ]
                                        </div>
                                        {flatCategories
                                            .filter(c => c.id !== editingCategory?.id && c.name.toLowerCase().includes(parentSearch.toLowerCase()))
                                            .map(c => (
                                                <div 
                                                    key={c.id} 
                                                    onClick={() => { 
                                                        setFormData({...formData, parent_id: c.id, parent_name: c.name}); 
                                                        setIsParentDropdownOpen(false); 
                                                    }}
                                                    className={cn(
                                                        "p-4 rounded-xl text-sm font-bold cursor-pointer transition-all flex items-center justify-between",
                                                        formData.parent_id == c.id ? "bg-black text-white" : "hover:bg-gray-50"
                                                    )}
                                                >
                                                    <span>{c.name}</span>
                                                    {formData.parent_id == c.id && <span className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                            ))
                                        }
                                        {flatCategories.length > 0 && flatCategories.filter(c => c.name.toLowerCase().includes(parentSearch.toLowerCase())).length === 0 && (
                                            <div className="p-8 text-center text-[10px] font-black text-gray-300 uppercase italic">No Matches Found</div>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                  </div>
                </div>

                <button className="w-full bg-black text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Confirm Deployment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryNode({ category, onEdit, onDelete }: { category: Category, onEdit: (c: Category) => void, onDelete: (id: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="space-y-1">
      <div className="group flex items-center justify-between p-2 md:p-4 px-4 md:px-6 rounded-xl md:rounded-2xl hover:bg-gray-50 transition-all duration-300">
        <div className="flex items-center gap-3 md:gap-6 relative z-10">
          <button onClick={() => setIsOpen(!isOpen)} className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all",
                hasChildren ? "bg-white border border-gray-100 shadow-sm text-black hover:scale-110" : "text-gray-100 cursor-default"
            )}>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-sm md:text-lg text-black tracking-tight truncate max-w-[120px] md:max-w-none">{category.name}</span>
            <span className="text-[8px] md:text-[10px] text-gray-300 font-black uppercase tracking-widest truncate">ID: {category.id} / SLUG: {category.slug}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <button onClick={() => onEdit(category)} className="p-2 md:p-3 text-gray-400 hover:text-black transition-all rounded-lg md:rounded-xl hover:bg-gray-100"><Edit className="w-4 h-4 md:w-5 md:h-5" /></button>
          <button onClick={() => onDelete(category.id)} className="p-2 md:p-3 text-gray-400 hover:text-red-500 transition-all rounded-lg md:rounded-xl hover:bg-gray-100"><Trash2 className="w-4 h-4 md:w-5 md:h-5" /></button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && hasChildren && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="pl-4 md:pl-10 border-l-[3px] border-gray-50/50 ml-[15px] md:ml-[19px] py-1 overflow-hidden"
            >
            {category.children!.map((child) => (
                <CategoryNode key={child.id} category={child} onEdit={onEdit} onDelete={onDelete} />
            ))}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
