"use client";

import Hero from "./components/Landing/Hero";

export default function LandingPage() {
  return (
    <main className="bg-white min-h-screen selection:bg-black selection:text-white overflow-hidden">
      {/* 1. Only Hero Section - As requested */}
      <Hero />
    </main>
  );
}
