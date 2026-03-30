"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const CustomerBanner: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useMotionValue(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${API_URL}/banners/active`);
        setBanners(res.data);
      } catch (err) {
        console.error("Banner fetch error", err);
      }
    };
    fetchBanners();
  }, []);

  const onDragEnd = () => {
    const x = dragX.get();
    if (x <= -50) {
      next();
    } else if (x >= 50) {
      prev();
    }
    setIsDragging(false);
  };

  const next = () => setIndex((i) => (i + 1) % banners.length);
  const prev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (banners.length === 0 || isDragging) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [banners.length, isDragging]);

  if (banners.length === 0) return (
    <div className="w-full aspect-[4/3] md:aspect-[21/7] min-h-[300px] md:min-h-0 bg-gray-100 animate-pulse rounded-[3rem] overflow-hidden flex items-center justify-center">
        <span className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em]">Synchronizing Visuals...</span>
    </div>
  );

  const current = banners[index];

  return (
    <section 
      className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/7] min-h-[300px] md:min-h-0 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] group select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
           key={current.id}
           drag="x"
           dragConstraints={{ left: 0, right: 0 }}
           style={{ x: dragX, cursor: isDragging ? 'grabbing' : 'grab' }}
           onDragStart={() => setIsDragging(true)}
           onDragEnd={onDragEnd}
           initial={{ opacity: 0, scale: 1.05 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.98 }}
           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
           className="absolute inset-0"
        >
          {/* Cinema Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/30 md:to-transparent z-10" />
          
          <img 
            src={current.image_url} 
            alt={current.title} 
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* Content Wrapper */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end md:justify-center p-8 md:p-24 pb-16 md:pb-24">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-3xl"
            >
              <h2 className="text-[clamp(1.2rem,5vw,3rem)] font-black text-white leading-[1] tracking-tighter uppercase mb-2 drop-shadow-xl">
                {current.title}
              </h2>
              <p className="text-[clamp(0.7rem,2.5vw,1rem)] text-white/60 font-medium tracking-tight mb-6 md:mb-10 line-clamp-2 md:line-clamp-none max-w-2xl">
                {current.subtitle}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-24 z-30 flex gap-3">
        {banners.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)}
            className="h-1 py-4 flex items-center transition-all group"
          >
             <div className={cn(
                "h-1 rounded-full transition-all duration-500", 
                i === index ? "w-10 bg-white" : "w-5 bg-white/20 group-hover:bg-white/40"
             )} />
          </button>
        ))}
      </div>
    </section>
  );
};

// Local cn utility
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
