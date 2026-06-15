import { motion } from "framer-motion";
import { getTechDetails } from "../../lib/tech-registry";
import { TechIcon } from "../ui/TechIcon"; // Your new CDN component

export function TechStackChart({
  data,
}: {
  data: { key: string; value: number }[];
}) {
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
        Tech & Design Stack
      </h3>

      <div className="space-y-4">
        {sortedData.map(({ key, value }) => {
          const { label, slug } = getTechDetails(key);

          return (
            <div key={key}>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  {/* Using the new CDN-based TechIcon */}
                  <TechIcon slug={slug} className="w-4 h-4" />
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {label}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-400">
                  {value}%
                </span>
              </div>

              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
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
