"use client";

import Hero from "./components/Landing/Hero";

export default function LandingPage() {
  return (
    <main className="bg-black text-white min-h-screen selection:bg-white selection:text-black overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black">
      {/* Mesh Gradient Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-blue-600/[0.03] rounded-full blur-[120px]" />
         <div className="absolute bottom-[20%] right-[10%] w-[800px] h-[800px] bg-purple-600/[0.03] rounded-full blur-[150px]" />
      </div>

      {/* 1. Only Hero Section - As requested */}
      <Hero />
    </main>
  );
}
