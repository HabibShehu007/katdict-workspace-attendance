// src/components/profile_components/ProfileDisplay.tsx
import { useRef } from "react";
import type { UserProfile } from "../../types/auth.types";
import { Edit2, Mail, User, Camera, Loader2 } from "lucide-react";

interface ProfileDisplayProps {
  user: UserProfile;
  onEditClick: () => void;
  onAvatarUpdate?: (file: File) => void;
  isUpdating?: boolean; // Added this prop
}

export default function ProfileDisplay({
  user,
  onEditClick,
  onAvatarUpdate,
  isUpdating,
}: ProfileDisplayProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarUpdate) onAvatarUpdate(file);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        {/* Avatar Section */}
        <div className="relative w-32 h-32 mb-4">
          <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-4 border-zinc-50 dark:border-zinc-800 overflow-hidden">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-zinc-400" />
            )}
          </div>

          {/* Upload Trigger - Shows Loader when updating */}
          <button
            disabled={isUpdating}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full border-4 border-white dark:border-zinc-900 hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <h2 className="text-xl font-black text-zinc-900 dark:text-white">
          {user.fullName}
        </h2>
        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-1">
          {user.role || "Developer"}
        </p>

        <div className="w-full mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-left space-y-4">
          <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
        </div>

        <button
          onClick={onEditClick}
          className="w-full mt-8 flex items-center justify-center gap-2 py-3 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl transition-all font-bold text-sm"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>
    </div>
  );
}
