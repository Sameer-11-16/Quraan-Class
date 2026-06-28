'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import PinPad from './PinPad';

export default function AuthWrapper({ children }) {
  // States: 'splash' -> 'checking' -> 'setup_pin' -> 'enter_pin' -> 'unlocked'
  const [appState, setAppState] = useState('splash');
  const [pinError, setPinError] = useState('');

  // 1. Show splash screen for 3 seconds, then move to checking state
  useEffect(() => {
    if (appState === 'splash') {
      const timer = setTimeout(() => setAppState('checking'), 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // 2. Once in 'checking' state, verify if PIN exists and if session is unlocked
  useEffect(() => {
    if (appState === 'checking') {
      const checkAuth = async () => {
        try {
          // Check if already unlocked in this session
          if (sessionStorage.getItem('app_unlocked') === 'true') {
            setAppState('unlocked');
            return;
          }

          const res = await fetch('/api/auth');
          const data = await res.json();

          if (data.isPinSet) {
            setAppState('enter_pin');
          } else {
            setAppState('setup_pin');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          setAppState('enter_pin'); // Fallback to asking for PIN
        }
      };
      checkAuth();
    }
  }, [appState]);

  const handlePinSubmit = async (pin) => {
    setPinError('');
    try {
      const action = appState === 'setup_pin' ? 'setup' : 'verify';
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, pin }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        sessionStorage.setItem('app_unlocked', 'true');
        setAppState('unlocked');
      } else {
        setPinError(data.error || 'Incorrect PIN');
      }
    } catch (error) {
      setPinError('Failed to verify PIN. Please try again.');
    }
  };

  if (appState === 'splash') {
    return <SplashScreen />;
  }

  if (appState === 'setup_pin') {
    return <PinPad mode="setup" onComplete={handlePinSubmit} error={pinError} />;
  }

  if (appState === 'enter_pin') {
    return <PinPad mode="verify" onComplete={handlePinSubmit} error={pinError} />;
  }

  // Show nothing while checking DB
  if (appState === 'checking') {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#022c22', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#a7f3d0', fontFamily: 'monospace' }}>Checking secure connection...</div>
      </div>
    );
  }

  // Unlocked! Render the app.
  return <>{children}</>;
}
