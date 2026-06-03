import { motion } from "framer-motion";
import {
  Code2,
  Clock,
  Cpu,
  FolderGit2,
  Sparkles,
  FileEdit,
  GitBranch,
  Layers,
  ExternalLink,
} from "lucide-react";

// Keep your original schema names intact so data mapping doesn't break!
interface SubmittedLog {
  title: string;
  desc: string;
  stacks: string[];
  uiUrl?: string;
  githubUrl?: string; // safely added alongside your original fields
  liveUrl?: string; // safely added alongside your original fields
}

interface WorkspaceActiveLogCardProps {
  logData: SubmittedLog;
  onModifyClick: () => void;
}

export default function WorkspaceActiveLogCard({
  logData,
  onModifyClick,
}: WorkspaceActiveLogCardProps) {
  // Safe array initialization to prevent map errors if stacks are undefined
  const techStacks = logData.stacks || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-xs flex flex-col text-left relative overflow-hidden"
    >
      {/* Decorative background shape */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none hidden md:block" />

      {/* Main Grid Layout Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
        {/* Left Section Area: Main Work Progress Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
              <Sparkles className="w-3 h-3" /> Active Status
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              <FolderGit2 className="w-3 h-3" /> Today's Goal
            </span>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Project Title
            </h4>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white mt-1.5 tracking-tight leading-tight">
              {logData.title}
            </h3>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
              Project Description
            </h4>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed bg-zinc-50/60 dark:bg-zinc-800/20 p-4 sm:p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 whitespace-pre-wrap">
              {logData.desc}
            </p>
          </div>

          {techStacks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> Tools &amp; Technologies Used
              </h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {techStacks.map((stack) => (
                  <span
                    key={stack}
                    className="text-xs font-bold bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl shadow-2xs transition-transform hover:-translate-y-0.5"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section Area: Summary Cards & Attached Previews */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 lg:border-l lg:border-zinc-100 dark:lg:border-zinc-800/80 lg:pl-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Time &amp; Summary
            </h4>

            {/* Attendance Status & Items Row */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold">Check-in Time</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Saved
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold">Tools Used</span>
                </div>
                <span className="text-[10px] font-black text-zinc-900 dark:text-white bg-zinc-200 dark:bg-zinc-700 px-2.5 py-0.5 rounded-md">
                  {techStacks.length} Total
                </span>
              </div>
            </div>
          </div>

          {/* New Clean Section: Renders all your links dynamically using the correct frontend keys */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Attached Links
            </h4>

            <div className="flex flex-col gap-2.5">
              {/* 1. Mandatory Code Link */}
              {logData.githubUrl && (
                <a
                  href={logData.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/60 rounded-xl group transition-all"
                >
                  <GitBranch className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                      GitHub Repository
                    </p>
                    <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 truncate">
                      {logData.githubUrl}
                    </p>
                  </div>
                </a>
              )}

              {/* 2. Optional Design System UI Reference Link */}
              {logData.uiUrl && (
                <a
                  href={logData.uiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/60 rounded-xl group transition-all"
                >
                  <Layers className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                      UI Reference Link
                    </p>
                    <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 truncate">
                      {logData.uiUrl}
                    </p>
                  </div>
                </a>
              )}

              {/* 3. Optional Hosted Staging Project Preview Link */}
              {logData.liveUrl && (
                <a
                  href={logData.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/20 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/60 rounded-xl group transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                      Live Production URL
                    </p>
                    <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 truncate">
                      {logData.liveUrl}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={onModifyClick}
              className="w-full py-3 px-4 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-black rounded-xl transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Edit Log Details</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
