'use client';

export default function SplashScreen() {
  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.5) rotateX(90deg); }
          60% { opacity: 1; transform: scale(1.05) rotateX(-5deg); }
          100% { opacity: 1; transform: scale(1) rotateX(0deg); }
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 20px rgba(16, 185, 129, 0.4), 0 10px 30px rgba(16, 185, 129, 0.3); }
          50% { text-shadow: 0 0 40px rgba(16, 185, 129, 0.8), 0 10px 50px rgba(16, 185, 129, 0.6); }
        }

        @keyframes floatOrb {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(5deg); opacity: 0.5; }
        }

        .splash-name {
          animation: fadeInScale 1.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards,
                     glowPulse 3s ease-in-out 1.4s infinite;
          opacity: 0;
          perspective: 1000px;
          transform-style: preserve-3d;
          background: linear-gradient(45deg, #a7f3d0, #10b981, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .splash-subtitle {
          animation: fadeInUp 1s ease-out 1s forwards;
          opacity: 0;
        }

        .splash-orb {
          animation: floatOrb 4s ease-in-out infinite;
        }
      `}</style>

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
          overflow: 'hidden',
        }}
      >
        {/* Floating glow orb */}
        <div
          className="splash-orb"
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="splash-orb"
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(15px)',
            pointerEvents: 'none',
            animationDelay: '2s',
          }}
        />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1
            className="splash-name"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              margin: 0,
              letterSpacing: '2px',
              fontWeight: 800,
            }}
          >
            Shajiya Naqeeb
          </h1>

          <div
            className="splash-subtitle"
            style={{
              marginTop: '15px',
              color: '#a7f3d0',
              fontSize: 'clamp(1rem, 2vw, 1.4rem)',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              fontWeight: 400,
            }}
          >
            Quraan Class
          </div>
        </div>
      </div>
    </>
  );
}
