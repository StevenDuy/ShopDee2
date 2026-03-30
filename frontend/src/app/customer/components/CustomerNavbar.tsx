"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, X, Home, Layers, Truck, LogOut, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const CustomerNavbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/customer/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Catalog', href: '/customer/products', icon: <Layers className="w-5 h-5" /> },
    { name: 'Shipments', href: '/customer/orders', icon: <Truck className="w-5 h-5" /> },
  ];

  // Function to handle profile click based on screen size
  const handleProfileClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(true);
    } else {
      // Normal behavior on PC (e.g. go to profile page or show minimal dropdown)
      console.log("PC Profile - No Sidebar");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/customer/dashboard" className="text-2xl font-black tracking-tighter uppercase transition-transform active:scale-95">
              Shop<span className="text-gray-300">Dee</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/customer/cart" className="p-3 hover:bg-gray-100 rounded-2xl transition-all relative">
              <ShoppingBag className="w-5 h-5 text-black" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
            </Link>
            
            {/* PROFILE BUTTON - SIDEBAR ONLY ON MOBILE */}
            <button 
              onClick={handleProfileClick}
              className="p-3 bg-black text-white rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* SIDEBAR - HIDDEN ON MD+ (PC) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm"
            />

            {/* Sidebar Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] z-[1001] bg-white shadow-[-20px_0_80px_rgba(0,0,0,0.1)] flex flex-col"
            >
              {/* Header */}
              <div className="p-8 flex items-center justify-between border-b border-gray-50">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Protocol Node</span>
                    <span className="text-xl font-black text-black tracking-tighter">CUSTOMER MENU</span>
                 </div>
                 <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-3 bg-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all"
                 >
                    <X className="w-5 h-5" />
                 </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-6 space-y-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center justify-between p-5 rounded-[1.5rem] hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                          {link.icon}
                       </div>
                       <span className="font-bold text-black">{link.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>

              {/* Footer / Account Actions */}
              <div className="p-8 border-t border-gray-50 space-y-4">
                 <button className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] text-red-500 hover:bg-red-50 transition-all font-bold">
                    <div className="p-3 bg-red-100 rounded-xl">
                       <LogOut className="w-5 h-5" />
                    </div>
                    Sign Out Terminal
                 </button>
                 <p className="text-[9px] font-black text-gray-300 text-center uppercase tracking-[0.3em]">ShopDee 2.0 Elite Dev Protocol</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
