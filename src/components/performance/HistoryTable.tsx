import type { WorkspaceHistoryItem } from "../../types/auth.types";

interface HistoryTableProps {
  logs: WorkspaceHistoryItem[];
}

export function HistoryTable({ logs }: HistoryTableProps) {
  // Defensive helper to format time
  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr) return "N/A";
    try {
      const cleanTime = timeStr.replace(/[^0-9:]/g, "");
      const [hours, minutes] = cleanTime.split(":");
      if (!hours) return timeStr;

      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes || "0"));

      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeStr;
    }
  };

  // Defensive helper to format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr || !dateStr.includes("-")) return "N/A";
    try {
      const [year, month, day] = dateStr.split("-");
      const date = new Date(
        Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)),
      );
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
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
                {/* Drizzle-aligned: projectTitle */}
                {log.projectTitle || "Unnamed Project"}
              </td>
              <td className="py-4 text-zinc-500">
                {/* Drizzle-aligned: logDate */}
                {formatDate(log.logDate)}
              </td>
              <td className="py-4 text-zinc-500 font-mono">
                {/* Drizzle-aligned: Accessing nested workData for time if needed, 
                    assuming log.arrivalTime exists or fallback */}
                {formatTime((log.workData as any)?.arrivalTime)}
              </td>
              <td className="py-4 text-right">
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    log.isLate
                      ? "bg-rose-100 text-rose-600 dark:bg-rose-900/20"
                      : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20"
                  }`}
                >
                  {/* Drizzle-aligned: isLate */}
                  {log.isLate ? "Late" : "On Time"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
