import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Code2,
  Layers,
  AlignLeft,
  ImagePlus,
  Monitor,
  Server,
} from "lucide-react";

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

// 9 to 10 industry standard skills as of 2026 broken down by side layers
const FRONTEND_STACKS = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vite",
  "Tailwind CSS",
  "Framer Motion",
];

const BACKEND_STACKS = [
  "Node.js",
  "Fastify",
  "Express",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "Supabase",
  "WebSockets",
  "REST APIs",
];

// Clean, neutral placeholder text array for the dynamic title loop
const PLACEHOLDER_SUGGESTIONS = [
  "Building user authentication layers...",
  "Fixing secure connection routes...",
  "Designing responsive database schemas...",
  "Optimizing live data stream components...",
  "Polishing interface animation curves...",
];

export default function WorkspaceLogModal({
  isOpen,
  onClose,
  onSubmit,
}: WorkspaceLogModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [uiUrl, setUiUrl] = useState("");

  // Tab control layer: 'frontend' or 'backend'
  const [activeTab, setActiveTab] = useState<"frontend" | "backend">(
    "frontend",
  );

  // State for tracking our animated placeholder suggestion loop
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Dynamic placeholder timing engine text switcher loop
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length,
      );
    }, 3000); // changes text smoothly every 3 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleToggleStack = (stack: string) => {
    if (selectedStacks.includes(stack)) {
      setSelectedStacks(selectedStacks.filter((s) => s !== stack));
    } else {
      setSelectedStacks([...selectedStacks, stack]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;
    onSubmit({ title, desc, stacks: selectedStacks, uiUrl });

    // Clear form state parameters
    setTitle("");
    setDesc("");
    setSelectedStacks([]);
    setUiUrl("");
  };

  // Determine which list array of skills to render depending on the user selection toggle
  const currentStackOptions =
    activeTab === "frontend" ? FRONTEND_STACKS : BACKEND_STACKS;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-xl z-10 my-8"
          >
            {/* Close Button Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title Header */}
            <div className="mb-5">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                Daily Work Details
              </h3>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                Tell us about the project you are building today.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              {/* Input 1: Animated Project Title Selection Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-400" /> Project Focus
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-500 transition-all z-10 bg-transparent"
                  />
                  {/* Sliding Suggestion Element Backdrop */}
                  <AnimatePresence mode="wait">
                    {!title && (
                      <motion.span
                        key={placeholderIndex}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 0.4, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-3.5 text-sm text-zinc-500 pointer-events-none select-none unselectable"
                      >
                        {PLACEHOLDER_SUGGESTIONS[placeholderIndex]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Input 2: Project Work Description Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-zinc-400" /> Work
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="What specific tasks are you completing or working through today?"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              {/* Input 3: Filter Layer Selector Options */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-zinc-400" /> Technologies
                    Used
                  </label>

                  {/* Organic Layer Switch Toggles Bar */}
                  <div className="flex p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveTab("frontend")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        activeTab === "frontend"
                          ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                      }`}
                    >
                      <Monitor className="w-3 h-3" />
                      <span>Frontend</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("backend")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        activeTab === "backend"
                          ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                      }`}
                    >
                      <Server className="w-3 h-3" />
                      <span>Backend</span>
                    </button>
                  </div>
                </div>

                {/* Rendered Skill Option Grid Area */}
                <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800/60 rounded-xl min-h-[96px]">
                  <motion.div layout className="flex flex-wrap gap-2">
                    {currentStackOptions.map((stack) => {
                      const isSelected = selectedStacks.includes(stack);
                      return (
                        <button
                          type="button"
                          key={stack}
                          onClick={() => handleToggleStack(stack)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                              : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                          }`}
                        >
                          {stack}
                        </button>
                      );
                    })}
                  </motion.div>
                </div>
              </div>

              {/* Input 4: Optional Screenshot link element */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <ImagePlus className="w-3.5 h-3.5 text-zinc-400" /> Design UI
                  Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/screenshot.png"
                  value={uiUrl}
                  onChange={(e) => setUiUrl(e.target.value)}
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Form Action Submit Footer */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 text-sm cursor-pointer"
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
