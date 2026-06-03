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

interface WorkspaceLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    desc: string;
    stacks: string[];
    uiUrl?: string;
    githubUrl: string; // Mandatory string constraint update
    liveUrl?: string;
  }) => void;
  isSubmitting?: boolean;
}

export default function WorkspaceLogModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
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
    placeholderIndex,
    handleToggleStack,
    handleAddCustomStack,
    handleFormSubmit,
  } = useWorkspaceLogModal({ isOpen, onSubmit });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
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
            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Section */}
            <div className="mb-5 text-left pr-6">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                Daily Work Details
              </h3>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                Tell us about the features or design layouts you are building
                today.
              </p>
            </div>

            {/* Scrollable Container with Hidden Native Scrollbars */}
            <form
              onSubmit={handleFormSubmit}
              className="space-y-4 text-left overflow-y-auto pr-1 flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Field 1: Project Focus Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  Project Focus *
                </label>
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-all">
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 text-zinc-900 dark:text-white bg-transparent focus:outline-hidden z-10 disabled:opacity-60"
                  />
                  <AnimatePresence mode="wait">
                    {!title && (
                      <motion.span
                        key={placeholderIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute left-3.5 text-sm text-zinc-400 dark:text-zinc-500 pointer-events-none select-none font-medium"
                      >
                        {PLACEHOLDER_SUGGESTIONS[placeholderIndex]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Field 2: Work Description Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlignLeft className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  Work Description *
                </label>
                <textarea
                  required
                  rows={3}
                  disabled={isSubmitting}
                  placeholder="What specific components or problems are you working through today?"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-500 transition-all placeholder-zinc-400 dark:placeholder-zinc-500 font-medium resize-none disabled:opacity-60"
                />
              </div>

              {/* Field 3: Technology Tag Row */}
              <TechStackSelector
                selectedStacks={selectedStacks}
                onToggleStack={handleToggleStack}
                onAddCustomStack={handleAddCustomStack}
                customStacks={customStacks}
              />

              {/* Field 4: Required GitHub Link Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <GitBranch className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  GitHub Repository Link *
                </label>
                <input
                  type="url"
                  required
                  disabled={isSubmitting}
                  placeholder="e.g., https://github.com/username/repository"
                  value={githubUrl || ""}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-500 transition-all placeholder-zinc-400 dark:placeholder-zinc-500 font-medium disabled:opacity-60"
                />

                {/* Notice Info Card for Staff Tracking Requirements */}
                <div className="flex gap-2 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 text-xs leading-relaxed font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    A GitHub repository link is required so senior staff members
                    can view and track your code updates. You can modify this
                    link at any time before the closing window cuts off at{" "}
                    <strong>12:00 PM noon</strong>.
                  </p>
                </div>
              </div>

              {/* Field 5: UI Reference / Figma Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <ImagePlus className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  UI Reference / Figma Link (Optional)
                </label>
                <input
                  type="url"
                  disabled={isSubmitting}
                  placeholder="e.g., https://figma.com/file/... or design link"
                  value={uiUrl}
                  onChange={(e) => setUiUrl(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-500 transition-all placeholder-zinc-400 dark:placeholder-zinc-500 font-medium disabled:opacity-60"
                />
              </div>

              {/* Field 6: Live Hosted Project Preview Link (Moved to Bottom) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  Live Production URL (Optional)
                </label>
                <input
                  type="url"
                  disabled={isSubmitting}
                  placeholder="e.g., https://your-project.vercel.app"
                  value={liveUrl || ""}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-500 transition-all placeholder-zinc-400 dark:placeholder-zinc-500 font-medium disabled:opacity-60"
                />
              </div>

              {/* Action Button Container */}
              <div className="pt-2 sticky bottom-0 bg-white dark:bg-zinc-900">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 text-sm cursor-pointer tracking-wide flex items-center justify-center gap-2 disabled:bg-zinc-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Saving your log...</span>
                    </>
                  ) : (
                    <span>Save Log Submission</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
