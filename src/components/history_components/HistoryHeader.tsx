// components/history_components/HistoryHeader.tsx
import { CalendarRange } from "lucide-react";

interface HistoryHeaderProps {
  activeRange: string;
  onRangeChange: (range: string) => void;
}

export default function HistoryHeader({
  activeRange,
  onRangeChange,
}: HistoryHeaderProps) {
  const filterPills = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "7days", label: "Last 7 Days" },
    { id: "14days", label: "Last 2 Weeks" },
    { id: "all", label: "All History" },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/60 text-left">
      <div className="space-y-1">
        <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <CalendarRange className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Workspace Logging History
        </h1>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Review, analyze, and inspect your past daily progress log submissions.
        </p>
      </div>

      {/* Filter Navigation Row */}
      <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100/80 dark:bg-zinc-800/40 p-1 rounded-xl border border-zinc-200/40 dark:border-zinc-700/30 self-start md:self-center">
        {filterPills.map((pill) => {
          const isActive = activeRange === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => onRangeChange(pill.id)}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/60 dark:border-zinc-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
