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

        const target = roleRedirects[user.role.toLowerCase()] || "/";
        router.push(target);
      } catch (e) {
        console.error("Auth Synchronicity Error:", e);
        router.push("/auth/login?error=sync_failed");
      }
    } else {
      router.push("/auth/login?error=no_data");
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mb-8"
      >
        <ShieldCheck className="text-blue-400" size={40} />
      </motion.div>
      <h1 className="text-white font-black uppercase tracking-[0.3em] text-sm mb-4">Neural Link Establishing</h1>
      <p className="text-white/20 text-[10px] font-black uppercase tracking-widest italic">Decrypting Identity Tokens...</p>
      
      {/* Visual background noise for high-tech feel */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white/20 text-[10px] uppercase font-black italic">Channeling...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
