"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { User, Store, Truck, Navigation, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const roles = [
  { id: "customer", label: "Customer", icon: <User className="w-8 h-8" />, desc: "Shopping in the neural economy" },
  { id: "seller", label: "Seller", icon: <Store className="w-8 h-8" />, desc: "Managing supply nodes" },
  { id: "shipper", label: "Shipper", icon: <Truck className="w-8 h-8" />, desc: "Local logistics execution" },
  { id: "linehaul", label: "Linehaul", icon: <Navigation className="w-8 h-8" />, desc: "Long-range fleet driving" }
];

function GoogleSetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const googleId = searchParams.get("google_id");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const handleComplete = async () => {
    if (!email || !googleId) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/google/complete`, {
        email, name, google_id: googleId, role
      });
      // Login locally
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      toast.success("Identity established!");
      router.push(`/${res.data.user.role}`);
    } catch (err) {
      toast.error("Handshake failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return <div className="text-white text-center">Neural Link Session Expired. Redirecting...</div>;

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 sm:p-12 overflow-hidden selection:bg-blue-500/30">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-2xl bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] rounded-[48px] p-8 sm:p-12 shadow-2xl">
        <div className="text-center mb-12">
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase text-blue-400 tracking-widest mb-6 italic">
            <ShieldCheck size={14} /> Identity Handshake Required
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-4 italic">Welcome, <span className="text-blue-400">{name?.split(" ")[0]}</span></h1>
          <p className="text-white/40 text-xs sm:text-sm font-medium tracking-wide max-w-md mx-auto">Your Neural ID has been verified via Google. Select your identity within the ShopDee sandbox to finalize the protocol.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`p-6 rounded-[28px] border-2 text-left transition-all duration-300 group ${role === r.id
                  ? "bg-blue-600/10 border-blue-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                  : "bg-white/[0.02] border-white/[0.05] text-white/30 hover:border-white/10"
                }`}
            >
              <div className={`mb-4 transition-colors ${role === r.id ? "text-blue-400" : "group-hover:text-white"}`}>{r.icon}</div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-1 italic">{r.label}</h3>
              <p className="text-[10px] opacity-60 font-medium tracking-tight">{r.desc}</p>
            </button>
          ))}
        </div>

        <div className="mt-12">
          <button
            onClick={handleComplete}
            disabled={loading}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full flex items-center justify-center gap-2 hover:bg-blue-400 hover:text-white transition-all disabled:opacity-50"
          >
            {loading ? "Establishing Presence..." : "Finalize Handshake"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Connecting Neural Link...</div>}>
      <GoogleSetupForm />
    </Suspense>
  );
}
