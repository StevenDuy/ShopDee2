"use client";

import React from "react";
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,280", change: "+12%", icon: Users, color: "text-black", bg: "bg-gray-50" },
  { label: "New Orders", value: "456", change: "+5%", icon: ShoppingBag, color: "text-black", bg: "bg-gray-50" },
  { label: "Revenue", value: "$45,200", change: "+18%", icon: TrendingUp, color: "text-black", bg: "bg-gray-50" },
  { label: "Disputed Items", value: "12", change: "-2%", icon: AlertCircle, color: "text-black", bg: "bg-gray-50" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-black">Dashboard</h1>
          <p className="text-gray-400 mt-2 font-medium tracking-tight">System operations are nominal. AI Sandbox telemetry integrated.</p>
        </div>
        <div className="flex gap-2">
           <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live System</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 group">
            <div className="flex justify-between items-start mb-8">
              <div className={`${stat.bg} p-5 rounded-2xl group-hover:bg-black group-hover:text-white transition-all duration-500`}>
                <stat.icon className="w-6 h-6 transition-colors" />
              </div>
              <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-black text-black tracking-tighter">{stat.value}</span>
                <ArrowUpRight className="w-6 h-6 text-gray-100 group-hover:text-black transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-gray-50 rounded-[3.5rem] p-12 h-[32rem] flex flex-col items-center justify-center text-center gap-6 border border-gray-100">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm">
            <TrendingUp className="w-10 h-10 text-gray-200" />
          </div>
          <div className="max-w-sm">
            <h3 className="font-black text-2xl tracking-tight text-black">Revenue Analytics</h3>
            <p className="text-gray-400 text-sm mt-2 font-medium">Real-time financial data processing in progress. Predictive AI modeling will appear here.</p>
          </div>
        </div>

        <div className="bg-black rounded-[3.5rem] p-12 text-white flex flex-col justify-between group overflow-hidden relative shadow-2xl shadow-black/20">
          <div className="relative z-10">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <Users className="w-6 h-6 text-white" />
             </div>
            <h3 className="text-3xl font-black tracking-tighter mb-3">Trust Network</h3>
            <p className="text-white/40 text-sm font-medium leading-relaxed">Monitoring autonomous AI agent behaviors across the logistics sandbox pipeline.</p>
          </div>
          <div className="relative z-10 flex items-center gap-6">
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-black bg-gray-800 flex items-center justify-center text-[10px] font-bold">JD</div>)}
             </div>
             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">4 Nodes Managed</span>
          </div>
          
          {/* Decorative gradients */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 blur-[100px] rounded-full group-hover:bg-white/10 transition-all duration-1000" />
        </div>
      </div>
    </div>
  );
}
