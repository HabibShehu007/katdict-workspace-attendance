import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProfileDisplay from "../components/profile_components/ProfileDisplay";
import ProfileDetails from "../components/profile_components/ProfileDetails";
import EditProfileModal from "../components/modals/EditProfileModal";
import ProfileSkeleton from "../components/profile_components/ProfileSkeleton"; // Imported your skeleton
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, isLoading } = useAuth(); // Destructure loading state from AuthContext
  const [showEditModal, setShowEditModal] = useState(false);

  // UX Injection: If the AuthContext is still resolving the session, show the skeleton
  if (isLoading) {
    return (
      <DashboardLayout>
        <ProfileSkeleton />
      </DashboardLayout>
    );
  }

  // If there is no user and we are done loading, you might handle a redirect here
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
            Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Basic Identity */}
          <div className="lg:col-span-1">
            <ProfileDisplay
              user={user}
              onEditClick={() => setShowEditModal(true)}
            />
          </div>

          {/* Right Column: Bio & Editable Details */}
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
