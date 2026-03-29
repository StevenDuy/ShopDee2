"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { User, Store, Truck, Navigation, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import AuthWrapper from "../components/AuthWrapper";

const roles = [
  { id: "customer", label: "Customer", icon: User, desc: "Shopping in the neural economy" },
  { id: "seller", label: "Seller", icon: Store, desc: "Managing supply nodes" },
  { id: "shipper", label: "Shipper", icon: Truck, desc: "Local logistics execution" },
  { id: "linehaul", label: "Linehaul", icon: Navigation, desc: "Long-range fleet driving" }
];

function GoogleSetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const [email] = useState(searchParams.get("email"));
  const [name] = useState(searchParams.get("name"));
  const [googleId] = useState(searchParams.get("google_id"));
  const [error, setError] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const handleComplete = async () => {
    if (!email || !googleId) {
      router.push("/auth/login");
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await axios.post(`${API_URL}/auth/google/complete`, {
        email, name, google_id: googleId, role
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      toast.success("Identity established!");
      router.push(`/${res.data.user.role}`);
    } catch (err) {
      setError(true);
      toast.error("Handshake failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-12">
      <div className="text-black text-center font-black uppercase tracking-widest text-xs italic">Neural Link Session Expired.</div>
    </div>
  );

  return (
    <AuthWrapper 
      title="Almost Home" 
      subtitle={`Welcome, ${name?.split(" ")[0]}. One final step to calibrate your identity in the ShopDee sandbox.`}
    >
      <motion.div 
        animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-6">Select Your Identity</label>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all duration-500 group ${
                  role === r.id
                    ? "bg-black border-black text-white shadow-2xl shadow-black/20 scale-[1.02]"
                    : "bg-[#f5f5f7] border-transparent text-gray-400 hover:bg-gray-200"
                }`}
              >
                <div className="p-2 transition-transform duration-500 group-hover:scale-110">
                  <r.icon size={26} />
                </div>
                <div className="text-center">
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-1">{r.label}</h3>
                  <p className="text-[8px] opacity-40 font-bold tracking-tight px-2">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            disabled={loading}
            className="button-standard button-primary w-full shadow-2xl shadow-black/10 uppercase tracking-widest text-sm"
          >
            {loading ? "Establishing Presence..." : <><ShieldCheck size={18} /> Finalize Protocol</>}
          </motion.button>
        </div>
      </motion.div>
    </AuthWrapper>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Synchronizing...</div>}>
      <GoogleSetupForm />
    </Suspense>
  );
}
