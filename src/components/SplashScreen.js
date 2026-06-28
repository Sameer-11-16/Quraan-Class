'use client';

import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        perspective: '1000px',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotateX: 90, z: -500 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, z: 0 }}
        transition={{
          duration: 1.5,
          ease: [0.25, 0.1, 0.25, 1],
          type: 'spring',
          damping: 15,
          stiffness: 100,
        }}
        style={{
          textAlign: 'center',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.h1
          initial={{ textShadow: '0px 0px 0px rgba(16, 185, 129, 0)' }}
          animate={{ textShadow: '0px 10px 30px rgba(16, 185, 129, 0.6)' }}
          transition={{ duration: 1.5, delay: 0.5 }}
          style={{
            fontFamily: 'serif',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            color: '#ecfdf5',
            margin: 0,
            letterSpacing: '2px',
            fontWeight: 800,
            background: '-webkit-linear-gradient(45deg, #a7f3d0, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
          }}
        >
          Shajiya Naqeeb
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            marginTop: '15px',
            color: '#a7f3d0',
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Quraan Class
        </motion.div>
      </motion.div>
      
      {/* Decorative floating particles */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
