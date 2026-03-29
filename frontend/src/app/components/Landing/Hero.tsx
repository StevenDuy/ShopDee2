"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center border-b border-white/[0.05]">
      {/* Dynamic Mesh Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl"
      >
        <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black text-white leading-[0.85] tracking-[-0.05em] mb-12">
          SHOPDEE <br />
          <span className="text-white/20">AGENTIC.</span>
        </h1>

        <p className="text-lg md:text-2xl text-white/50 max-w-2xl mx-auto font-medium leading-relaxed mb-16 tracking-tight px-4 sm:px-0">
          A minimalist high-fidelity ecosystem for <br className="hidden md:block" />
          behavioral AI research and recursive logistics.
        </p>

        <div className="flex justify-center">
          <Link href="/auth/login">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 md:px-12 md:py-6 bg-white text-black font-black text-lg md:text-xl rounded-full flex items-center gap-3 transition-colors duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              Start Sandbox
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Subtle Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute bottom-12 flex flex-col items-center gap-4 opacity-20"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
}
