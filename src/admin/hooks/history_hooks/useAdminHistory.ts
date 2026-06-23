import { useQuery } from "@tanstack/react-query";
import type { AdminLogItem } from "../../types/admin.types";
// Import from the new Admin Context
import { useAdmin } from "../../context/AdminContext";

export function useAdminHistory() {
  const { admin } = useAdmin();

  return useQuery<AdminLogItem[], Error>({
    queryKey: ["adminLogs", admin?.managed_role],
    queryFn: async () => {
      if (!admin?.managed_role) throw new Error("No admin role found");

      const res = await fetch(
        `/api/admin/logs?action=all&role=${admin.managed_role}`,
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch admin logs");
      }
      return res.json();
    },
    enabled: !!admin?.managed_role,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: true,
  });
}
