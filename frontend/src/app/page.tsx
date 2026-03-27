import React from 'react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-black selection:bg-red-500/30">
      {/* Absolute Geometric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-950/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-950/10 blur-[120px] rounded-full"></div>
      </div>

      <section className="relative flex flex-col flex-1 items-center justify-center px-6 py-24">
        <div className="max-w-3xl w-full text-center">
          
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 text-[10px] font-bold tracking-[0.3em] text-red-500 uppercase border border-red-500/20 rounded-full bg-red-500/5 backdrop-blur-sm animate-fade-in">
             PROTOCOL: SHOPDEE2.4.2_AI_SANDBOX
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8">
            Behavioral <br /> 
            <span className="text-red-600 bg-clip-text">Research.</span>
          </h1>

          {/* Research Terms (Simple & Direct) */}
          <div className="grid grid-cols-1 gap-6 mb-12 text-left bg-gradient-to-b from-[#0A0A0A] to-transparent p-8 rounded-3xl border border-white/5">
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-red-500 font-mono text-lg">01</span>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-1">AI Behavior Monitoring</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    By accessing this node, you agree to full interaction logging. Data includes navigation patterns, reaction times, and behavioral metadata for fraud-detection model training.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <span className="text-red-500 font-mono text-lg">02</span>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-1">Mandatory Geosync</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Logistics operations are valid only with real-time GPS telemetry. You must maintain an active location signal to prevent session termination.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Call */}
          <div className="flex flex-col gap-6 items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">System ready for synchronization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Minimal Footer */}
      <footer className="relative flex flex-col items-center py-12 border-t border-white/5 bg-[#030303]">
        <div className="flex gap-8 mb-6">
          <div className="h-0.5 w-12 bg-red-600"></div>
          <div className="h-0.5 w-12 bg-slate-800"></div>
          <div className="h-0.5 w-12 bg-slate-800"></div>
        </div>
        <p className="text-[9px] text-slate-600 font-bold tracking-[0.4em] uppercase">Trust Score Protocol Active</p>
      </footer>
    </div>
  );
}
