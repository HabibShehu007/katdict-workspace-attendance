import { CalendarRange, RefreshCw } from "lucide-react";
import CustomCalendarPicker from "../history_components/AdminCalendarPicker";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ["adminLogs"] });

  const filterOptions = [
    { id: "mon", label: "Mon" },
    { id: "tue", label: "Tue" },
    { id: "wed", label: "Wed" },
    { id: "thu", label: "Thu" },
    { id: "fri", label: "Fri" },
    { id: "this_week", label: "This Week" },
    { id: "all_time", label: "All Logs" },
  ];

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
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CalendarRange className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Admin Activity Log
          </h1>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {getRangeLabel()}
          </p>
        </div>

        {/* NEW: Integrated Refresh Button */}
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["adminLogs"] })
          }
          disabled={isFetching > 0} // 3. Disable while fetching
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all text-zinc-400 hover:text-emerald-600 disabled:opacity-50"
        >
          {/* 4. Add rotation animation when fetching */}
          <RefreshCw
            className={`w-4 h-4 ${isFetching > 0 ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Toggles */}
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/40 p-1 rounded-xl border border-zinc-200/40 dark:border-zinc-700/30 min-w-max">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onRangeChange(option.id)}
                className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${
                  activeRange === option.id
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/60 dark:border-zinc-800"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                {option.label}
              </button>
            ))}
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
