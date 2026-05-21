"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef, useMemo } from "react";
import styles from "../page.module.css";

export default function Home() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

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
    await signIn("google", { callbackUrl: "/dashboard", redirect: true });
  };

  const AVATAR_COLORS = ["#6366f1", "#a855f7", "#06b6d4", "#f59e0b"];
  const AVATAR_LABELS = ["A", "B", "C", "D"];

  const PARTICLE_COLORS = [
    "rgba(99,102,241,0.9)",
    "rgba(168,85,247,0.9)",
    "rgba(6,182,212,0.9)",
  ];

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: 0.3 + Math.random() * 0.5,
        width: `${1 + Math.random() * 2}px`,
        height: `${1 + Math.random() * 2}px`,
        background: PARTICLE_COLORS[i % 3],
        animation: `float${(i % 3) + 1} ${10 + Math.random() * 14}s ease-in-out infinite`,
        animationDelay: `${Math.random() * -10}s`,
      })),
    [],
  );

  return (
    <div className={styles.scene} onMouseMove={handleMouseMove}>
      <div className={styles.grid} />
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />

      {mounted &&
        particles.map((particleStyle, i) => (
          <div key={i} className={styles.particle} style={particleStyle} />
        ))}

      <div
        ref={cardRef}
        className={styles.cardWrap}
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`${styles.card} ${mounted ? styles.mounted : ""}`}>
          <div className={styles.cardShine} />

          <div className={styles.logoRing}>
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

          <p className={styles.eyebrow}>Welcome back</p>
          <h1 className={styles.headline}>
            Sign in to
            <br />
            your workspace
          </h1>
          <p className={styles.sub}>
            Access all your tools and
            <br />
            projects in one place.
          </p>

          <button
            className={styles.btn}
            onMouseEnter={() => setHovered(true)}
            onClick={handleClick}
            disabled={clicked}
          >
            {clicked ? (
              <div className={styles.spinner} />
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

          <div className={styles.trust}>
            <div className={styles.avatars}>
              {AVATAR_COLORS.map((bg, i) => (
                <div key={i} className={styles.av} style={{ background: bg }}>
                  {AVATAR_LABELS[i]}
                </div>
              ))}
            </div>
            <div className={styles.stars}>
              {"★★★★★".split("").map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <span className={styles.trustText}>10k+ teams trust us</span>
          </div>
        </div>
      </div>
    </div>
  );
}
