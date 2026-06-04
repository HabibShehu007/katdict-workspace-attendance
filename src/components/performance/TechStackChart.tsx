// components/performance/TechStackChart.tsx
import { motion } from "framer-motion";
import { getTechDetails } from "../../lib/tech-registry";

export function TechStackChart({
  data,
}: {
  data: { key: string; value: number }[];
}) {
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Helper to map color names to actual hex/tailwind-like colors
  const getColorValue = (colorName: string) => {
    const colors: Record<string, string> = {
      blue: "#3b82f6",
      emerald: "#10b981",
      zinc: "#71717a",
      amber: "#f59e0b",
      sky: "#0ea5e9",
      orange: "#f97316",
      yellow: "#eab308",
      indigo: "#6366f1",
      red: "#ef4444",
      purple: "#a855f7",
      teal: "#14b8a6",
      pink: "#ec4899",
      green: "#22c55e",
    };
    return colors[colorName] || "#71717a";
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
        Tech Stack Used
      </h3>

      <div className="space-y-4">
        {sortedData.map(({ key }) => {
          const { label, color, icon: Icon } = getTechDetails(key);
          const hexColor = getColorValue(color);

          return (
            <div key={key}>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  {/* Using inline style for icon color too */}
                  <Icon style={{ color: hexColor }} className="w-4 h-4" />
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {label}
                  </span>
                </div>
              </div>

              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: hexColor }} // Inline style fixes the fill issue
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
