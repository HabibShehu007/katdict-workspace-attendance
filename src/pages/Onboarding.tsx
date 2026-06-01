import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { LogIn, UserPlus, MapPin } from "lucide-react";

export default function Onboarding() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 22,
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-start overflow-hidden font-sans">
      {/* 1. Static Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/KATDICT-2-scaled.jpg')" }}
      />

      {/* 2. Soft, Organic Dark Overlay (Deep charcoal transition for clear text readability) */}
      <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/85 to-zinc-900/40 max-md:bg-linear-to-b max-md:from-zinc-950/90 max-md:to-zinc-900/70" />

      {/* 3. Left-Aligned Foreground Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl px-6 sm:px-12 md:px-20 py-16 flex flex-col items-start text-left"
      >
        {/* Humanized Location Status Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-md"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          Inside KATDICT Workspace
        </motion.div>

        {/* Branding & Typography */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none space-y-2"
        >
          <span>KATDICT Workspace</span>
          <br />
          <span className="text-emerald-500 block mt-2">Attendance System</span>
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
          className="mt-10 w-full flex flex-row items-center gap-3 sm:gap-4 max-w-sm"
        >
          {/* Join Now / Register Button (Solid Organic Emerald Green) */}
          <button className="group flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base py-3.5 px-4 rounded-xl transition-all active:scale-98 shadow-md shadow-emerald-950/20">
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Join Now</span>
          </button>

          {/* Sign In / Login Button */}
          <button className="group flex-1 flex items-center justify-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 font-semibold text-sm sm:text-base py-3.5 px-4 rounded-xl border border-zinc-800/80 backdrop-blur-md transition-all active:scale-98">
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
            <span>Sign In</span>
          </button>
        </motion.div>

        {/* Verification Alert Footer */}
        <motion.p
          variants={itemVariants}
          className="mt-12 text-xs text-zinc-500 font-medium tracking-wide"
        >
          Device location verification required for login.
        </motion.p>
      </motion.div>
    </div>
  );
}
