// src/hooks/user_hooks/useProfileLogic.ts
import { useState, useCallback } from "react";
import type { UserProfile } from "../../types/auth.types";
import { toast } from "sonner";

export function useProfileLogic(
  user: UserProfile | null,
  setUser: (user: UserProfile | null) => void,
) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Update profile (text fields)
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
          const updatedUser = { ...user, ...result.data };
          setUser(updatedUser);
          localStorage.setItem("katdict_user", JSON.stringify(updatedUser));
          toast.success("Profile updated successfully!");
          return true;
        }
        throw new Error(result.error || "Update failed");
      } catch (err: any) {
        toast.error(err.message || "Failed to update profile");
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [user, setUser],
  );

  // Upload Avatar (file handling)
  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!user) return false;

      setIsUpdating(true);
      toast.loading("Uploading avatar...");

      try {
        const response = await fetch(
          `/api/user/upload-avatar?userId=${user.id}`,
          {
            method: "POST",
            body: file,
          },
        );

        const result = await response.json();

        if (result.success) {
          const updatedUser = { ...user, avatarUrl: result.url };
          setUser(updatedUser);
          localStorage.setItem("katdict_user", JSON.stringify(updatedUser));

          toast.dismiss(); // Remove loading toast
          toast.success("Avatar updated successfully!");
          return true;
        }
        throw new Error(result.error || "Upload failed");
      } catch (err: any) {
        toast.dismiss();
        toast.error(err.message || "Failed to upload avatar");
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [user, setUser],
  );

  return { updateProfile, uploadAvatar, isUpdating };
}
