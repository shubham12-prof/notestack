"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Login
      </button>
    </div>
  );
}
