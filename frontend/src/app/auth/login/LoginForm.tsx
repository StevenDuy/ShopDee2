"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { Eye, EyeOff, LogIn, Globe } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { user, token } = res.data;
      setAuth(user, token);
      
      const roleRedirects: Record<string, string> = {
        admin: "/admin",
        seller: "/seller",
        customer: "/",
        shipper: "/shipper",
        linehaul: "/linehaul",
      };

      const target = roleRedirects[user.role.toLowerCase()] || "/";
      router.push(target);
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-white/[0.03] border border-white/[0.08] rounded-full font-medium text-sm text-white focus:outline-none focus:border-white/20 transition-all backdrop-blur-3xl"
          placeholder="your@email.com"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 sm:px-8 py-4 sm:py-5 pr-14 sm:pr-16 bg-white/[0.03] border border-white/[0.08] rounded-full font-medium text-sm text-white focus:outline-none focus:border-white/20 transition-all backdrop-blur-3xl"
            placeholder="••••••••"
            required
          />
          <button type="button" onClick={() => setShowPw(s => !s)}
            className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="flex justify-end px-6">
          <Link href="/auth/forgot-password" 
            className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors italic">
            Lost Access?
          </Link>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-black uppercase text-red-500 bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-2xl text-center tracking-widest"
        >
          {error}
        </motion.div>
      )}

      <div className="pt-2 space-y-4">
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
        >
          {loading ? "Decrypting..." : <><LogIn size={18} /> Access Sandbox</>}
        </motion.button>

        <div className="relative flex items-center gap-4 py-2">
          <div className="h-px bg-white/5 flex-1"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/10 whitespace-nowrap italic">Neural Identity</span>
          <div className="h-px bg-white/5 flex-1"></div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
          whileTap={{ scale: 0.99 }}
          type="button" 
          onClick={handleGoogleLogin}
          className="w-full py-4 bg-transparent border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-full flex items-center justify-center gap-3 hover:border-white/20 transition-all"
        >
          <Globe size={16} className="text-blue-400" /> Continue with Google
        </motion.button>
      </div>

      <div className="text-center pt-8">
         <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
           New Node? <Link href="/auth/register" className="text-white hover:underline underline-offset-4">Initialize Identity</Link>
         </p>
      </div>
    </form>
  );
}
