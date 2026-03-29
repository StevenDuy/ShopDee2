'use client';

import React, { useState, useEffect } from 'react';
import { sendTelemetry } from '@/lib/telemetry';
import { Toaster } from 'react-hot-toast';

type Step = 'terms' | 'gps' | 'authorized';

export default function RootClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<Step>('authorized'); // Default to authorized for SSR
  const [gpsError, setGpsError] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const accepted = localStorage.getItem('ai_research_accepted');
    if (accepted !== 'true') {
      setStep('gps');
    }
  }, []);

  // Telemetry logic
  useEffect(() => {
    if (step !== 'authorized' || !isMounted) return;

    const handleVisibility = () => {
      sendTelemetry({ type: 'VISIBILITY_CHANGE', payload: { state: document.visibilityState } });
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const gpsInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          sendTelemetry({
            type: 'GPS_TICK',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            payload: { speed: pos.coords.speed, accuracy: pos.coords.accuracy }
          });
        });
      }
    }, 60000);

    sendTelemetry({ type: 'SESSION_START' });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(gpsInterval);
    };
  }, [step, isMounted]);

  const handleSyncGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      () => {
        localStorage.setItem('ai_research_accepted', 'true');
        setStep('authorized');
      },
      () => {
        setGpsError('Location access is mandatory to proceed.');
      },
      { enableHighAccuracy: true }
    );
  };

  // HYDRATION SAFETY: 
  // We always render local structure to match server, but hide overlay/content based on mount status.
  const showOverlay = isMounted && step !== 'authorized';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
      {/* 🚀 Auth Gate Overlay (Only rendered on client after mount check) */}
      {showOverlay && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          width: '100%', height: '100%', 
          backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          zIndex: 99999, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff', color: '#000000', width: '100%', maxWidth: '360px', 
            borderRadius: '40px', padding: '40px', textAlign: 'center', 
            boxShadow: '0 25px 80px -20px rgba(0, 0, 0, 0.8)',
            fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📍</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#000' }}>Permission Node</h2>
            <p style={{ color: '#86868B', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '30px' }}>
              ShopDee2 AI Logistics Research
            </p>
            <div style={{ textAlign: 'left', marginBottom: '30px', fontSize: '14px', lineHeight: 1.6, color: '#444' }}>
              Synchronizing telemetry requires an active GPS signal to proceed with research.
            </div>
            {gpsError && (
              <p style={{ color: '#ff3b30', fontSize: '12px', marginBottom: '15px', fontWeight: 700 }}>{gpsError}</p>
            )}
            <button
              onClick={handleSyncGps}
              style={{ 
                width: '100%', padding: '20px', borderRadius: '24px', border: 'none', 
                backgroundColor: '#000', color: '#fff', fontWeight: 800, fontSize: '16px', 
                cursor: 'pointer'
              }}
            >
              Sync GPS Signal
            </button>
          </div>
        </div>
      )}

      {/* 🏠 Main App Content (Always present in DOM to prevent hydration mismatch) */}
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#000',
        opacity: isMounted ? 1 : 0, // Subtle fade-in to prevent flash
        transition: 'opacity 0.3s ease'
      }}>
        {children}
        <Toaster position="bottom-center" toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid #333',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }
        }} />
      </div>
    </div>
  );
}
