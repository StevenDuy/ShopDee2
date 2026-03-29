"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import AuthWrapper from "../components/AuthWrapper";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Synchronicity failure: Passwords mismatch.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`${API_URL}/auth/password/reset`, {
        email,
        otp,
        password,
        password_confirmation: passwordConfirmation
      });
      setSuccess("Identity restored. Neural link updated.");
      setTimeout(() => {
        router.push("/auth/login?reset=true");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Restoration frequency failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="space-y-6">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 italic">Target Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full px-8 py-4 bg-gray-50 border border-gray-100 rounded-full font-medium text-xs text-gray-500 focus:outline-none cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 italic">Verification Pulse (6 Digits)</label>
        <div className="relative">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-standard px-6 text-center text-xl tracking-[10px] font-black"
            placeholder="000000"
            maxLength={6}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 italic">New Neural Key</label>
        <div className="flex gap-2 items-center">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-standard flex-1 w-auto px-6"
            placeholder="••••••••"
            required
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="w-[60px] h-[60px] flex items-center justify-center bg-[#f5f5f7] rounded-[32px] text-gray-400 hover:text-black shrink-0">
             {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 italic">Confirm Neural Key</label>
        <div className="flex gap-2 items-center">
          <input
            type={showConfirmPw ? "text" : "password"}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="input-standard flex-1 w-auto px-6"
            placeholder="••••••••"
            required
          />
          <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="w-[60px] h-[60px] flex items-center justify-center bg-[#f5f5f7] rounded-[32px] text-gray-400 hover:text-black shrink-0">
             {showConfirmPw ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
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
            success ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-red-500 bg-red-50 border-red-100"
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
          disabled={loading || !!success}
          className="button-standard button-primary w-full uppercase tracking-widest text-sm"
        >
          {loading ? "Re-coding..." : "Restore Identity"}
        </motion.button>
      </div>

      <div className="text-center pt-4">
        <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all italic">
          <ArrowLeft size={16} /> Previous Channel
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthWrapper
      title="Identity Restore"
      subtitle="Recalibrating security protocols for your node"
    >
      <Suspense fallback={<div className="text-gray-300 text-[10px] uppercase font-black text-center italic">Loading Frequency...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthWrapper>
  );
}
