import { motion } from "framer-motion";

interface GaugeProps {
  value: number | null;
  isLocked: boolean;
}

export function PerformanceGauge({ value, isLocked }: GaugeProps) {
  const percentage = value ?? 0;

  // Now being used to color the percentage text dynamically
  const getColor = (v: number) => {
    if (v < 40) return "text-rose-500";
    if (v < 75) return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <div className="p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm flex flex-col items-center">
      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
        Performance Grade
      </h3>

      <div className="relative w-48 h-24 overflow-hidden">
        {/* The Track */}
        <div
          className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-zinc-100 dark:border-zinc-800"
          style={{ clipPath: "polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)" }}
        />

        {/* The Progress Fill */}
        <motion.div
          className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px]"
          style={{
            background:
              "conic-gradient(from 180deg, #f43f5e 0deg, #f59e0b 90deg, #10b981 180deg)",
            clipPath: "polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)",
            border: "none",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isLocked ? 0 : 1,
            scale: 1,
            rotate: isLocked ? 0 : percentage * 1.8,
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Center Text - Now using getColor */}
        <div className="absolute bottom-0 w-full text-center">
          <span
            className={`text-4xl font-black tabular-nums ${isLocked ? "text-zinc-400" : getColor(percentage)}`}
          >
            {isLocked ? "🔒" : `${Math.round(percentage)}%`}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs font-medium text-zinc-500">
        {isLocked ? "Review in progress" : "Current Grade Assessment"}
      </p>
    </div>
  );
}
