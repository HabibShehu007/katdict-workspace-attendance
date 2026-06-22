// src/hooks/user_hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../admin_hooks/useAuth"; // Import your auth hook

const API_URL = "/api/admin/users";

export function useUsers() {
  const { admin } = useAuth();

  return useQuery({
    // Include the role in the queryKey so data refreshes if the admin changes
    queryKey: ["users", admin?.managed_role],
    queryFn: async () => {
      if (!admin?.managed_role) throw new Error("No admin role found");

      const res = await fetch(`${API_URL}?adminRole=${admin.managed_role}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      return data.users;
    },
    enabled: !!admin?.managed_role, // Only run fetch when we have the role
  });
}

export function useDeleteUser() {
  const { admin } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Pass role in the body or URL to verify deletion permission
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
