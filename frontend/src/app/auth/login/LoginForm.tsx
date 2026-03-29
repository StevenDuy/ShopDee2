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
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-6">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-standard px-6"
          placeholder="your@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-6">Password</label>
        <div className="flex gap-2 items-center">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-standard flex-1 w-auto px-6"
            placeholder="••••••••"
            required
          />
          <button type="button" onClick={() => setShowPw(s => !s)}
            className="w-[60px] h-[60px] flex items-center justify-center bg-[#f5f5f7] rounded-[32px] text-gray-400 hover:text-black transition-colors shrink-0">
            {showPw ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
        <div className="flex justify-end px-6">
          <Link href="/auth/forgot-password" 
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            Lost Access?
          </Link>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-6 py-4 rounded-2xl text-center"
        >
          {error}
        </motion.div>
      )}

      <div className="pt-2 space-y-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="button-standard button-primary w-full"
        >
          {loading ? "Decrypting..." : "Access Sandbox"}
        </motion.button>

        <div className="relative flex items-center gap-4 py-2">
          <div className="h-px bg-gray-100 flex-1"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Neural Identity</span>
          <div className="h-px bg-gray-100 flex-1"></div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button" 
          onClick={handleGoogleLogin}
          className="button-standard button-outline w-full"
        >
          Continue with Google
        </motion.button>
      </div>

      <div className="text-center pt-8">
         <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
           New Node? <Link href="/auth/register" className="text-black hover:underline underline-offset-8">Initialize Identity</Link>
         </p>
      </div>
    </form>
  );
}
