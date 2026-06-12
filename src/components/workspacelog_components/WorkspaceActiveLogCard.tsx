import { motion } from "framer-motion";
import {
  Code2,
  Clock,
  FolderGit2,
  Sparkles,
  FileEdit,
  GitBranch,
  Layers,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

import type { WorkspaceHistoryItem } from "../../types/auth.types";

interface WorkspaceActiveLogCardProps {
  logData: WorkspaceHistoryItem;
  onModifyClick: () => void;
}

export default function WorkspaceActiveLogCard({
  logData,
  onModifyClick,
}: WorkspaceActiveLogCardProps) {
  const d = logData as any;

  // 1. Drizzle-aware data extraction (Handling JSONB structure)
  const workData = d.workData || {};

  const title =
    d.projectTitle || workData.title || d.title || "Untitled Project";
  const desc = d.projectDescription || workData.desc || d.desc || "";
  const techStacks = workData.stacks || d.stacks || [];

  const githubUrl = workData.githubUrl || d.githubUrl || d.github_url;
  const liveUrl = workData.liveUrl || d.liveUrl || d.live_url;
  const uiUrl = workData.uiUrl || d.uiUrl || d.ui_url;

  const dayName = d.dayName || d.day_name || "Daily Log";
  const isLate = d.isLate === true;

  // 2. Humanize Time Utility
  const formatTime = (timeInput: string | undefined) => {
    if (!timeInput) return "--:--";
    const date = new Date(timeInput);
    return !isNaN(date.getTime())
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : timeInput;
  };

  const arrivalTime = formatTime(d.arrivalTime || d.createdAt);
  const roleDisplay = (d.role || "web_development").replace("_", " ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-xs flex flex-col text-left relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none hidden md:block" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
        {/* Left Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
              <Sparkles className="w-3 h-3" /> {roleDisplay}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              <FolderGit2 className="w-3 h-3" /> {dayName}
            </span>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Project Title
            </h4>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white mt-1.5 tracking-tight leading-tight">
              {title}
            </h3>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
              Project Description
            </h4>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed bg-zinc-50/60 dark:bg-zinc-800/20 p-4 sm:p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 whitespace-pre-wrap">
              {desc}
            </p>
          </div>

          {techStacks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> Tools &amp; Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {techStacks.map((stack: string, index: number) => (
                  <span
                    key={`${stack}-${index}`}
                    className="text-xs font-bold bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl shadow-2xs"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 lg:border-l lg:border-zinc-100 dark:lg:border-zinc-800/80 lg:pl-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Time &amp; Status
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/60 rounded-xl">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold">Arrival</span>
                </div>
                <span className="text-[10px] font-black text-zinc-900 dark:text-zinc-100">
                  {arrivalTime}
                </span>
              </div>

              <div
                className={`flex items-center justify-between p-3.5 border rounded-xl ${isLate ? "bg-red-50/50 border-red-100" : "bg-emerald-50/50 border-emerald-100"}`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle
                    className={`w-4 h-4 ${isLate ? "text-red-500" : "text-emerald-500"}`}
                  />
                  <span className="text-xs font-bold text-zinc-600">
                    Status
                  </span>
                </div>
                <span
                  className={`text-[10px] font-black uppercase ${isLate ? "text-red-600" : "text-emerald-600"}`}
                >
                  {isLate ? "Late" : "On Time"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Resources
            </h4>
            <div className="flex flex-col gap-2.5">
              {githubUrl && (
                <LinkItem icon={GitBranch} label="GitHub" url={githubUrl} />
              )}
              {uiUrl && (
                <LinkItem icon={Layers} label="UI Reference" url={uiUrl} />
              )}
              {liveUrl && (
                <LinkItem icon={ExternalLink} label="Live Demo" url={liveUrl} />
              )}
            </div>
          </div>

          <button
            onClick={onModifyClick}
            className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-black rounded-xl transition-all"
          >
            <FileEdit className="w-3.5 h-3.5 inline mr-2" /> Edit Log
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const LinkItem = ({
  icon: Icon,
  label,
  url,
}: {
  icon: any;
  label: string;
  url: string;
}) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-colors"
  >
    <Icon className="w-4 h-4 text-zinc-400" />
    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
      {label}
    </p>
  </a>
);
