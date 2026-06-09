import { useQuery } from "@tanstack/react-query";

interface AdminStats {
  totalUsers: number;
  presentUsers: number;
  activeLogs: number;
  recentLogs: Array<{
    id: string;
    project_title: string;
    arrival_time: string;
    user_name: string;
  }>;
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/get-stats");
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      return response.json();
    },
    refetchInterval: 30000, // Keep the dashboard live
  });
}
