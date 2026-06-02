import { motion } from "framer-motion";
import {
  Code2,
  Clock,
  Cpu,
  ExternalLink,
  FolderGit2,
  Sparkles,
  Layers,
  FileEdit,
} from "lucide-react";

interface SubmittedLog {
  title: string;
  desc: string;
  stacks: string[];
  uiUrl?: string;
}

interface WorkspaceActiveLogCardProps {
  logData: SubmittedLog;
  onModifyClick: () => void;
}

export default function WorkspaceActiveLogCard({
  logData,
  onModifyClick,
}: WorkspaceActiveLogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-full bg-linear-to-b from-white to-zinc-50/30 dark:from-zinc-900 dark:to-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col text-left"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column Area: Details & Tech Tags */}
        <div className="lg:col-span-2 space-y-6 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800/80 pb-6 lg:pb-0 lg:pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-3 h-3" /> Track Active
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              <FolderGit2 className="w-3 h-3" /> Daily Target
            </span>
          </div>

          <div>
            <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Project Work Focus
            </h4>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mt-1 tracking-tight">
              {logData.title}
            </h3>
          </div>

          <div>
            <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
              Detailed Tasks Overview
            </h4>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed bg-zinc-50/50 dark:bg-zinc-800/20 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/40 whitespace-pre-wrap">
              {logData.desc}
            </p>
          </div>

          {logData.stacks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-zinc-400" /> Technologies &
                Modules Deployed
              </h4>
              <div className="flex flex-wrap gap-2">
                {logData.stacks.map((stack) => (
                  <span
                    key={stack}
                    className="text-xs font-bold bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 rounded-xl shadow-xs transition-transform hover:-translate-y-0.5"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column Sidebar Area: Analytics & UI References */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Session Analytics
            </h4>

            <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl">
              <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold">Punctuality Score</span>
              </div>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Secured
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl">
              <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold">Total Stack Count</span>
              </div>
              <span className="text-xs font-black text-zinc-900 dark:text-white bg-zinc-200 dark:bg-zinc-700 px-2.5 py-0.5 rounded-md">
                {logData.stacks.length} Tools
              </span>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2.5">
              Interface Mapping
            </h4>

            {logData.uiUrl ? (
              <a
                href={logData.uiUrl}
                target="_blank"
                rel="noreferrer"
                className="group block p-4 bg-emerald-600/5 hover:bg-emerald-600/10 border border-emerald-500/20 rounded-2xl transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block">
                      Design System Linked
                    </span>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1 block">
                      {logData.uiUrl}
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <ExternalLink className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                </div>

                <div className="mt-4 h-24 bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/50 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:border-emerald-500/30 transition-colors">
                  <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:12px_12px] opacity-70" />
                  <Layers className="w-6 h-6 text-zinc-300 dark:text-zinc-600 group-hover:text-emerald-500/40 group-hover:rotate-3 transition-all duration-300" />
                </div>
              </a>
            ) : (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl text-center">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold italic block">
                  No UI design system file reference pinned.
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <button
              onClick={onModifyClick}
              className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-black rounded-xl transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Modify Workspace Entries</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
