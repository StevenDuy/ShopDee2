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

  // Start telemetry after authorized
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

  // Tránh hydration mismatch: trước khi mount, server & client đồng nhất ẩn overlay
  const showOverlay = !isMounted || step !== 'authorized';

  return (
    <>
      {/* Auth Gate Overlay */}
      {showOverlay && (
        <div suppressHydrationWarning style={{
          position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#050505',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'white', color: 'black', width: '100%', maxWidth: '400px',
            borderRadius: '32px', padding: '40px', textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            fontFamily: '-apple-system, system-ui, sans-serif'
          }}>
            {step === 'terms' && (
              <>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>🛡️</div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Protocol Entry</h2>
                <p style={{ color: '#86868B', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '30px' }}>
                  ShopDee2 AI Research Node
                </p>
                <div style={{ textAlign: 'left', marginBottom: '30px', fontSize: '14px', lineHeight: 1.6 }}>
                  By entering, you consent to <b>AI Behavioral Monitoring</b>. Interactions are logged for research.
                </div>
                <div
                  onClick={() => setTermsChecked(!termsChecked)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', backgroundColor: '#F5F5F7', padding: '15px', borderRadius: '16px', cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <label style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>I accept the research terms</label>
                </div>
                <button
                  onClick={handleConfirmTerms}
                  style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#000', color: '#fff', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}
                >
                  Confirm &amp; Proceed
                </button>
              </>
            )}

            {step === 'gps' && (
              <>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>📍</div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>GPS Required</h2>
                <p style={{ color: '#86868B', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '30px' }}>
                  ShopDee2 AI Research Node
                </p>
                <div style={{ textAlign: 'left', marginBottom: '30px', fontSize: '14px', lineHeight: 1.6 }}>
                  Synchronizing logistics telemetry requires GPS signal.
                </div>
                {gpsError && (
                  <p style={{ color: '#ff3b30', fontSize: '12px', marginBottom: '15px', fontWeight: 600 }}>{gpsError}</p>
                )}
                <button
                  onClick={handleSyncGps}
                  style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#000', color: '#fff', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}
                >
                  Sync GPS Signal
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: (isMounted && step === 'authorized') ? 'block' : 'none' }}>
        {children}
      </div>
    </>
  );
}
