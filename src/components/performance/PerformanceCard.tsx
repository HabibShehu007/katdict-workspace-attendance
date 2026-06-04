import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface PerformanceCardProps {
  title: string;
  value: number | null;
  icon: LucideIcon;
  isLocked?: boolean;
}

export function PerformanceCard({
  title,
  value,
  icon: Icon,
  isLocked,
}: PerformanceCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const val = value ?? 0;

  // Unified color logic
  const getColor = (v: number) => {
    if (v < 40) return "#f43f5e"; // Rose
    if (v < 75) return "#f59e0b"; // Amber
    return "#10b981"; // Emerald
  };

  useEffect(() => {
    if (value !== null) {
      const controls = animate(count, value, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      });
      return controls.stop;
    }
  }, [value, count]);

  return (
    <div className="group relative p-5 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm transition-all">
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <Icon className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {title}
          </span>
        </div>
      </div>

      <div className="relative flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-zinc-900 dark:text-white tabular-nums">
          {value !== null ? <motion.span>{rounded}</motion.span> : "--"}
        </span>
        {value !== null && (
          <span className="text-lg font-bold" style={{ color: getColor(val) }}>
            %
          </span>
        )}
      </div>

      <div className="relative w-full h-1.5 mt-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute h-full rounded-full"
          style={{ backgroundColor: getColor(val) }}
          initial={{ width: 0 }}
          animate={{
            width: value !== null ? `${Math.min(value, 100)}%` : "0%",
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
