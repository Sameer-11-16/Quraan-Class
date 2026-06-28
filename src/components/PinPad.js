'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PinPad({ mode, onComplete, error }) {
  const [pin, setPin] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Trigger shake on error
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
        // Auto-submit after slight delay for visual feedback
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', width: '100%', maxWidth: '350px' }}
      >
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>
            {mode === 'setup' ? 'Set Application PIN' : 'Enter PIN to Unlock'}
          </h2>
          <p style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>
            {mode === 'setup' 
              ? 'Create a 4-digit security PIN for this app.' 
              : 'Please enter the 4-digit PIN.'}
          </p>
        </div>

        {/* PIN Dots */}
        <motion.div
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '40px',
            height: '24px', // Fixed height to prevent layout shift
          }}
        >
          {dots.map((i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: pin.length > i ? 1.2 : 1,
                backgroundColor: pin.length > i ? '#10b981' : 'transparent',
                borderColor: pin.length > i ? '#10b981' : '#a7f3d0'
              }}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: '2px solid',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </motion.div>

        {/* Error Message */}
        <div style={{ height: '24px', marginBottom: '20px', color: '#f87171', fontSize: '0.9rem', fontWeight: 500 }}>
          {error && error}
        </div>

        {/* Keypad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            justifyItems: 'center',
            padding: '0 20px',
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
                    fontSize: '1.2rem',
                    cursor: pin.length === 0 ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pin.length === 0 ? 0.3 : 1,
                  }}
                >
                  ⌫
                </button>
              );
            }

            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.9, backgroundColor: 'rgba(16, 185, 129, 0.4)' }}
                onClick={() => handleKeyPress(key.toString())}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                {key}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
