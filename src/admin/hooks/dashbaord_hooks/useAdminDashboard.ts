import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../admin_hooks/useAuth"; // Assuming you have an auth hook

export function useAdminDashboard() {
  const { admin } = useAuth(); // Assume this returns { email, managed_role, ... }

  return useQuery({
    queryKey: ["adminStats", admin?.managed_role], // Include role in key for automatic re-fetching
    queryFn: async () => {
      if (!admin?.managed_role) throw new Error("No admin role found");

      const response = await fetch(
        `/api/admin/logs?action=stats&role=${admin.managed_role}`,
      );

      if (!response.ok) throw new Error("Failed to fetch admin stats");
      return response.json();
    },
    enabled: !!admin?.managed_role, // Only run if we actually have a role
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
}
