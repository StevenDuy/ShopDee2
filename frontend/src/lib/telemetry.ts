/**
 * SHOPDEE2 AI TELEMETRY CLIENT
 * Captures behavioral metadata and GPS for research purposes.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface TelemetryData {
  type: string;
  payload?: any;
  lat?: number;
  lng?: number;
  userId?: number | null;
}

export const sendTelemetry = async (data: TelemetryData) => {
  try {
    const accepted = localStorage.getItem('ai_research_accepted');
    if (accepted !== 'true') return; // Do not send if no consent

    const response = await fetch(`${API_URL}/action-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: data.userId || null,
        type: data.type,
        payload: {
          ...data.payload,
          userAgent: navigator.userAgent,
          screen: `${window.screen.width}x${window.screen.height}`,
          referrer: document.referrer
        },
        lat: data.lat,
        lng: data.lng
      })
    });

    if (!response.ok) {
       // Log to console in dev mode
       if (process.env.NODE_ENV === 'development') {
         console.warn("[Telemetry] Upload failed:", response.status);
       }
    }
  } catch (err) {
    // Fail silently in research node unless debugging
  }
};
