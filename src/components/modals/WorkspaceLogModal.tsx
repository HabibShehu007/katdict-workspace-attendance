import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Layers,
  AlignLeft,
  ImagePlus,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import TechStackSelector from "./TechStackSelector";
import { useWorkspaceLogModal } from "../../hooks/WorkSpaceLog-Components-hooks/useWorkspaceLogModal";
import type { WorkspaceHistoryItem, UserRole } from "../../types/auth.types";

interface WorkspaceLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  initialData: WorkspaceHistoryItem | null;
  userRole: UserRole;
}

export default function WorkspaceLogModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData,
  userRole,
}: WorkspaceLogModalProps) {
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
    handleToggleStack,
    handleAddCustomStack,
    handleFormSubmit,
  } = useWorkspaceLogModal({
    isOpen,
    onSubmit,
    initialData,
    // Updated fix applied here
    userRole:
      userRole === "ui_ux_design" || userRole === "web_development"
        ? userRole
        : "web_development",
  });

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
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xl z-10 my-auto max-h-[90vh] flex flex-col"
          >
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5 text-left pr-6">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                {userRole === "ui_ux_design"
                  ? "Design Log Details"
                  : "Daily Work Details"}
              </h3>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-4 text-left overflow-y-auto pr-1 flex-1"
            >
              {/* Form Fields remain same... */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5" /> Project Title
                </label>
                <input
                  required
                  disabled={isSubmitting}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlignLeft className="w-3.5 h-3.5" /> Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5"
                />
              </div>

              {/* Fix: Explicitly narrow the role for the selector */}
              <TechStackSelector
                userRole={
                  userRole === "ui_ux_design"
                    ? "ui_ux_design"
                    : "web_development"
                }
                selectedStacks={selectedStacks}
                onToggleStack={handleToggleStack}
                onAddCustomStack={handleAddCustomStack}
                customStacks={customStacks}
              />

              {userRole === "web_development" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <GitBranch className="w-3.5 h-3.5" /> GitHub Repository *
                    </label>
                    <input
                      type="url"
                      required
                      value={githubUrl || ""}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className={`w-full text-sm px-3.5 py-2.5 border rounded-xl ${!isGithubValid ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <ExternalLink className="w-3.5 h-3.5" /> Live URL
                      (Optional)
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
                <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <ImagePlus className="w-3.5 h-3.5" /> UI Reference (Optional)
                </label>
                <input
                  type="url"
                  value={uiUrl || ""}
                  onChange={(e) => setUiUrl(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isGithubValid}
                className="w-full bg-emerald-600 text-white font-black py-3 rounded-xl"
              >
                {isSubmitting ? "Saving..." : "Save Log Submission"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
