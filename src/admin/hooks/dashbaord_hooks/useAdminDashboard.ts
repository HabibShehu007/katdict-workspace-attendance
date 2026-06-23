import { useQuery } from "@tanstack/react-query";
import { useAdmin } from "../../context/AdminContext"; // Pointing to your new Context

export function useAdminDashboard() {
  const { admin } = useAdmin();

  return useQuery({
    queryKey: ["adminStats", admin?.managed_role],
    queryFn: async () => {
      if (!admin?.managed_role) throw new Error("No admin role found");

      const response = await fetch(
        `/api/admin/logs?action=stats&role=${admin.managed_role}`,
      );

      if (!response.ok) throw new Error("Failed to fetch admin stats");
      return response.json();
    },
    enabled: !!admin?.managed_role,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
}
