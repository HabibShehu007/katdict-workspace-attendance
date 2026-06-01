import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { LogIn, UserPlus, MapPin } from "lucide-react";

export default function Onboarding() {
  // Explicitly typing variants resolves the TypeScript compiler errors
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans">
      {/* 1. Static Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/KATDICT-2-scaled.jpg')" }}
      />

      {/* 2. Dark Overlay with Tailwind v4 Linear Syntax */}
      <div className="absolute inset-0 bg-linear-to-b from-zinc-950/85 via-zinc-900/90 to-zinc-950" />

      {/* 3. Foreground Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12 flex flex-col items-center text-center"
      >
        {/* Location Check Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium uppercase tracking-wider mb-6 backdrop-blur-md"
        >
          <MapPin className="w-3.5 h-3.5 text-green-500" />
          KATDICT Geofence Active
        </motion.div>

        {/* Branding & Typography */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none"
        >
          KATDICT <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500">
            Attendance Portal
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-base sm:text-lg text-zinc-300 max-w-md font-normal leading-relaxed"
        >
          Verify your device location to clock in, keep track of your daily
          shifts, and view workspace stats. Make sure you are within the hub
          premises to gain entry.
        </motion.p>

        {/* Action Row - Clean layout maintaining horizontal alignment on all device sizes */}
        <motion.div
          variants={itemVariants}
          className="mt-10 w-full flex flex-row items-center justify-center gap-3 sm:gap-4 max-w-md"
        >
          {/* Register Button */}
          <button className="group flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold text-sm sm:text-base py-3.5 px-4 sm:px-6 rounded-xl transition-all active:scale-98 shadow-md">
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-105" />
            <span>Join Now</span>
          </button>

          {/* Login Button */}
          <button className="group flex-1 flex items-center justify-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 font-semibold text-sm sm:text-base py-3.5 px-4 sm:px-6 rounded-xl border border-zinc-800 backdrop-blur-md transition-all active:scale-98">
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
            <span>Sign In</span>
          </button>
        </motion.div>

        {/* Verification Alert Footer */}
        <motion.p
          variants={itemVariants}
          className="mt-12 text-xs text-zinc-500 font-medium tracking-wide"
        >
          Requires device location access for checking in
        </motion.p>
      </motion.div>
    </div>
  );
}
