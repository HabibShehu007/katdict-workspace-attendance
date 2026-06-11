import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { LogIn, UserPlus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-start overflow-hidden font-sans">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/KATDICT-2-scaled.jpg')" }}
      />

      <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/80 to-transparent max-md:bg-linear-to-b max-md:from-zinc-950/90 max-md:to-zinc-900/60" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl px-6 sm:px-12 md:px-24 py-16 flex flex-col items-start text-left"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm"
        >
          <MapPin className="w-3 h-3" />
          Location-Awareness Required
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            KATDICT <span className="font-light text-zinc-400">Workspace</span>
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-emerald-500 tracking-tight leading-none">
            Your Daily Hub
          </h2>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-8 text-base sm:text-lg text-zinc-400 max-w-md font-normal leading-relaxed"
        >
          The place where we get things done. Use this space to track your
          active projects, log your daily progress, and stay in sync with other
          professionals.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-12 w-full flex flex-row items-center gap-4 max-w-xs"
        >
          <button
            onClick={() => navigate("/signup")}
            className="group flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-4 px-4 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join Now</span>
          </button>

          <button
            onClick={() => navigate("/login")}
            className="group flex-1 flex items-center justify-center gap-2 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 font-bold text-sm py-4 px-4 rounded-xl border border-zinc-800/50 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-16 text-[10px] text-zinc-600 font-bold uppercase tracking-widest"
        >
          Note: Attendance features require you to be at the office.
        </motion.p>
      </motion.div>
    </div>
  );
}
