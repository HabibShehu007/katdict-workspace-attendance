import { toast } from "sonner";
import { motion } from "framer-motion";

interface TogglerProps {
  activeView: "weekly" | string;
  onToggle: (view: "weekly" | string) => void;
  isLocked: boolean;
}

export function PerformanceToggler({
  activeView,
  onToggle,
  isLocked,
}: TogglerProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const handleSelection = (view: "weekly" | string) => {
    if (view === "weekly" && isLocked) {
      toast.error(
        "Overall week performance is under review until Friday at 12:00 PM.",
      );
      return;
    }
    onToggle(view);
  };

  return (
    <div className="flex flex-wrap gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
      <button
        onClick={() => handleSelection("weekly")}
        className={`relative px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
          activeView === "weekly"
            ? "text-zinc-900 dark:text-white"
            : "text-zinc-400"
        }`}
      >
        {activeView === "weekly" && (
          <motion.div
            layoutId="pill"
            className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-xl shadow-sm"
          />
        )}
        <span className="relative z-10">Weekly</span>
      </button>

      {days.map((day) => (
        <button
          key={day}
          onClick={() => handleSelection(day)}
          className={`relative px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
            activeView === day
              ? "text-zinc-900 dark:text-white"
              : "text-zinc-400"
          }`}
        >
          {activeView === day && (
            <motion.div
              layoutId="pill"
              className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-xl shadow-sm"
            />
          )}
          <span className="relative z-10">{day}</span>
        </button>
      ))}
    </div>
  );
}
