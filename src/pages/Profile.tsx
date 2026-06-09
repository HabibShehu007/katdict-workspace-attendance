// src/pages/ProfilePage.tsx
import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProfileDisplay from "../components/profile_components/ProfileDisplay";
import ProfileDetails from "../components/profile_components/ProfileDetails";
import EditProfileModal from "../components/modals/EditProfileModal";
import ProfileSkeleton from "../components/profile_components/ProfileSkeleton";
import { useAuth } from "../context/AuthContext";
// ADD THIS IMPORT LINE:
import { useProfileLogic } from "../hooks/context_hooks/useProfileLogic";

export default function ProfilePage() {
  const { user, setUser, isLoading } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  // Now this will work!
  const { uploadAvatar, isUpdating } = useProfileLogic(user, setUser);

  if (isLoading)
    return (
      <DashboardLayout>
        <ProfileSkeleton />
      </DashboardLayout>
    );
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
          Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProfileDisplay
              user={user}
              onEditClick={() => setShowEditModal(true)}
              onAvatarUpdate={uploadAvatar}
              isUpdating={isUpdating}
            />
          </div>
          <div className="lg:col-span-2">
            <ProfileDetails
              user={user}
              onEditClick={() => setShowEditModal(true)}
            />
          </div>
        </div>

        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          initialData={user}
        />
      </div>
    </DashboardLayout>
  );
}
