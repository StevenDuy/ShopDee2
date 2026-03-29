"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface AuthWrapperProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthWrapper({ children, title, subtitle }: AuthWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center p-4">
      <motion.div
        initial={mounted ? { opacity: 0, scale: 0.95, y: 20 } : false}
        animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.95, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-[480px] p-8 sm:p-12 rounded-[3.5rem] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 ${!mounted ? 'pointer-events-none' : ''}`}
      >
        <div className="text-center mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 block">
            Secure Gateway
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tighter uppercase mb-4">
            {title}
          </h1>
          <p className="text-gray-500 text-sm font-medium tracking-tight px-4 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {children}
      </motion.div>
    </div>
  );
}
