import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { UserPlus, Globe, User, Store, Truck, Navigation, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const roles = [
  { id: "customer", label: "Customer", icon: User, desc: "Shopping in the neural economy" },
  { id: "seller", label: "Seller", icon: Store, desc: "Managing supply nodes" },
  { id: "shipper", label: "Shipper", icon: Truck, desc: "Local logistics execution" },
  { id: "linehaul", label: "Linehaul", icon: Navigation, desc: "Long-range fleet driving" }
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
        otp: code,
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
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-6">Select Your Identity</label>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all duration-300 ${
                role === r.id 
                  ? "bg-black border-black text-white shadow-2xl shadow-black/20 scale-[1.02]" 
                  : "bg-[#f5f5f7] border-transparent text-gray-400 hover:bg-gray-200"
              }`}
            >
              <span className="text-[10px] uppercase font-black tracking-widest">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-6">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-standard"
          placeholder="John Doe"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-6">Email Address</label>
        <div className="flex gap-2 items-center">
          <input
            type="email"
            value={email}
            disabled={isOtpSent}
            onChange={(e) => setEmail(e.target.value)}
            className="input-standard flex-1 w-auto disabled:opacity-50"
            placeholder="your@email.com"
            required
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpLoading || countdown > 0}
            className="h-[60px] px-6 bg-black text-white rounded-[32px] text-[10px] font-black uppercase hover:bg-gray-800 transition-all disabled:opacity-30 whitespace-nowrap"
          >
            {otpLoading ? "..." : countdown > 0 ? `${countdown}s` : isOtpSent ? "Resend" : "Send Code"}
          </button>
        </div>
      </div>

      {isOtpSent && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-6">Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[72px] bg-blue-50/50 border-2 border-elite-blue/10 rounded-[2.5rem] font-black text-center text-2xl tracking-[10px] text-elite-blue focus:outline-none focus:border-elite-blue/40"
            placeholder="000000"
            maxLength={6}
            required
          />
        </motion.div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-6">Password</label>
        <div className="flex gap-2 items-center">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-standard flex-1 w-auto"
            placeholder="••••••••"
            required
          />
          <button type="button" onClick={() => setShowPw(s => !s)}
            className="w-[60px] h-[60px] flex items-center justify-center bg-[#f5f5f7] rounded-[32px] text-gray-400 hover:text-black transition-colors shrink-0">
            {showPw ? <EyeOff size={22} /> : <Eye size={22} />}
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
          className={`text-xs font-bold px-6 py-5 rounded-[2rem] text-center border ${
            error ? "text-red-600 bg-red-50 border-red-100" : "text-green-600 bg-green-50 border-green-100"
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
          className="button-standard button-primary w-full shadow-2xl shadow-black/10 uppercase tracking-widest text-sm"
        >
          {loading ? "Creating Ecosystem..." : "Join Ecosystem"}
        </motion.button>
      </div>

      <div className="text-center pt-10">
         <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
           Already a member? <Link href="/auth/login" className="text-black hover:underline underline-offset-8">Access Sandbox</Link>
         </p>
      </div>
    </form>
  );
}
