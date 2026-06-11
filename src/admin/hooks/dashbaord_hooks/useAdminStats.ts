import { useQuery } from "@tanstack/react-query";

interface AdminLogItem {
  id: number;
  project_title: string;
  arrival_time: string;
  user_name: string;
  user_email: string;
  // Add other fields returned by your "all" query as needed
}

export function useAdminStats() {
  return useQuery<AdminLogItem[]>({
    queryKey: ["adminLogs"], // Changed key to reflect it's for the logs list
    queryFn: async () => {
      // Pointing to the consolidated API with action=all
      const response = await fetch("/api/admin/logs?action=all");
      if (!response.ok) throw new Error("Failed to fetch logs");
      return response.json();
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
}
