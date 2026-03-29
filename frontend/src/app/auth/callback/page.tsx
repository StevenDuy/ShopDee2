"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        setAuth(user, token);

        const roleRedirects: Record<string, string> = {
          admin: "/admin",
          seller: "/seller",
          customer: "/",
          shipper: "/shipper",
          linehaul: "/linehaul",
        };

        // Safety check: user.role might be string (slug) or object (relationship)
        const rawRole = typeof user?.role === 'string' ? user.role : user?.role?.name || 'customer';
        const target = roleRedirects[rawRole.toLowerCase()] || "/";
        
        router.push(target);
      } catch (e) {
        console.error("Auth Neural Sync Error:", e);
        router.push("/auth/login?error=sync_failed");
      }
    } else {
      router.push("/auth/login?error=no_data");
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8f9fc] to-[#f2f2f7] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="w-24 h-24 bg-blue-500/5 rounded-full flex items-center justify-center border border-blue-500/10 mb-8"
      >
        <ShieldCheck className="text-elite-blue" size={40} />
      </motion.div>
      <h1 className="text-black font-black uppercase tracking-[0.3em] text-sm mb-4">Neural Link Establishing</h1>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest italic">Decrypting Identity Tokens...</p>
      
      {/* Visual background noise for high-tech feel */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-300 text-[10px] uppercase font-black italic">Channeling...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
