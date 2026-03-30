"use client";

import React from 'react';
import { CustomerNavbar } from './components/CustomerNavbar';
import { CustomerBanner } from './components/CustomerBanner';
import { ProductGrid } from './components/ProductGrid';
import { motion } from 'framer-motion';

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Global Navigation */}
      <CustomerNavbar />

      {/* 2. Main Strategy Content */}
      <main className="pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          
          {/* A. Hero Banner Integration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CustomerBanner />
          </motion.div>

          {/* B. New Arrivals - New Node Cluster */}
          <ProductGrid 
            title="Strategic Deployments" 
            type="new" 
            limit={4} 
          />

          {/* D. Best Sellers - High Performance Nodes */}
          <ProductGrid 
            title="Sustainment Core" 
            type="top" 
            limit={8} 
          />
          
        </div>
      </main>

      {/* 
         NO FOOTER AS REQUESTED 
         The minimalist design ends definitively at the content edge.
      */}
    </div>
  );
}
