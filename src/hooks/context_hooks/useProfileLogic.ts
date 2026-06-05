import { useState, useCallback } from "react";
import type { UserProfile } from "../../types/auth.types";
import { toast } from "sonner";

export function useProfileLogic(
  user: UserProfile | null,
  setUser: (user: UserProfile | null) => void,
) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user) return false;

      setIsUpdating(true);
      try {
        const response = await fetch("/api/user/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, ...data }),
        });

        const result = await response.json();

        if (result.success) {
          // Merge existing user state with new data
          setUser({ ...user, ...result.data });
          localStorage.setItem(
            "katdict_user",
            JSON.stringify({ ...user, ...result.data }),
          );
          toast.success("Profile updated successfully!");
          return true;
        }
        throw new Error(result.error || "Update failed");
      } catch (err: any) {
        toast.error(err.message);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [user, setUser],
  );

  return { updateProfile, isUpdating };
}
