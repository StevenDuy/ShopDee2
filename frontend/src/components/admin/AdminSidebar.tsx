"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Layers, 
  Package, 
  Users, 
  Settings,
  ChevronRight,
  LogOut,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ImageIcon, label: "Banners", href: "/admin/banners" },
  { icon: Layers, label: "Categories", href: "/admin/categories" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside className={cn(
      "w-72 h-screen bg-white border-r border-gray-100 flex flex-col p-8 gap-10 z-[110] relative",
      "shadow-2xl md:shadow-none"
    )}>
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-6 md:hidden p-2 text-gray-400 hover:text-black"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-black/20">
          S
        </div>
        <span className="font-black text-2xl tracking-tighter text-black">ShopDee</span>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { if (window.innerWidth < 768) onClose(); }}
              className={cn(
                "flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-black text-white shadow-xl shadow-black/10" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-black font-bold"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-gray-50">
        <button className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-gray-400 font-bold text-sm hover:text-red-500 hover:bg-red-50 transition-all duration-300">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative h-full"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
