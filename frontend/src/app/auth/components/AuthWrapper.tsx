"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      initial={mounted ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full max-w-[450px] p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-3xl backdrop-saturate-200 shadow-2xl ${!mounted ? 'pointer-events-none' : ''}`}
    >
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase mb-4">{title}</h1>
        <p className="text-white/30 text-xs sm:text-sm font-medium tracking-tight leading-relaxed">{subtitle}</p>
      </div>

      {children}
    </motion.div>
  );
}
