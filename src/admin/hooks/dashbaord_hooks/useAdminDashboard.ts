import { useQuery } from "@tanstack/react-query";

interface AdminLog {
  id: number;
  project_title: string;
  arrival_time: string;
  user_name: string;
}

interface AdminDashboardData {
  totalUsers: number;
  presentUsers: number;
  activeLogs: number;
  recentLogs: AdminLog[];
}

export function useAdminDashboard() {
  return useQuery<AdminDashboardData>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/get-stats");
      if (!response.ok) throw new Error("Failed to fetch admin stats");
      return response.json();
    },
    // Polling every 15 seconds to keep the dashboard live
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}
