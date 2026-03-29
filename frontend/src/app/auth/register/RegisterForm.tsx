"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { UserPlus, Globe, User, Store, Truck, Navigation, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const roles = [
  { id: "customer", label: "Customer", icon: <User className="w-4 h-4" /> },
  { id: "seller", label: "Seller", icon: <Store className="w-4 h-4" /> },
  { id: "shipper", label: "Shipper", icon: <Truck className="w-4 h-4" /> },
  { id: "linehaul", label: "Linehaul", icon: <Navigation className="w-4 h-4" /> }
];

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [code, setCode] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setOtpLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`${API_URL}/auth/otp/send`, {
        email,
        purpose: "registration"
      });
      setIsOtpSent(true);
      setSuccess("Verification code sent!");
      startCountdown();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send code.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpSent) {
      setError("Please verify your email first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role,
        code,
      });
      // Legacy behavior: Redirect to login with success message
      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      {/* Role Selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">Select Your Identity</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`p-4 rounded-3xl border flex flex-col items-center gap-2 transition-all duration-300 ${
                role === r.id 
                  ? "bg-white/10 border-white/20 text-white shadow-lg" 
                  : "bg-white/[0.02] border-white/[0.05] text-white/30 hover:bg-white/[0.05]"
              }`}
            >
              <div className={role === r.id ? "text-blue-400" : ""}>{r.icon}</div>
              <span className="text-[10px] uppercase font-black tracking-widest">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-5 sm:px-8 py-4 sm:py-5 bg-white/[0.03] border border-white/[0.08] rounded-full font-medium text-sm text-white focus:outline-none focus:border-white/20 transition-all backdrop-blur-3xl"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">Email Address</label>
        <div className="relative">
          <input
            type="email"
            value={email}
            disabled={isOtpSent}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 sm:px-8 py-4 sm:py-5 pr-[105px] sm:pr-32 bg-white/[0.03] border border-white/[0.08] rounded-full font-medium text-sm text-white focus:outline-none focus:border-white/20 transition-all backdrop-blur-3xl disabled:opacity-50"
            placeholder="your@email.com"
            required
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpLoading || countdown > 0}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/10 rounded-full text-[8px] sm:text-[10px] font-black uppercase text-white hover:bg-white/20 transition-all disabled:opacity-30"
          >
            {otpLoading ? "..." : countdown > 0 ? `${countdown}s` : isOtpSent ? "Resend" : "Send Code"}
          </button>
        </div>
      </div>

      {isOtpSent && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 px-6 italic">Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-blue-500/5 border border-blue-400/20 rounded-full font-black text-center text-lg sm:text-xl tracking-[4px] sm:tracking-[10px] text-blue-400 focus:outline-none"
            placeholder="000000"
            maxLength={6}
            required
          />
        </motion.div>
      )}

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
      </div>

      {(error || success) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
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
          {loading ? "Creating Ecosystem..." : <><UserPlus size={18} /> Join Ecosystem</>}
        </motion.button>
      </div>

      <div className="text-center pt-8">
         <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
           Already a member? <Link href="/auth/login" className="text-white hover:underline underline-offset-4">Access Sandbox</Link>
         </p>
      </div>
    </form>
  );
}
