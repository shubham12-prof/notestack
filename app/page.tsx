"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -12, y: dx * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const handleClick = async () => {
    setClicked(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #050510;
          overflow: hidden;
        }

        .scene {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
          position: relative;
          background: radial-gradient(ellipse 80% 60% at 50% 40%, #0d0d2e 0%, #050510 70%);
          overflow: hidden;
        }

        /* Animated grid */
        .grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%);
          animation: gridDrift 20s linear infinite;
        }

        @keyframes gridDrift {
          from { transform: translateY(0); }
          to   { transform: translateY(60px); }
        }

        /* Floating orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
          pointer-events: none;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #6366f1, transparent 70%);
          top: -120px; left: -100px;
          animation: float1 14s ease-in-out infinite;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #a855f7, transparent 70%);
          bottom: -80px; right: -60px;
          animation: float2 18s ease-in-out infinite;
        }
        .orb-3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, #06b6d4, transparent 70%);
          top: 50%; left: 55%;
          animation: float3 12s ease-in-out infinite;
        }

        @keyframes float1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(60px, 40px) scale(1.08); }
          66%      { transform: translate(-30px, 80px) scale(0.95); }
        }
        @keyframes float2 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(-80px, -60px); }
        }
        @keyframes float3 {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.3); }
        }

        /* Particles */
        .particle {
          position: absolute;
          width: 2px; height: 2px;
          border-radius: 50%;
          background: rgba(99,102,241,0.8);
          pointer-events: none;
        }

        /* Card */
        .card-wrap {
          transform-style: preserve-3d;
          transition: transform 0.12s ease-out;
          cursor: pointer;
        }

        .card {
          position: relative;
          width: 380px;
          padding: 52px 44px 44px;
          border-radius: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.15),
            0 40px 80px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.08);
          transform-style: preserve-3d;
          opacity: 0;
          transform: translateY(40px) scale(0.95);
          transition:
            opacity 0.7s cubic-bezier(0.16,1,0.3,1),
            transform 0.7s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.3s ease;
        }

        .card.mounted {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .card:hover {
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.4),
            0 60px 100px rgba(0,0,0,0.7),
            0 0 60px rgba(99,102,241,0.12),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }

        /* Shimmer border */
        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg,
            rgba(99,102,241,0.5) 0%,
            transparent 40%,
            transparent 60%,
            rgba(168,85,247,0.5) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .card:hover::before { opacity: 1; }

        /* Shine layer */
        .card-shine {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: radial-gradient(
            ellipse 80px 60px at var(--mx, 50%) var(--my, 50%),
            rgba(255,255,255,0.06),
            transparent 70%
          );
          pointer-events: none;
          transition: opacity 0.3s;
          opacity: 0;
        }
        .card:hover .card-shine { opacity: 1; }

        /* Logo area */
        .logo-ring {
          width: 64px; height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          box-shadow: 0 8px 32px rgba(99,102,241,0.4);
          position: relative;
          animation: logoPulse 3s ease-in-out infinite;
          transform: translateZ(20px);
        }

        @keyframes logoPulse {
          0%,100% { box-shadow: 0 8px 32px rgba(99,102,241,0.4); }
          50%      { box-shadow: 0 8px 48px rgba(99,102,241,0.7), 0 0 20px rgba(168,85,247,0.3); }
        }

        .logo-ring svg {
          width: 28px; height: 28px;
          color: white;
        }

        /* Text */
        .eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(99,102,241,0.8);
          margin-bottom: 8px;
          transform: translateZ(8px);
        }

        .headline {
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 8px;
          transform: translateZ(10px);
        }

        .sub {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          margin-bottom: 36px;
          transform: translateZ(8px);
        }

        /* Button */
        .btn {
          position: relative;
          width: 100%;
          padding: 15px 0;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          box-shadow: 0 4px 24px rgba(99,102,241,0.4), 0 1px 0 rgba(255,255,255,0.12) inset;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s;
          transform: translateZ(20px);
        }

        .btn:hover {
          transform: translateY(-2px) translateZ(20px);
          box-shadow: 0 8px 36px rgba(99,102,241,0.55), 0 1px 0 rgba(255,255,255,0.15) inset;
        }

        .btn:active {
          transform: translateY(0) translateZ(20px) scale(0.98);
        }

        /* Button sweep */
        .btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg,
            transparent 40%,
            rgba(255,255,255,0.18) 50%,
            transparent 60%
          );
          transform: translateX(-100%);
          transition: transform 0.5s;
        }

        .btn:hover::after {
          transform: translateX(100%);
        }

        /* Loading spinner */
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Social proof */
        .trust {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transform: translateZ(6px);
        }

        .avatars {
          display: flex;
        }

        .av {
          width: 24px; height: 24px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.08);
          margin-left: -6px;
          font-size: 10px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .av:first-child { margin-left: 0; }

        .trust-text {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }

        /* Stars */
        .stars {
          display: flex;
          gap: 1px;
          color: #fbbf24;
          font-size: 11px;
        }
      `}</style>

      <div className="scene" onMouseMove={handleMouseMove}>
        <div className="grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.5,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background:
                i % 3 === 0
                  ? "rgba(99,102,241,0.9)"
                  : i % 3 === 1
                    ? "rgba(168,85,247,0.9)"
                    : "rgba(6,182,212,0.9)",
              animation: `float${(i % 3) + 1} ${10 + Math.random() * 14}s ease-in-out infinite`,
              animationDelay: `${Math.random() * -10}s`,
            }}
          />
        ))}

        <div
          ref={cardRef}
          className="card-wrap"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`card ${mounted ? "mounted" : ""}`}>
            <div className="card-shine" />

            <div className="logo-ring">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>

            <p className="eyebrow">Welcome back</p>
            <h1 className="headline">
              Sign in to
              <br />
              your workspace
            </h1>
            <p className="sub">
              Access all your tools and
              <br />
              projects in one place.
            </p>

            <button
              className="btn"
              onMouseEnter={() => setHovered(true)}
              onClick={handleClick}
              disabled={clicked}
            >
              {clicked ? (
                <div className="spinner" />
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div className="trust">
              <div className="avatars">
                {["#6366f1", "#a855f7", "#06b6d4", "#f59e0b"].map((bg, i) => (
                  <div key={i} className="av" style={{ background: bg }}>
                    {["A", "B", "C", "D"][i]}
                  </div>
                ))}
              </div>
              <div className="stars">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <span className="trust-text">10k+ teams trust us</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
