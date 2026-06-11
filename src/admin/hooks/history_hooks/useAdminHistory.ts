// hooks/history_hooks/useAdminHistory.ts
import { useQuery } from "@tanstack/react-query";
import type { AdminLogItem } from "../../types/admin.types";

export function useAdminHistory() {
  return useQuery<AdminLogItem[], Error>({
    queryKey: ["adminLogs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/get-all-logs");
      if (!res.ok) {
        // More descriptive error handling
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch admin logs");
      }
      return res.json();
    },
    // The Hybrid Strategy:
    // Snappy cache for 5 minutes
    staleTime: 1000 * 60 * 5,
    // Auto-refresh in background every minute
    refetchInterval: 1000 * 60,
    // Always fetch latest data when admin returns to tab
    refetchOnWindowFocus: true,
  });
}
