import { useQuery } from "@tanstack/react-query";
import type { AdminLogItem } from "../../types/admin.types";

export function useAdminHistory() {
  return useQuery<AdminLogItem[], Error>({
    queryKey: ["adminLogs"],
    queryFn: async () => {
      // Updated to point to the consolidated controller with action=all
      const res = await fetch("/api/admin/logs?action=all");

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch admin logs");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: true,
  });
}
