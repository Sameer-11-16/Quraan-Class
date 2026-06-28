'use client';

import { useState, useEffect } from 'react';

export default function PinPad({ mode, onComplete, error }) {
  const [pin, setPin] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (error) {
      setIsShaking(true);
      setPin('');
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => onComplete(newPin), 300);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const dots = [0, 1, 2, 3];
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'delete'];

  return (
    <>
      <style>{`
        @keyframes pinFadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pinShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        @keyframes dotPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1.2); }
        }
        .pin-container {
          animation: pinFadeIn 0.5s ease-out forwards;
        }
        .pin-dots {
          animation: ${isShaking ? 'pinShake 0.5s ease-in-out' : 'none'};
        }
        .pin-key {
          transition: transform 0.1s ease, background-color 0.1s ease;
        }
        .pin-key:active {
          transform: scale(0.88);
          background-color: rgba(16, 185, 129, 0.4) !important;
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(to bottom, #022c22, #064e3b)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ecfdf5',
          zIndex: 9998,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div className="pin-container" style={{ textAlign: 'center', width: '100%', maxWidth: '350px', padding: '0 20px' }}>
          
          {/* Title */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔐</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '8px', margin: '0 0 8px 0' }}>
              {mode === 'setup' ? 'Set Security PIN' : 'Enter PIN to Unlock'}
            </h2>
            <p style={{ color: '#a7f3d0', fontSize: '0.9rem', margin: 0 }}>
              {mode === 'setup'
                ? 'Create a 4-digit PIN to secure the app.'
                : 'Enter your 4-digit PIN to continue.'}
            </p>
          </div>

          {/* PIN Dots */}
          <div
            className="pin-dots"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '16px',
            }}
          >
            {dots.map((i) => (
              <div
                key={i}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: pin.length > i ? '#10b981' : '#a7f3d0',
                  backgroundColor: pin.length > i ? '#10b981' : 'transparent',
                  transform: pin.length > i ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  boxShadow: pin.length > i ? '0 0 8px rgba(16,185,129,0.6)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Error */}
          <div style={{ height: '24px', marginBottom: '24px', color: '#f87171', fontSize: '0.9rem', fontWeight: 500 }}>
            {error && error}
          </div>

          {/* Keypad */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              justifyItems: 'center',
            }}
          >
            {keys.map((key, idx) => {
              if (key === null) return <div key={`empty-${idx}`} />;

              if (key === 'delete') {
                return (
                  <button
                    key="delete"
                    onClick={handleDelete}
                    disabled={pin.length === 0}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'transparent',
                      border: 'none',
                      color: '#ecfdf5',
                      fontSize: '1.3rem',
                      cursor: pin.length === 0 ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pin.length === 0 ? 0.3 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    ⌫
                  </button>
                );
              }

              return (
                <button
                  key={key}
                  className="pin-key"
                  onClick={() => handleKeyPress(key.toString())}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '1.6rem',
                    fontWeight: 300,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
