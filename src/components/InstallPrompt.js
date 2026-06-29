'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running as installed standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    // Listen for Android / Chrome / Edge install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If on iOS and not standalone, show prompt after a short delay
    if (iosDevice && !window.navigator.standalone) {
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="install-banner-overlay">
      <div className="install-banner-card">
        <div className="install-banner-content">
          <div className="install-banner-icon">📱</div>
          <div className="install-banner-text">
            <h4>Install Quraan Class App</h4>
            <p>
              {isIos
                ? "Tap Share ⎋ below and select 'Add to Home Screen' ➕ for quick offline access!"
                : "Install on your home screen for quick access, full-screen experience, and fast loading!"}
            </p>
          </div>
        </div>

        <div className="install-banner-actions">
          <button className="btn btn-sm btn-secondary" onClick={handleDismiss}>
            Later
          </button>
          {!isIos && deferredPrompt && (
            <button className="btn btn-sm btn-gold" onClick={handleInstallClick}>
              📲 Install Now
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .install-banner-overlay {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99999;
          width: 90%;
          max-width: 480px;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .install-banner-card {
          background: linear-gradient(135deg, #022c22 0%, #064e3b 100%);
          color: #ffffff;
          padding: 16px 20px;
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(52, 211, 153, 0.3);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .install-banner-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .install-banner-icon {
          font-size: 2.2rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .install-banner-text h4 {
          margin: 0 0 2px 0;
          font-size: 0.98rem;
          font-weight: 700;
          color: #a7f3d0;
        }

        .install-banner-text p {
          margin: 0;
          font-size: 0.8rem;
          opacity: 0.9;
          line-height: 1.35;
        }

        .install-banner-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        @keyframes slideUp {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
