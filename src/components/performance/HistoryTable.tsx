import type { WorkspaceHistoryItem } from "../../types/auth.types";

interface HistoryTableProps {
  logs: WorkspaceHistoryItem[];
}

export function HistoryTable({ logs }: HistoryTableProps) {
  // Defensive helper to format time
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "N/A";

    try {
      // Strips anything that isn't a digit or colon to handle "09:00 AM" or "09:00:00"
      const cleanTime = timeStr.replace(/[^0-9:]/g, "");
      const [hours, minutes] = cleanTime.split(":");

      if (!hours) return timeStr;

      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes || "0"));

      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return timeStr; // Fallback if parsing fails
    }
  };

  // Defensive helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes("-")) return "N/A";

    try {
      const [year, month, day] = dateStr.split("-");
      // Use UTC parts to avoid timezone-based day shifts
      const date = new Date(
        Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)),
      );
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
            <th className="pb-4 font-medium">Project</th>
            <th className="pb-4 font-medium">Date</th>
            <th className="pb-4 font-medium">Arrival</th>
            <th className="pb-4 font-medium text-right">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <td className="py-4 font-medium text-zinc-900 dark:text-white">
                {log.project_title || "Unnamed Project"}
              </td>
              <td className="py-4 text-zinc-500">
                {formatDate(log.formatted_date)}
              </td>
              <td className="py-4 text-zinc-500 font-mono">
                {formatTime(log.arrival_time)}
              </td>
              <td className="py-4 text-right">
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    log.is_late
                      ? "bg-rose-100 text-rose-600 dark:bg-rose-900/20"
                      : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20"
                  }`}
                >
                  {log.is_late ? "Late" : "On Time"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
