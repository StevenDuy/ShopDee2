"use client";

import React from 'react';
import { CustomerNavbar } from '../components/CustomerNavbar';
import { CustomerBanner } from '../components/CustomerBanner';
import { ProductGrid } from '../components/ProductGrid';
import { motion } from 'framer-motion';

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-[#f8f8fa]">
      {/* 1. Global Navigation */}
      <CustomerNavbar />

      {/* 2. Main Content */}
      <main className="pt-24 space-y-16">
        
        {/* A. Hero Banner Integration - PLACED AT TOP */}
        <section className="max-w-7xl mx-auto px-6 pt-8">
           <motion.div
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           >
             <CustomerBanner />
           </motion.div>
        </section>

        <div className="max-w-7xl mx-auto px-6 space-y-32 pb-40">
          
          {/* B. New Arrivals */}
          <ProductGrid 
            title="Strategic Deployments" 
            type="new" 
            limit={4} 
          />

          {/* 
              PROMO SECTION REMOVED PER REQUEST
              "Automated Supply Chain..." has been deleted.
          */}

          {/* D. Best Sellers */}
          <ProductGrid 
            title="Sustainment Core" 
            type="top" 
            limit={8} 
          />
          
        </div>
      </main>

      {/* NO FOOTER AS REQUESTED */}
    </div>
  );
}
