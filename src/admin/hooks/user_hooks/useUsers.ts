import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Import from your new context
import { useAdmin } from "../../context/AdminContext";

const API_URL = "/api/admin/users";

export function useUsers() {
  // Use the new Admin hook
  const { admin } = useAdmin();

  return useQuery({
    queryKey: ["users", admin?.managed_role],
    queryFn: async () => {
      if (!admin?.managed_role) throw new Error("No admin role found");

      const res = await fetch(`${API_URL}?adminRole=${admin.managed_role}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      return data.users;
    },
    enabled: !!admin?.managed_role,
  });
}

export function useDeleteUser() {
  const { admin } = useAdmin(); // Use the new Admin hook
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}?adminRole=${admin?.managed_role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete user");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
