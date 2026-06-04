import { motion } from "framer-motion";

interface GaugeProps {
  value: number | null;
  isLocked: boolean;
}

export function PerformanceGauge({ value, isLocked }: GaugeProps) {
  const percentage = value ?? 0;

  return (
    <div className="p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm flex flex-col items-center">
      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
        Performance Grade
      </h3>

      <div className="relative w-48 h-24 overflow-hidden">
        {/* 1. The Red Background (Always empty base) */}
        <div
          className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-rose-500/20"
          style={{ clipPath: "polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)" }}
        />

        {/* 2. The Dynamic Progress Arc (Fills up) */}
        <motion.div
          className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px]"
          style={{
            borderColor:
              percentage < 40
                ? "#f43f5e"
                : percentage < 70
                  ? "#f59e0b"
                  : "#10b981",
            clipPath: "polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)",
          }}
          initial={{ rotate: -180 }}
          animate={{ rotate: isLocked ? -180 : -180 + percentage * 1.8 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Center Text */}
        <div className="absolute bottom-0 w-full text-center">
          <span className="text-4xl font-black text-zinc-900 dark:text-white tabular-nums">
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
