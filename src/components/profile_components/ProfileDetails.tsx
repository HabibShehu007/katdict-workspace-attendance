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
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ui_ux_design":
        return "GRAPHIC & UI/UX DESIGN";
      case "web_development":
        return "WEB DEVELOPMENT";
      case "networking":
        return "NETWORKING";
      default:
        return role?.replace("_", " ").toUpperCase() || "DEVELOPER";
    }
  };

  // Maps roles to specific colors for consistent UI theming
  const getAccentColor = (role: string) => {
    switch (role) {
      case "ui_ux_design":
        return "border-purple-500 text-purple-600";
      case "networking":
        return "border-sky-500 text-sky-600";
      default:
        return "border-emerald-500 text-emerald-600";
    }
  };

  const accent = getAccentColor(user.role);

  return (
    <div className="space-y-6">
      {/* Organic Streak Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm shadow-emerald-500/5">
          <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Current Streak
            </span>
          </div>
          <p className="text-4xl font-black text-emerald-950 dark:text-white tracking-tighter">
            {user.currentStreak || 0}
          </p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-bold mt-1">
            Days active
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-700/50 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-zinc-500 dark:text-zinc-400">
            <Award className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Best Record
            </span>
          </div>
          <p className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
            {user.highestStreak || 0}
          </p>
          <p className="text-xs text-zinc-500/70 dark:text-zinc-400/70 font-bold mt-1">
            Days achieved
          </p>
        </div>
      </div>

      {/* Bio & Role Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
            Profile Overview
          </h3>
          <button
            onClick={onEditClick}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest hover:text-white hover:bg-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl transition-all border border-emerald-100 dark:border-emerald-900`}
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Bio
          </button>
        </div>

        <div className="space-y-10">
          {/* Enhanced Bold Bio */}
          <div className={`relative pl-6 border-l-4 ${accent.split(" ")[0]}`}>
            <div
              className={`flex items-center gap-2 ${accent.split(" ")[1]} text-[10px] font-black uppercase tracking-[0.2em] mb-4`}
            >
              <BookOpen className="w-3.5 h-3.5" />{" "}
              <span>Professional Summary</span>
            </div>
            <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed font-semibold italic tracking-tight">
              {user.bio
                ? `“${user.bio}”`
                : "No bio provided yet. Add a professional summary to help your team know you better."}
            </p>
          </div>

          {/* Bold Role Tag */}
          <div className="pl-6 border-l-4 border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Briefcase className="w-3.5 h-3.5" /> <span>Current Role</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-black tracking-widest shadow-lg shadow-zinc-900/20 dark:shadow-white/10">
              {getRoleLabel(user.role)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
