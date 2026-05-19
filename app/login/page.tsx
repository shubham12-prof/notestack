"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-purple-500/30 rounded-full blur-3xl animate-pulse" />

        <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <motion.div
        initial={{ opacity: 0, y: 60, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 group"
      >
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur opacity-70 group-hover:opacity-100 transition duration-500" />

        <div className="relative w-[380px] backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-2xl rotate-6 hover:rotate-0 transition duration-500">
              <span className="text-3xl font-bold text-white">N</span>
            </div>
          </motion.div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>

            <p className="text-gray-300 text-sm">
              Sign in to continue your dashboard experience
            </p>
          </div>

          <motion.button
            whileHover={{
              scale: 1.04,
              rotateX: 6,
              rotateY: -6,
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full relative overflow-hidden bg-white text-black font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/30"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 hover:opacity-20 transition duration-500" />

            <FcGoogle className="text-2xl relative z-10" />

            <span className="relative z-10">Continue with Google</span>
          </motion.button>

          <p className="text-center text-gray-400 text-xs mt-6">
            Secure authentication powered by Google
          </p>
        </div>
      </motion.div>
    </div>
  );
}
