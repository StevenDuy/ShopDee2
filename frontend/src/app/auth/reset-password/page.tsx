"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { ShieldCheck, Key, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AuthWrapper from "../components/AuthWrapper";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email] = useState(emailParam);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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
        code,
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
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">Target Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full px-6 py-5 bg-white/[0.01] border border-white/[0.05] border-dashed rounded-full font-medium text-xs text-white/40 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">Verification Pulse (6 Digits)</label>
        <div className="relative">
          <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-blue-500/5 border border-blue-400/20 rounded-full font-black text-center text-xl tracking-[10px] text-blue-400 focus:outline-none"
            placeholder="000000"
            maxLength={6}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">New Neural Key</label>
        <div className="relative">
          <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" size={18} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/[0.08] rounded-full font-medium text-sm text-white focus:outline-none focus:border-white/20 transition-all backdrop-blur-3xl"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">Confirm Neural Key</label>
        <div className="relative">
          <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" size={18} />
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/[0.08] rounded-full font-medium text-sm text-white focus:outline-none focus:border-white/20 transition-all backdrop-blur-3xl"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      {(error || success) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`text-[10px] font-black uppercase px-6 py-4 rounded-2xl text-center tracking-widest border ${
            success ? "text-green-500 bg-green-500/10 border-green-500/20" : "text-red-500 bg-red-500/10 border-red-500/20"
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
          disabled={loading || !!success}
          className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
        >
          {loading ? "Re-coding..." : <><CheckCircle size={18} /> Restore Identity</>}
        </motion.button>
      </div>

      <div className="text-center pt-4">
        <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all italic">
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
      <Suspense fallback={<div className="text-white/20 text-[10px] uppercase font-black text-center italic">Loading Frequency...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthWrapper>
  );
}
