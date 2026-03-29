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
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 italic">Identity Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-standard px-6"
              placeholder="node@ecosystem.ai"
              required
            />
          </div>
        </div>

        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, x: 0 }} 
            animate={error ? { 
              opacity: 1, 
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.4 } 
            } : { opacity: 1, x: 0 }}
            className={`text-[10px] font-black uppercase px-6 py-4 rounded-2xl text-center tracking-widest border ${
              error ? "text-red-500 bg-red-50 border-red-100" : "text-emerald-600 bg-emerald-50 border-emerald-100"
            }`}
          >
            {error || success}
          </motion.div>
        )}

        <div className="pt-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="button-standard button-primary w-full uppercase tracking-widest text-sm"
          >
            {loading ? "Transmitting..." : <><Send size={18} /> Transmit Frequency</>}
          </motion.button>
        </div>

        <div className="text-center pt-4">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all italic">
            <ArrowLeft size={16} /> Return to Sandbox
          </Link>
        </div>
      </form>
    </AuthWrapper>
  );
}
