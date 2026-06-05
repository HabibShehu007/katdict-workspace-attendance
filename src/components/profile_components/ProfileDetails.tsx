import type { UserProfile } from "../../types/auth.types";
import { Edit2, BookOpen, Briefcase } from "lucide-react";

interface ProfileDetailsProps {
  user: UserProfile;
  onEditClick: () => void;
}

export default function ProfileDetails({
  user,
  onEditClick,
}: ProfileDetailsProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          Bio & Details
        </h3>
        <button
          onClick={onEditClick}
          className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-8">
        {/* Bio Section */}
        <div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3 h-3" />
            <span>Bio</span>
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {user.bio ||
              "No bio provided yet. Click edit to add a professional summary."}
          </p>
        </div>

        {/* Role Section */}
        <div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-3 h-3" />
            <span>Professional Role</span>
          </div>
          <p className="text-zinc-900 dark:text-white font-semibold">
            {user.role || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
}
