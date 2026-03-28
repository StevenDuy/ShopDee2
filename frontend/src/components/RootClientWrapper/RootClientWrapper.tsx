'use client';

import React, { useState, useEffect } from 'react';
import { sendTelemetry } from '@/lib/telemetry';

type Step = 'terms' | 'gps' | 'authorized';

export default function RootClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<Step>('terms');
  const [termsChecked, setTermsChecked] = useState(false);
  const [gpsError, setGpsError] = useState('');

  useEffect(() => {
    setIsMounted(true);
    if (localStorage.getItem('ai_research_accepted') === 'true') {
      setStep('authorized');
    }
  }, []);

  // Telemetry logic
  useEffect(() => {
    if (step !== 'authorized') return;

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
  }, [step]);

  const handleConfirmTerms = () => {
    if (!termsChecked) {
      alert('Please accept the terms first.');
      return;
    }
    setStep('gps');
  };

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
  // Initial state (both Server and first Client render) should be Overlay visible, Main Hidden.
  const showOverlay = !isMounted || step !== 'authorized';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000' }}>
      {/* 🚀 Auth Gate Overlay (Always use Inline Styles for UI consistency) */}
      {showOverlay && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          width: '100vw', height: '100vh', 
          backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          zIndex: 99999, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff', color: '#000000', width: '100%', maxWidth: '400px', 
            borderRadius: '32px', padding: '40px', textAlign: 'center', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {step === 'terms' && (
              <>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛡️</div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#000' }}>Protocol Entry</h2>
                <p style={{ color: '#86868B', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '30px' }}>
                  ShopDee2 AI Research Node
                </p>
                <div style={{ textAlign: 'left', marginBottom: '30px', fontSize: '14px', lineHeight: 1.6, color: '#333' }}>
                  By entering, you consent to <b style={{ color: '#000' }}>AI Behavioral Monitoring</b>. Interactions are logged for research purposes.
                </div>
                <div
                  onClick={() => setTermsChecked(!termsChecked)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', 
                    backgroundColor: '#F5F5F7', padding: '16px', borderRadius: '16px', cursor: 'pointer' 
                  }}
                >
                  <input
                    type="checkbox"
                    id="v-terms-check"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#000' }}
                  />
                  <label htmlFor="v-terms-check" style={{ fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#000' }}>
                    I accept the research terms
                  </label>
                </div>
                <button
                  onClick={handleConfirmTerms}
                  style={{ 
                    width: '100%', padding: '18px', borderRadius: '18px', border: 'none', 
                    backgroundColor: '#000', color: '#fff', fontWeight: 700, fontSize: '16px', 
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  Confirm & Proceed
                </button>
              </>
            )}

            {step === 'gps' && (
              <>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📍</div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#000' }}>GPS Required</h2>
                <p style={{ color: '#86868B', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '30px' }}>
                  ShopDee2 AI Research Node
                </p>
                <div style={{ textAlign: 'left', marginBottom: '30px', fontSize: '14px', lineHeight: 1.6, color: '#333' }}>
                   Synchronizing telemetry requires an active GPS signal.
                </div>
                {gpsError && (
                  <p style={{ color: '#ff3b30', fontSize: '12px', marginBottom: '15px', fontWeight: 700 }}>{gpsError}</p>
                )}
                <button
                  onClick={handleSyncGps}
                  style={{ 
                    width: '100%', padding: '18px', borderRadius: '18px', border: 'none', 
                    backgroundColor: '#000', color: '#fff', fontWeight: 700, fontSize: '16px', 
                    cursor: 'pointer'
                  }}
                >
                  Sync GPS Signal
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🏠 Main App Content (Hidden until authorized) */}
      <div style={{ 
        display: (isMounted && step === 'authorized') ? 'block' : 'none',
        minHeight: '100vh',
        backgroundColor: '#000'
      }}>
        {children}
      </div>
    </div>
  );
}
