'use client';

import React, { useState } from 'react';
import styles from './PermissionModal.module.css';

export default function PermissionModal() {
  const [step, setStep] = useState(1); 
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = () => {
    if (!acceptedTerms) return;
    setStep(2);
  };

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setError("Browser geolocation service unavailable. System access denied.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem('ai_research_accepted', 'true');
        setStep(3);
        setTimeout(() => {
          window.location.reload(); 
        }, 800);
      },
      (err) => {
        setError("Location access is mandatory for real-time telemetry. Connection terminated.");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className={styles.headerIcon}>
             <span className={styles.emoji}>{step === 1 ? "🛡️" : step === 2 ? "📍" : "✅"}</span>
          </div>
          <h1 className={styles.title}>
            {step === 1 && "Protocol Entry"}
            {step === 2 && "Positioning Required"}
            {step === 3 && "Access Granted"}
          </h1>
          <p className={styles.subtitle}>
            ShopDee2 AI Sandbox
          </p>
        </div>

        {/* Content Section */}
        <div className={styles.contentContainer}>
          {step === 1 && (
            <>
              <div className={styles.infoItem}>
                <div className={styles.dotContainer}>
                  <div className={styles.dot}></div>
                </div>
                <p className={styles.infoText}>
                  This is an <span className={styles.linkStyle}>Experimental Project Platform</span>. By accessing the system, you give explicit consent to participate in AI-driven behavioral and logistics research.
                </p>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.dotContainer}>
                  <div className={styles.dot}></div>
                </div>
                <p className={styles.infoText}>
                   All metadata, transactions, and interactions will be analyzed for <span className={styles.linkStyle}>Fraud Detection</span> and kept confidential.
                </p>
              </div>

              {/* Professional Checkbox */}
              <label className={styles.checkboxContainer}>
                <div className={styles.checkboxWrapper}>
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className={styles.hiddenCheckbox} 
                  />
                  {acceptedTerms && (
                    <svg className={styles.checkIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={styles.checkboxLabel}>
                  I agree to the research terms and privacy protocol
                </span>
              </label>
            </>
          )}

          {step === 2 && (
            <div className={styles.alertBox}>
              <p className={styles.alertText}>
                Logistics telemetry requires high-precision geolocation. Please confirm the browser request to synchronize your real-time position with the research node.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className={styles.successBox}>
              <span className="text-3xl mb-2">🚀</span>
              <p className="font-semibold text-black">Synchronization Complete</p>
              <p className="text-[#3A835B] text-xs mt-1">Initializing sandbox environment...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorBox}>
              {error}
            </div>
          )}
        </div>

        {/* Action Button Section */}
        <div className="w-full">
          {step === 1 && (
            <button 
              disabled={!acceptedTerms}
              onClick={handleNextStep}
              className={`${styles.actionButton} ${acceptedTerms ? styles.buttonPrimary : styles.buttonDisabled}`}
            >
              Confirm and Proceed
            </button>
          )}
          {step === 2 && (
            <button 
              onClick={handleRequestLocation}
              className={`${styles.actionButton} ${styles.buttonGps}`}
            >
              Access GPS Telemetry
            </button>
          )}
          
          <div className={styles.disclaimer}>
             <p className={styles.disclaimerText}>
               Access rejection will terminate the active session.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
