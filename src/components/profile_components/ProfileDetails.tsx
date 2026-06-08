import type { UserProfile } from "../../types/auth.types";
import { Edit2, BookOpen, Briefcase, Zap, Award } from "lucide-react";

interface ProfileDetailsProps {
  user: UserProfile;
  onEditClick: () => void;
}

export default function ProfileDetails({
  user,
  onEditClick,
}: ProfileDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Organic Streak Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Current
            </span>
          </div>
          <p className="text-3xl font-black text-emerald-900 dark:text-white">
            {user.current_streak || 0}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Day Streak
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2 mb-2 text-zinc-500 dark:text-zinc-400">
            <Award className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Highest
            </span>
          </div>
          <p className="text-3xl font-black text-zinc-900 dark:text-white">
            {user.highest_streak || 0}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Best Record
          </p>
        </div>
      </div>

      {/* Bio & Role Section */}
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
          <div>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3 h-3" /> <span>Bio</span>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {user.bio ||
                "No bio provided yet. Click edit to add a professional summary."}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Briefcase className="w-3 h-3" /> <span>Professional Role</span>
            </div>
            <p className="text-zinc-900 dark:text-white font-semibold">
              {user.role || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
