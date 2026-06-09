// hooks/history_hooks/useAdminHistory.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { AdminLogItem } from "../../components/history_components/AdminHistoryDetailsModal";

interface AdminHistoryResponse {
  success: boolean;
  logs: AdminLogItem[];
}

export function useAdminHistory(
  filter: string = "mon-fri",
  startDate?: string,
  endDate?: string,
) {
  return useQuery<AdminHistoryResponse>({
    queryKey: ["adminHistory", filter, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({ filter });

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(
        `/api/admin/get-all-logs?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch admin logs");
      }

      return response.json();
    },
    // Keep the old logs on screen while the new ones load, preventing empty-state flashes
    placeholderData: keepPreviousData,
    // Refresh every 6 seconds
    refetchInterval: 6000,
    // Keep data fresh in cache for 1 minute
    staleTime: 60000,
  });
}
