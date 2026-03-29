"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import AuthWrapper from "../components/AuthWrapper";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`${API_URL}/auth/otp/send`, {
        email,
        purpose: "reset_password"
      });
      setSuccess("Authentication code synchronized. Verification required.");
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Signal synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper
      title="Lost Access"
      subtitle="Synchronizing neural frequency for identity recovery"
    >
      <form onSubmit={handleSendOtp} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">Identity Email</label>
          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/[0.08] rounded-full font-medium text-sm text-white focus:outline-none focus:border-white/20 transition-all backdrop-blur-3xl"
              placeholder="node@ecosystem.ai"
              required
            />
          </div>
        </div>

        {(error || success) && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className={`text-[10px] font-black uppercase px-6 py-4 rounded-2xl text-center tracking-widest border ${
              error ? "text-red-500 bg-red-500/10 border-red-500/20" : "text-green-500 bg-green-500/10 border-green-500/20"
            }`}
          >
            {error || success}
          </motion.div>
        )}

        <div className="pt-4">
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
          >
            {loading ? "Transmitting..." : <><Send size={18} /> Transmit Frequency</>}
          </motion.button>
        </div>

        <div className="text-center pt-4">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all italic">
            <ArrowLeft size={16} /> Return to Sandbox
          </Link>
        </div>
      </form>
    </AuthWrapper>
  );
}
