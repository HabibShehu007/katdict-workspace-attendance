import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, AlignLeft, ImagePlus } from "lucide-react";
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
  }) => void;
}

export default function WorkspaceLogModal({
  isOpen,
  onClose,
  onSubmit,
}: WorkspaceLogModalProps) {
  // Extract all decoupled state configurations cleanly
  const {
    title,
    setTitle,
    desc,
    setDesc,
    selectedStacks,
    customStacks,
    uiUrl,
    setUiUrl,
    placeholderIndex,
    handleToggleStack,
    handleAddCustomStack,
    handleFormSubmit,
  } = useWorkspaceLogModal({ isOpen, onSubmit });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Flat backdrop animation overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-xl z-10 my-8"
          >
            {/* Close Cross Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Area */}
            <div className="mb-5 text-left">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                Daily Work Details
              </h3>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
                Tell us about the features or layout tasks you are building
                today.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              {/* Field 1: Project Focus Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />{" "}
                  Project Focus
                </label>
                <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-all">
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 text-zinc-900 dark:text-white bg-transparent focus:outline-hidden z-10"
                  />
                  {/* Clean Fade Overlay for Suggestions Placeholder */}
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
                  <AlignLeft className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />{" "}
                  Work Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="What specific components or problems are you working through today?"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-500 transition-all placeholder-zinc-400 dark:placeholder-zinc-500 font-medium resize-none"
                />
              </div>

              {/* Field 3: Technology Array Tag Row */}
              <TechStackSelector
                selectedStacks={selectedStacks}
                onToggleStack={handleToggleStack}
                onAddCustomStack={handleAddCustomStack}
                customStacks={customStacks}
              />

              {/* Field 4: Interface Link Attachment input */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <ImagePlus className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />{" "}
                  UI Reference / Figma Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="e.g., https://figma.com/file/... or image address"
                  value={uiUrl}
                  onChange={(e) => setUiUrl(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-500 transition-all placeholder-zinc-400 dark:placeholder-zinc-500 font-medium"
                />
              </div>

              {/* Submission CTA Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 text-sm cursor-pointer tracking-wide flex items-center justify-center gap-2"
                >
                  Save Log Submission
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
