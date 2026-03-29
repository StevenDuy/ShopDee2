"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  RefreshCcw, 
  Image as ImageIcon,
  Edit,
  X,
  Search,
  Check,
  ChevronDown,
  ExternalLink,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/banners`);
      setBanners(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await axios.get(`${API_URL}/admin/products/search?q=${query}`);
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
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    // Temporary set image_url for thumbnail preview in UI
    setFormData({ ...formData, image_url: objectUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle || "");
    data.append("product_id", formData.product_id?.toString() || "");
    
    // If no product is selected, redirect to main products catalog
    const finalLink = selectedProduct ? "" : (formData.link || "/products");
    data.append("link", finalLink);
    
    data.append("position", formData.position || "home_hero");
    data.append("sort_order", formData.sort_order.toString());
    
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      const url = editingBanner 
        ? `${API_URL}/admin/banners/${editingBanner.id}`
        : `${API_URL}/admin/banners`;
      
      console.log(`[DEBUG] Calling API: ${url} (Editing: ${!!editingBanner})`);

      // Laravel requires POST + _method=PUT for multipart updates
      if (editingBanner) {
        data.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method: "POST",
        body: data,
        headers: {
          "Accept": "application/json",
        }
      });

      console.log(`[DEBUG] Response Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (e) {
          const text = await response.text();
          console.error("Non-JSON Error Response:", text);
          throw new Error(`Server returned error ${response.status}: ${text.substring(0, 100)}...`);
        }

        console.error("Backend Error Data:", errorData);
        
        let errorMessage = "Failed to save banner";
        
        if (errorData.message) {
          errorMessage = errorData.message;
          if (errorData.error) {
            errorMessage += `\nDetails: ${typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error)}`;
          }
        } else if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' ? errorData.error : (errorData.error.message || errorMessage);
        } else if (errorData.errors) {
          // Flatten validation errors
          const validationErrors = Object.values(errorData.errors).flat().join("\n");
          errorMessage = `Validation Error:\n${validationErrors}`;
        }
        
        throw new Error(errorMessage);
      }

      setIsModalOpen(false);
      resetForm();
      fetchBanners();
    } catch (error: any) {
      console.error("Critical Save Error:", error);
      alert(`[BANNER SAVE ERROR]:\n${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`${API_URL}/admin/banners/${id}`);
      fetchBanners();
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
    setFormData({
      title: "",
      subtitle: "",
      link: "/products",
      product_id: "",
      position: "home_hero",
      sort_order: 0,
      image_url: "",
    });
    setSearchQuery("");
    setSearchResults([]);
    setSelectedProduct(null);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      link: banner.link || "/products",
      product_id: banner.product_id || "",
      position: banner.position,
      sort_order: banner.sort_order,
      image_url: banner.image_url,
    });
    setSelectedProduct(banner.product || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-black">Banners</h1>
          <p className="text-gray-400 mt-2 font-medium">Manage promotional placements and AI product syncing.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setEditingBanner(null); setIsModalOpen(true); }}
          className="bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-gray-800 transition-all font-bold shadow-2xl shadow-black/10"
        >
          <Plus className="w-5 h-5" />
          Create Banner
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-[16/9] bg-gray-50 rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {banners.map((banner) => (
            <motion.div 
              layout
              key={banner.id} 
              className="group relative bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-700"
            >
              {/* Image */}
              <div className="aspect-[16/9] relative bg-gray-50 border-b border-gray-50">
                <img 
                  src={banner.image_url} 
                  alt={banner.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                    <button onClick={() => openEditModal(banner)} className="bg-white text-black p-4 rounded-2xl hover:bg-gray-100 transition-all"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(banner.id)} className="bg-white text-red-500 p-4 rounded-2xl hover:bg-red-50 transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>

                <div className="absolute top-6 left-6">
                  <button 
                    onClick={() => toggleStatus(banner.id)}
                    className={cn(
                        "px-4 py-2 rounded-full border text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all",
                        banner.is_active ? "bg-white border-white text-green-600" : "bg-black/50 border-white/20 text-white backdrop-blur-md"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", banner.is_active ? "bg-green-600 animate-pulse" : "bg-white")} />
                    {banner.is_active ? "Live" : "Inactive"}
                  </button>
                </div>
              </div>

              {/* Content */}
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
                                <span className="flex items-center gap-1 text-gray-400"><ExternalLink className="w-3 h-3"/> {banner.link === "/products" ? "Catalog View" : "Custom Link"}</span>
                            )}
                        </span>
                    </div>
                  <span className="text-[10px] bg-gray-50 text-black font-black px-3 py-1 rounded-lg">POS: {banner.sort_order}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-tl-[3.5rem] rounded-bl-[3.5rem] rounded-tr-none rounded-br-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Inner Scrollable Container - Straight right edge for scrollbar */}
              <div className="overflow-y-auto p-12 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter">{editingBanner ? "Edit Placement" : "Create Placement"}</h2>
                      <p className="text-gray-400 text-sm font-medium mt-1">Configure your marketing nodes for optimal engagement.</p>
                    </div>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-50 p-3 rounded-full hover:bg-gray-100 transition-colors">
                      <X className="w-6 h-6 text-black" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Display Title</label>
                          <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black font-bold text-sm" placeholder="e.g. Summer Sale 2026" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Display Subtitle</label>
                          <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} 
                              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black font-bold text-sm" placeholder="Short description..." />
                      </div>
                    </div>

                    {/* Product Target Search */}
                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Link Product Target</label>
                      <div className="relative">
                          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                              <Search className="w-4 h-4 text-gray-400" />
                          </div>
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
                                  "w-full bg-gray-50 border-none rounded-2xl pl-14 pr-6 py-5 focus:ring-2 focus:ring-black font-bold text-sm transition-all",
                                  selectedProduct ? "bg-black text-white" : ""
                              )} 
                              placeholder="Search products to link (leave blank for /products)..." 
                          />
                          {selectedProduct && (
                               <button type="button" onClick={() => { setSelectedProduct(null); setFormData({ ...formData, product_id: "" }); setSearchQuery(""); }} className="absolute inset-y-0 right-6 flex items-center"><X className="w-4 h-4 text-white/50" /></button>
                          )}
                          <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                              <ChevronDown className={cn("w-4 h-4 text-gray-400", selectedProduct ? "text-white/20" : "")} />
                          </div>
                      </div>

                      {/* Search Dropdown */}
                      <AnimatePresence>
                          {showDropdown && (searchQuery || searchResults.length > 0) && !selectedProduct && (
                              <motion.div 
                                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                  className="absolute z-20 top-full left-0 w-full bg-white border border-gray-100 rounded-[2rem] shadow-2xl mt-4 overflow-hidden max-h-64 overflow-y-auto"
                              >
                                  {isSearching ? (
                                      <div className="p-6 text-center text-gray-400 font-bold text-xs">Searching for nodes...</div>
                                  ) : searchResults.length > 0 ? (
                                      searchResults.map(p => (
                                          <button 
                                              key={p.id} 
                                              type="button"
                                              onClick={() => {
                                                  setSelectedProduct(p);
                                                  setFormData({ ...formData, product_id: p.id });
                                                  setShowDropdown(false);
                                              }}
                                              className="w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50 transition-colors text-left group"
                                          >
                                              <div className="flex flex-col">
                                                  <span className="font-bold text-sm text-black">{p.title}</span>
                                                  <span className="text-[10px] text-gray-400 font-medium">Base Price: ${p.base_price}</span>
                                              </div>
                                              <Check className="w-4 h-4 text-transparent group-hover:text-black" />
                                          </button>
                                      ))
                                  ) : (
                                      <div className="p-6 text-center text-gray-400 font-bold text-xs">No matching nodes found.</div>
                                  )}
                              </motion.div>
                          )}
                      </AnimatePresence>
                    </div>

                    {/* Asset Upload */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Visual Asset</label>
                      <div className="relative aspect-[21/9] bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 overflow-hidden group/upload transition-all hover:border-black/20">
                        {formData.image_url ? (
                          <div className="relative w-full h-full">
                            <img src={formData.image_url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                              <button type="button" onClick={() => setFormData({ ...formData, image_url: "" })} className="bg-white text-black p-4 rounded-2xl"><Trash2 className="w-5 h-5"/></button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer">
                            {uploading ? (
                              <RefreshCcw className="w-10 h-10 animate-spin text-black" />
                            ) : (
                              <>
                                <Plus className="w-10 h-10 text-gray-200 group-hover/upload:text-black transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Deploy Image (21:9)</span>
                              </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={uploading || !formData.image_url}
                    className="w-full bg-black text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-300 transition-all mt-4"
                  >
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
