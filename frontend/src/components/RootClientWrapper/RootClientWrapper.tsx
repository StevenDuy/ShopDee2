'use client';

import React, { useState, useEffect } from 'react';
import { sendTelemetry } from '@/lib/telemetry';

/**
 * FINAL AI SANDBOX CONTROL NODE
 * Injected with:
 * 1. Vanilla JS Bypass for slow Tunnels.
 * 2. Auto-GPS Sync (every 60s).
 * 3. Visibility/Focus Tracking for Behavioral AI.
 */
export default function RootClientWrapper({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Initial Access Check
    if (localStorage.getItem('ai_research_accepted') === 'true') {
      setAuthorized(true);
      
      // 2. Start AI Behavioral Telemetry (Focus Tracking)
      const handleVisibility = () => {
        sendTelemetry({ 
          type: 'VISIBILITY_CHANGE', 
          payload: { state: document.visibilityState } 
        });
      };
      document.addEventListener('visibilitychange', handleVisibility);

      // 3. Start Periodic GPS Sync (Every 60s)
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

      // Log initial session start
      sendTelemetry({ type: 'SESSION_START' });

      return () => {
        document.removeEventListener('visibilitychange', handleVisibility);
        clearInterval(gpsInterval);
      };
    }
  }, [authorized]);

  return (
    <>
      <div id="v-auth-gate-root" style={{
        position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#050505',
        alignItems: 'center', justifyContent: 'center', padding: '20px',
        display: authorized ? 'none' : 'flex'
      }}>
        <div style={{
          backgroundColor: 'white', color: 'black', width: '100%', maxWidth: '400px',
          borderRadius: '32px', padding: '40px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          fontFamily: '-apple-system, system-ui, sans-serif'
        }}>
          <div id="v-icon" style={{ fontSize: '40px', marginBottom: '20px' }}>🛡️</div>
          <h2 id="v-title" style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Protocol Entry</h2>
          <p style={{ color: '#86868B', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '30px' }}>ShopDee2 AI Research Node</p>

          <div id="v-content" style={{ textAlign: 'left', marginBottom: '30px', fontSize: '14px', lineHeight: 1.6 }}>By entering, you consent to <b>AI Behavioral Monitoring</b>. Interactions are logged for research.</div>

          <div id="v-checkbox-area" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', backgroundColor: '#F5F5F7', padding: '15px', borderRadius: '16px', cursor: 'pointer' }}>
             <input type="checkbox" id="v-terms-check" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
             <label htmlFor="v-terms-check" style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>I accept the research terms</label>
          </div>

          <button id="v-action-btn" style={{
            width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
            backgroundColor: '#000', color: '#fff', fontWeight: 700, fontSize: '16px', cursor: 'pointer'
          }}>Confirm & Proceed</button>
          <div id="v-error" style={{ color: '#ff3b30', fontSize: '12px', marginTop: '15px', fontWeight: 600, display: 'none' }}></div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const gate = document.getElementById('v-auth-gate-root');
          const main = document.getElementById('v-main-content');
          function unlock() {
             if (gate) gate.style.display = 'none';
             if (main) main.style.display = 'block';
          }
          if (localStorage.getItem('ai_research_accepted') === 'true') {
             unlock(); return;
          }
          const btn = document.getElementById('v-action-btn');
          const check = document.getElementById('v-terms-check');
          const errBox = document.getElementById('v-error');
          const title = document.getElementById('v-title');
          const content = document.getElementById('v-content');
          const icon = document.getElementById('v-icon');
          const checkArea = document.getElementById('v-checkbox-area');
          if (!btn || !check) return;
          let step = 1;
          btn.onclick = function() {
            if (step === 1) {
              if (!check.checked) return alert("Please accept the terms.");
              step = 2;
              title.innerText = "GPS Required";
              icon.innerText = "📍";
              content.innerText = "Synchronizing logistics telemetry requires GPS signal.";
              checkArea.style.display = "none";
              btn.innerText = "Sync GPS Signal";
            } else if (step === 2) {
              if (!navigator.geolocation) return;
              navigator.geolocation.getCurrentPosition(
                function() {
                  localStorage.setItem('ai_research_accepted', 'true');
                  unlock();
                  window.location.reload();
                },
                function() { alert("Location access is mandatory."); },
                { enableHighAccuracy: true }
              );
            }
          };
        })();
      ` }} />

      <div id="v-main-content" style={{ display: (authorized ? 'block' : 'none') }}>
        {children}
      </div>
    </>
  );
}
