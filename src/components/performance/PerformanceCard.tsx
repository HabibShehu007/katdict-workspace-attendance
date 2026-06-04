import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionTemplate,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react"; // Added Lock icon for visual feedback

interface PerformanceCardProps {
  title: string;
  value: number | null;
  icon: LucideIcon;
  isLocked?: boolean; // Re-added
}

export function PerformanceCard({
  title,
  value,
  icon: Icon,
  isLocked = false, // Default to false
}: PerformanceCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const val = value ?? 0;

  const getColor = (v: number) => {
    if (v < 40) return "#f43f5e";
    if (v < 75) return "#f59e0b";
    return "#10b981";
  };

  const activeColor = getColor(val);
  const shadowGlow = useMotionTemplate`0px 4px 20px -8px ${activeColor}`;

  useEffect(() => {
    if (value !== null) {
      const controls = animate(count, value, {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [value, count]);

  return (
    <motion.div
      whileHover={{ y: isLocked ? 0 : -4 }} // Don't float if locked
      className={`group relative p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-sm transition-colors duration-500 ${
        isLocked ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: shadowGlow }}
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <Icon className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {title}
          </span>
        </div>
        {/* Visual feedback for isLocked */}
        {isLocked && <Lock className="w-3 h-3 text-zinc-400" />}
      </div>

      <div className="flex items-baseline gap-0.5">
        <span className="text-4xl font-extrabold text-zinc-900 dark:text-white tabular-nums">
          {value !== null ? <motion.span>{rounded}</motion.span> : "--"}
        </span>
        {value !== null && (
          <span className="text-lg font-bold" style={{ color: activeColor }}>
            %
          </span>
        )}
      </div>

      <div className="relative w-full h-1.5 mt-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute h-full rounded-full"
          style={{ backgroundColor: isLocked ? "#94a3b8" : activeColor }} // Gray if locked
          initial={{ width: 0 }}
          animate={{
            width: value !== null ? `${Math.min(value, 100)}%` : "0%",
          }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}
