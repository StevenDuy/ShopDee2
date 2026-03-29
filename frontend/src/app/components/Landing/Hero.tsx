"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl"
      >
        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 block animate-entrance">
          ShopDee 2.0 • Elite Sandbox
        </span>

        <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-black text-black leading-[0.85] tracking-[-0.05em] mb-12">
          RECURSIVE <br />
          <span className="text-gray-200">LOGISTICS.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto font-medium leading-relaxed mb-16 tracking-tight px-4 sm:px-0">
          A high-fidelity minimalist ecosystem for behavioral AI research and automated logistics synchronization.
        </p>

        <div className="flex justify-center">
          <Link href="/auth/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-6 bg-black text-white font-bold text-lg rounded-full flex items-center gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Access Sandbox
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Subtle Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute bottom-12 flex flex-col items-center gap-4 opacity-10"
      >
        <div className="w-[1px] h-12 bg-black" />
      </motion.div>
    </section>
  );
}
