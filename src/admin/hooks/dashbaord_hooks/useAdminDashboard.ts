import { useQuery } from "@tanstack/react-query";

interface AdminLog {
  id: number;
  project_title: string;
  arrival_time: string;
  user_name: string;
}

interface AdminDashboardData {
  total_users: number; // Matches the database keys in your merged API
  present_users: number;
  active_logs: number;
  recentLogs: AdminLog[];
}

export function useAdminDashboard() {
  return useQuery<AdminDashboardData>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      // Pointing to the consolidated API with action=stats
      const response = await fetch("/api/admin/logs?action=stats");
      if (!response.ok) throw new Error("Failed to fetch admin stats");
      return response.json();
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}
