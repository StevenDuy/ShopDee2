import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootClientWrapper from "@/components/RootClientWrapper/RootClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopDee2 | AI Research Sandbox",
  description: "Experimental 5-in-1 E-commerce & Logistics Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. FRONTEND LOCAL CONFIG CHECK
  const frontendValidation: any = {
    NEXT_PUBLIC_API_URL: { 
      pattern: /^https?:\/\//, 
      help: 'Must be your Backend API URL (e.g. http://localhost:8000/api)' 
    },
    NEXT_PUBLIC_PUSHER_APP_KEY: { 
      pattern: /^[a-f0-9]{20}$/, 
      help: '20-character hex string from Pusher Dashboard' 
    },
    NEXT_PUBLIC_PUSHER_APP_CLUSTER: { 
      pattern: /^[a-z0-9\-]+$/, 
      help: 'Pusher region code (e.g. ap1, us2)' 
    },
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: { 
      pattern: /\.apps\.googleusercontent\.com$/, 
      help: 'Google OAuth Client ID' 
    },
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: {
      pattern: /^[a-z0-9_\-]+$/,
      help: 'Your Cloudinary Cloud Name'
    },
    NEXT_PUBLIC_APP_NAME: {
      pattern: /^.+$/,
      help: 'The name of your application'
    },
  };

  const frontendKeys: any = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    NEXT_PUBLIC_PUSHER_APP_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  };

  const invalidFrontend = Object.entries(frontendKeys).filter(([key, value]: any) => {
    return !value || !frontendValidation[key].pattern.test(value) || value.includes("NHẬP_");
  });

  if (invalidFrontend.length > 0) {
    return (
      <html lang="en">
        <body className="bg-black text-white font-mono flex items-center justify-center h-screen m-0">
          <div className="max-w-xl w-full text-center border border-[#333] p-10 rounded-2xl bg-[#050505]">
            <h1 className="text-xl text-[#ff3333] font-bold mb-6 tracking-widest uppercase">API FRONTEND ERROR</h1>
            {invalidFrontend.map(([key]: any) => (
              <div key={key} className="mb-6 text-left border-b border-[#1a1a1a] pb-6 last:border-0 last:pb-0">
                <code className="text-2xl font-bold text-white block truncate mb-1">{key}</code>
                <p className="text-orange-500 text-xs font-bold mb-3 tracking-tighter uppercase opacity-80">File: frontend/.env.local</p>
                <div className="bg-[#111] p-5 rounded-2xl border-l-4 border-red-600">
                  <p className="text-[#00ff00] text-sm leading-relaxed">{frontendValidation[key].help}</p>
                </div>
              </div>
            ))}
          </div>
        </body>
      </html>
    );
  }

  // 2. BACKEND REMOTE CONFIG CHECK (Ping the API)
  let backendError: any = null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL}/api/p-check`, { 
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      backendError = await res.json().catch(() => ({ 
        error: 'Connection Error', 
        message: 'Backend is unreachable.',
        key: 'BACKEND_SERVER',
        help: 'Make sure your Laravel server and tunnel are running.'
      }));
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    backendError = { 
      error: 'Connection Failed', 
      key: err.name === 'AbortError' ? 'API_TIMEOUT' : 'CONNECTION_FAILED',
      help: err.name === 'AbortError' ? 'The Backend API took too long to respond (>3s). This usually means your NEXT_PUBLIC_API_URL is wrong or the tunnel is dead.' : 'Could not connect to the Backend API server. Please check your Cloudflare Tunnel and .env.local configuration.' 
    };
  }

  if (backendError) {
    return (
      <html lang="en">
        <body className="bg-black text-white font-mono flex items-center justify-center h-screen m-0">
          <div className="max-w-xl w-full text-center border border-[#333] p-10 rounded-2xl bg-[#050505]">
            <h1 className="text-xl text-[#ff3333] font-bold mb-8 tracking-widest uppercase">API BACKEND ERROR</h1>
            <div className="mb-8 text-left">
              <code className="text-2xl font-bold text-white block truncate mb-1">{backendError.key}</code>
              <p className="text-orange-500 text-xs font-bold mb-4 tracking-tighter uppercase opacity-80">File: backend/.env</p>
              <div className="bg-[#111] p-5 rounded-2xl border-l-4 border-red-600">
                <p className="text-[#00ff00] text-sm leading-relaxed">{backendError.help || backendError.message}</p>
              </div>
            </div>
            <p className="text-slate-500 text-[10px] mt-10 animate-pulse text-center uppercase tracking-widest">Fix the variable and refresh browser</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-black overflow-x-hidden">
        <RootClientWrapper>
          {children}
        </RootClientWrapper>
      </body>
    </html>
  );
}
