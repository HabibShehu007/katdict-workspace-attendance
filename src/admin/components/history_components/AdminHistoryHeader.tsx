import { CalendarRange } from "lucide-react";
import CustomCalendarPicker from "../history_components/AdminCalendarPicker";

interface AdminHistoryHeaderProps {
  activeRange: string;
  onRangeChange: (range: string, startDate?: string, endDate?: string) => void;
  customDateRange?: { startDate: string; endDate: string } | null;
}

export default function AdminHistoryHeader({
  activeRange,
  onRangeChange,
  customDateRange,
}: AdminHistoryHeaderProps) {
  // Updated Admin-specific view filters: Granular daily views + Weekly aggregator
  const filterOptions = [
    { id: "mon", label: "Mon" },
    { id: "tue", label: "Tue" },
    { id: "wed", label: "Wed" },
    { id: "thu", label: "Thu" },
    { id: "fri", label: "Fri" },
    { id: "this_week", label: "This Week" },
    { id: "all_time", label: "All Logs" },
  ];

  // Helper to get a friendly label for the description
  const getRangeLabel = () => {
    if (activeRange === "custom" && customDateRange) {
      return `Inspecting records from ${customDateRange.startDate} to ${customDateRange.endDate}`;
    }
    const option = filterOptions.find((o) => o.id === activeRange);
    return option
      ? `Displaying logs for: ${option.label}`
      : "Review and manage all user workspace submissions.";
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-4 border-b border-zinc-100 dark:border-zinc-800/60 text-left">
      <div className="space-y-1">
        <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <CalendarRange className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Admin Activity Log
        </h1>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {getRangeLabel()}
        </p>
      </div>

      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Admin Filter Toggles */}
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/40 p-1 rounded-xl border border-zinc-200/40 dark:border-zinc-700/30 min-w-max">
            {filterOptions.map((option) => {
              const isActive = activeRange === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onRangeChange(option.id)}
                  className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/60 dark:border-zinc-800"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Range Picker */}
        <div className="self-start sm:self-center">
          <CustomCalendarPicker
            onSelectRange={(start, end) => onRangeChange("custom", start, end)}
          />
        </div>
      </div>
    </div>
  );
}
