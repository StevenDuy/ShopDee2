"use client";

import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full max-w-[100vw] bg-black flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Premium Neural Background Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {children}
    </div>
  );
}
