// components/performance/DonutChart.tsx
import { motion } from "framer-motion";

interface DonutProps {
  data: { label: string; value: number; color: string }[];
}

export function DonutChart({ data }: DonutProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <h3 className="text-sm font-bold text-zinc-500 uppercase mb-6">
        Device Statistic
      </h3>

      <div className="relative w-32 h-32">
        {/* The Donut Ring */}
        <div className="absolute inset-0 rounded-full border-[12px] border-zinc-100 dark:border-zinc-800" />

        {/* Animated Segment (Example: showing one primary segment) */}
        <motion.div
          className="absolute inset-0 rounded-full border-[12px] border-emerald-500"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 90, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            borderTopColor: "transparent",
            borderRightColor: "transparent",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center font-black text-lg">
          35%
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-4 text-xs text-zinc-500">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
