import { motion } from "framer-motion";

interface GaugeProps {
  value: number | null;
  isLocked: boolean;
}

export function PerformanceGauge({ value, isLocked }: GaugeProps) {
  const percentage = Math.min(Math.max(value ?? 0, 0), 100);

  // Perfectly aligned with the conic-gradient stops
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

        {/* The Progress Fill:
           - Red: 0% to 40% (0 to 72deg)
           - Amber: 40% to 75% (72deg to 135deg)
           - Emerald: 75% to 100% (135deg to 180deg)
        */}
        <motion.div
          className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px]"
          style={{
            background: `conic-gradient(from 180deg, 
              #f43f5e 72deg, 
              #f59e0b 72deg 135deg, 
              #10b981 135deg 180deg
            )`,
            clipPath: "polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)",
            border: "none",
          }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{
            opacity: isLocked ? 0.3 : 1,
            rotate: isLocked ? 0 : percentage * 1.8,
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Center Text */}
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
