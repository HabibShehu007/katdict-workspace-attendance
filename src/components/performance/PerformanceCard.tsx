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

  useEffect(() => {
    if (value !== null && !isLocked) {
      const controls = animate(count, value, {
        duration: 1.5,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [value, isLocked, count]);

  return (
    <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
      {/* Icon and Title */}
      <div className="flex items-center gap-2 mb-4 text-zinc-500">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">
          {title}
        </span>
      </div>

      {/* Animated Number */}
      <div className="text-4xl font-black text-zinc-900 dark:text-white">
        {isLocked ? "🔒" : <motion.span>{rounded}</motion.span>}
        {!isLocked && <span className="text-xl text-emerald-500">%</span>}
      </div>

      {/* Progress Ring Background */}
      <svg className="w-full h-2 mt-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: isLocked ? "0%" : `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
