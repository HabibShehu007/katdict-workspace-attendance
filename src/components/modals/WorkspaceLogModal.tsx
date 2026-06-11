import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Layers,
  AlignLeft,
  ImagePlus,
  GitBranch,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import TechStackSelector from "./TechStackSelector";
import { PLACEHOLDER_SUGGESTIONS } from "../../constants/techStacks";
import { useWorkspaceLogModal } from "../../hooks/WorkSpaceLog-Components-hooks/useWorkspaceLogModal";
import { useAuth } from "../../context/AuthContext";

interface WorkspaceLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    desc: string;
    stacks: string[];
    uiUrl?: string;
    githubUrl: string;
    liveUrl?: string;
  }) => void;
  isSubmitting?: boolean;
  initialData?: any;
}

export default function WorkspaceLogModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData,
}: WorkspaceLogModalProps) {
  const { user } = useAuth();
  const userRole = user?.role || "web_development";
  const roleKey =
    userRole === "ui_ux_design" ? "ui_ux_design" : "web_development";

  const {
    title,
    setTitle,
    desc,
    setDesc,
    selectedStacks,
    customStacks,
    uiUrl,
    setUiUrl,
    githubUrl,
    setGithubUrl,
    liveUrl,
    setLiveUrl,
    placeholderIndex,
    handleToggleStack,
    handleAddCustomStack,
    handleFormSubmit,
  } = useWorkspaceLogModal({
    isOpen,
    onSubmit,
    initialData,
  });

  // Validation Logic
  const isGithubValid =
    !githubUrl || githubUrl.startsWith("https://github.com");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-xl z-10 my-auto max-h-[90vh] flex flex-col"
          >
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5 text-left pr-6">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                Daily Work Details
              </h3>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                Tell us about the features or design layouts you are building
                today.
              </p>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-4 text-left overflow-y-auto pr-1 flex-1 scrollbar-none"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder={
                    PLACEHOLDER_SUGGESTIONS[roleKey][
                      placeholderIndex % PLACEHOLDER_SUGGESTIONS[roleKey].length
                    ]
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlignLeft className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  Project Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 transition-all"
                />
              </div>

              <TechStackSelector
                userRole={userRole}
                selectedStacks={selectedStacks}
                onToggleStack={handleToggleStack}
                onAddCustomStack={handleAddCustomStack}
                customStacks={customStacks}
              />

              {userRole === "web_development" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <GitBranch className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                      GitHub Repository Link *
                    </label>
                    <input
                      type="url"
                      required
                      value={githubUrl || ""}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className={`w-full text-sm px-3.5 py-2.5 border rounded-xl transition-all text-zinc-900 dark:text-white ${
                        !isGithubValid
                          ? "border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-800"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40"
                      }`}
                    />
                    {!isGithubValid && (
                      <p className="text-[10px] text-red-500 font-bold">
                        Must start with https://github.com
                      </p>
                    )}
                    <div className="flex gap-2 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        A GitHub repository link is required for code tracking.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                      Live Production URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={liveUrl || ""}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <ImagePlus className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  UI Reference / Figma Link (Optional)
                </label>
                <input
                  type="url"
                  value={uiUrl || ""}
                  onChange={(e) => setUiUrl(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5"
                />
              </div>

              <div className="pt-2 sticky bottom-0 bg-white dark:bg-zinc-900">
                <button
                  type="submit"
                  disabled={isSubmitting || !isGithubValid}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition-all disabled:bg-zinc-400"
                >
                  {isSubmitting ? "Saving..." : "Save Log Submission"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
