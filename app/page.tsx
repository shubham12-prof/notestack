"use client";

import { signIn } from "next-auth/react";
import { LogIn, Zap } from "lucide-react";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
        padding: 24,
      }}
    >
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--accent)",
          border: "none",
          borderRadius: 8,
          color: "white",
          cursor: "pointer",
          fontFamily: "var(--font-display)",
          fontSize: 15,
          fontWeight: 700,
          padding: "13px 22px",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <Zap size={18} />
        Login
        <LogIn size={17} />
      </button>
    </main>
  );
}
