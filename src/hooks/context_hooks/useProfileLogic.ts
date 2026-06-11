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
            headers: {
              "Content-Type": file.type,
              "x-vercel-blob-filename": file.name,
            },
            body: file, // Raw file stream
          },
        );

        const result = await response.json();

        if (result.success) {
          const updatedUser = { ...user, avatarUrl: result.url };
          setUser(updatedUser);
          localStorage.setItem("katdict_user", JSON.stringify(updatedUser));

          toast.dismiss();
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
