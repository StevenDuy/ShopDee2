"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  RefreshCcw, 
  ImageIcon,
  Edit,
  X,
  Search,
  Check,
  ChevronDown,
  ExternalLink,
  Package,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PaginationControl } from "@/components/PaginationControl";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.shopdee.io.vn/api";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dl4tisyhp";

interface Product {
  id: number;
  title: string;
  base_price: string;
}

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  link?: string;
  product_id?: number;
  product?: Product;
  position: string;
  is_active: boolean;
  sort_order: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, last: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    link: "/products",
    product_id: "" as string | number,
    position: "home_hero",
    sort_order: 0,
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Product Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchBanners(1);
  }, []);

  const fetchBanners = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/banners?page=${page}`);
      setBanners(res.data.data);
      setPagination({
        current: res.data.current_page,
        last: res.data.last_page
      });
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const res = await axios.get(`${API_URL}/admin/products/search?q=${query || ''}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFormData({ ...formData, image_url: objectUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle || "");
    data.append("product_id", formData.product_id?.toString() || "");
    const finalLink = selectedProduct ? "" : (formData.link || "/products");
    data.append("link", finalLink);
    data.append("position", formData.position || "home_hero");
    data.append("sort_order", formData.sort_order.toString());
    if (selectedFile) data.append("image", selectedFile);

    try {
      const url = editingBanner 
        ? `${API_URL}/admin/banners/${editingBanner.id}`
        : `${API_URL}/admin/banners`;
      
      if (editingBanner) data.append("_method", "PUT");

      const response = await fetch(url, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to save banner");

      setIsModalOpen(false);
      resetForm();
      fetchBanners(pagination.current);
    } catch (error: any) {
      console.error("Save Error:", error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/admin/banners/${id}`);
      fetchBanners(pagination.current);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      await axios.patch(`${API_URL}/admin/banners/${id}/toggle`);
      setBanners(banners.map(b => b.id === id ? { ...b, is_active: !b.is_active } : b));
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", subtitle: "", link: "/products", product_id: "", position: "home_hero", sort_order: 0, image_url: "" });
    setSearchQuery("");
    setSearchResults([]);
    setSelectedProduct(null);
    setSelectedFile(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({ title: banner.title, subtitle: banner.subtitle || "", link: banner.link || "/products", product_id: banner.product_id || "", position: banner.position, sort_order: banner.sort_order, image_url: banner.image_url });
    setSelectedProduct(banner.product || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-black">Banners</h1>
          <p className="text-gray-400 mt-2 font-medium tracking-tight uppercase text-[10px] font-bold">Node Deployment Fleet</p>
        </div>
        <button 
          onClick={() => { resetForm(); setEditingBanner(null); setIsModalOpen(true); }}
          className="bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-gray-800 transition-all font-bold shadow-2xl"
        >
          <Plus className="w-5 h-5" />
          Create Banner
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
           <RefreshCcw className="w-10 h-10 animate-spin text-gray-200" />
           <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Syncing Nodes...</p>
        </div>
      ) : (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {banners.map((banner) => (
                <motion.div layout key={banner.id} className="group relative bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-700">
                <div className="aspect-[16/9] relative bg-gray-50 border-b border-gray-50">
                    <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    
                    {/* Fixed Corner Actions - Like MediaManager/Seller Products */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                        <button 
                            onClick={() => openEditModal(banner)} 
                            className="p-3 bg-white text-black rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all border border-gray-100"
                            title="Edit Banner"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => toggleStatus(banner.id)}
                            className={cn(
                                "p-3 rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all border",
                                banner.is_active ? "bg-emerald-500 text-white border-emerald-400" : "bg-white text-gray-400 border-gray-100"
                            )}
                            title={banner.is_active ? "Deactivate" : "Activate"}
                        >
                        <Zap className={cn("w-4 h-4", banner.is_active && "fill-current")} />
                        </button>
                        <button 
                            onClick={() => handleDelete(banner.id)} 
                            className="p-3 bg-white text-red-500 rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all border border-gray-100"
                            title="Delete Banner"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-4 left-4">
                        <span className={cn(
                            "px-3 py-1.5 rounded-xl text-[8px] font-black tracking-widest uppercase flex items-center gap-2 backdrop-blur-md border transition-all", 
                            banner.is_active ? "bg-emerald-500 text-white border-white/20 shadow-lg shadow-emerald-500/20" : "bg-black/40 border-white/10 text-white shadow-xl"
                        )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", banner.is_active ? "bg-white animate-pulse" : "bg-gray-400")} />
                            {banner.is_active ? "Live Cluster" : "Inactive Node"}
                        </span>
                    </div>
                </div>
                <div className="p-8 space-y-4">
                    <div>
                        <h3 className="font-black text-xl text-black truncate">{banner.title}</h3>
                        {banner.subtitle && <p className="text-gray-400 text-xs font-medium mt-1 truncate">{banner.subtitle}</p>}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Target</span>
                            <span className="text-black font-bold text-sm">
                                {banner.product ? (
                                    <span className="flex items-center gap-1"><Package className="w-3 h-3"/> {banner.product.title}</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-gray-400"><ExternalLink className="w-3 h-3"/> {banner.link === "/products" ? "Catalog" : "Custom"}</span>
                                )}
                            </span>
                        </div>
                    <span className="text-[10px] bg-gray-50 text-black font-black px-3 py-1 rounded-lg">POS: {banner.sort_order}</span>
                    </div>
                </div>
                </motion.div>
            ))}
            </div>

            <PaginationControl 
                currentPage={pagination.current}
                lastPage={pagination.last}
                onPageChange={(page) => fetchBanners(page)}
            />
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
                initial={{ x: '100%', opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
                className="absolute top-0 right-0 h-full bg-white w-full max-w-2xl rounded-l-[3.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="overflow-y-auto p-12 custom-scrollbar flex-1">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase">{editingBanner ? "Edit Placement" : "Create Node"}</h2>
                    </div>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-50 p-3 rounded-full hover:bg-gray-100 transition-colors">
                      <X className="w-6 h-6 text-black" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Display Title</label>
                          <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                              className="w-full bg-gray-100 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black font-bold text-sm placeholder:text-gray-400" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Display Subtitle</label>
                          <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} 
                              className="w-full bg-gray-100 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black font-bold text-sm placeholder:text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-4 relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                           <Package className="w-3 h-3" /> Target Cluster Link
                        </label>
                        
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                            
                            <input 
                                type="text" 
                                value={selectedProduct ? selectedProduct.title : searchQuery}
                                onChange={(e) => { 
                                    if (selectedProduct) { setSelectedProduct(null); setFormData({ ...formData, product_id: "" }); }
                                    setSearchQuery(e.target.value); 
                                    setShowDropdown(true); 
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className={cn(
                                    "w-full bg-gray-100 border-none rounded-3xl pl-14 pr-14 py-5 focus:ring-2 focus:ring-black font-bold text-sm transition-all placeholder:text-gray-400",
                                    selectedProduct && "bg-black text-white"
                                )} 
                                placeholder="Scan database for product nodes..." 
                            />

                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {(searchQuery || selectedProduct) && (
                                    <button 
                                        type="button"
                                        onClick={() => { setSelectedProduct(null); setSearchQuery(""); setFormData({ ...formData, product_id: "" }); }}
                                        className="p-1 hover:bg-black/10 rounded-full transition-colors"
                                    >
                                        <X className={cn("w-4 h-4", selectedProduct ? "text-white" : "text-gray-400")} />
                                    </button>
                                )}
                                <ChevronDown className={cn("w-4 h-4 transition-transform", showDropdown && !selectedProduct && "rotate-180", selectedProduct ? "text-white/40" : "text-gray-300")} />
                            </div>
                        </div>

                        <AnimatePresence>
                            {showDropdown && searchQuery && !selectedProduct && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="absolute z-20 top-full left-0 w-full bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] mt-4 overflow-hidden max-h-80 flex flex-col"
                                >
                                    <div className="overflow-y-auto custom-scrollbar p-2">
                                        {isSearching ? (
                                            <div className="py-12 flex flex-col items-center justify-center gap-3">
                                                <RefreshCcw className="w-6 h-6 animate-spin text-gray-200" />
                                                <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Scanning Nodes...</span>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.map(p => (
                                                <button 
                                                    key={p.id} 
                                                    type="button" 
                                                    onClick={() => { setSelectedProduct(p); setFormData({ ...formData, product_id: p.id }); setShowDropdown(false); }} 
                                                    className="w-full px-8 py-5 hover:bg-gray-50 flex items-center justify-between rounded-2xl group transition-all"
                                                >
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-bold text-sm text-black group-hover:translate-x-1 transition-transform">{p.title}</span>
                                                        <span className="text-[10px] uppercase font-black text-gray-300 tracking-[0.1em] mt-1">ID: #{p.id}</span>
                                                    </div>
                                                    <div className="bg-gray-100 px-4 py-2 rounded-xl text-[10px] font-black text-black group-hover:bg-black group-hover:text-white transition-all">
                                                        VAL: {Number(p.base_price).toLocaleString()}đ
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center">
                                                <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest leading-relaxed">System Error: 404<br/>No Matching Nodes Detected</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Visual Asset</label>
                      <div className="relative aspect-[21/9] bg-gray-100 rounded-[2.5rem] border-2 border-dashed border-gray-200 overflow-hidden group/upload transition-all hover:border-black/20">
                        {formData.image_url ? (
                          <div className="relative w-full h-full">
                            <img src={formData.image_url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                              <button type="button" onClick={() => setFormData({ ...formData, image_url: "" })} className="bg-white text-black p-4 rounded-2xl"><Trash2 className="w-5 h-5"/></button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer">
                            <Plus className="w-10 h-10 text-gray-200" />
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={uploading || !formData.image_url} className="w-full bg-black text-white py-6 rounded-3xl font-black text-xl shadow-2xl disabled:bg-gray-100">
                    {editingBanner ? "Push Changes" : "Create Node"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
