// components/history_components/HistoryHeader.tsx
import { CalendarRange } from "lucide-react";
import CustomCalendarPicker from "./CustomCalendarPicker";

interface HistoryHeaderProps {
  activeRange: string; // Maps straight to activeFilter from our hook
  onRangeChange: (range: string, startDate?: string, endDate?: string) => void;
  customDateRange?: { startDate: string; endDate: string } | null;
}

export default function HistoryHeader({
  activeRange,
  onRangeChange,
  customDateRange,
}: HistoryHeaderProps) {
  // Navigation for the present week
  const weekDays = [
    { id: "all_week", label: "Full Week" },
    { id: "monday", label: "Mon" },
    { id: "tuesday", label: "Tue" },
    { id: "wednesday", label: "Wed" },
    { id: "thursday", label: "Thu" },
    { id: "friday", label: "Fri" },
  ];

  return (
    <div className="w-full flex flex-col gap-5 pb-4 border-b border-zinc-100 dark:border-zinc-800/60 text-left">
      {/* Title section */}
      <div className="space-y-1">
        <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <CalendarRange className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Workspace History
        </h1>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {activeRange === "custom" && customDateRange
            ? `Viewing records from ${customDateRange.startDate} to ${customDateRange.endDate}`
            : "Check out your progress and see what you worked on this week."}
        </p>
      </div>

      {/* Action Row */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Day Toggles */}
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1.5 bg-zinc-100/80 dark:bg-zinc-800/40 p-1 rounded-xl border border-zinc-200/40 dark:border-zinc-700/30 min-w-max">
            {weekDays.map((day) => {
              const isActive = activeRange === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => onRangeChange(day.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/60 dark:border-zinc-800"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* The New Guarded Calendar Picker */}
        <div className="self-start sm:self-center">
          <CustomCalendarPicker
            onSelectRange={(start, end) => onRangeChange("custom", start, end)}
          />
        </div>
      </div>
    </div>
  );
}
