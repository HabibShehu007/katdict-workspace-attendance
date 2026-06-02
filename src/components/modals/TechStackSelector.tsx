import { motion } from "framer-motion";
import { Monitor, Server, Terminal, Plus, Check } from "lucide-react";
import { useTechStackSelector } from "../../hooks/WorkSpaceLog-Components-hooks/useTechStackSelector";
import type { TabType } from "../../hooks/WorkSpaceLog-Components-hooks/useTechStackSelector";

interface TechStackSelectorProps {
  selectedStacks: string[];
  onToggleStack: (stack: string) => void;
  onAddCustomStack: (stack: string) => void;
  customStacks: string[];
}

export default function TechStackSelector({
  selectedStacks,
  onToggleStack,
  onAddCustomStack,
  customStacks,
}: TechStackSelectorProps) {
  // Pull isolated view states cleanly into the selector template
  const {
    activeTab,
    setActiveTab,
    customInput,
    setCustomInput,
    getDisplayOptions,
    handleCustomSubmit,
  } = useTechStackSelector({ customStacks, onAddCustomStack });

  // FIXED: Manual "Enter" key listener to replace nested <form> behavior
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Stop the outer Modal form from triggering
      handleCustomSubmit(e as any);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
          Technologies Used
        </label>

        {/* Tab Bar Layout */}
        <div className="flex p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl text-[11px] font-bold self-start sm:self-auto">
          {(["frontend", "backend", "fullstack"] as TabType[]).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                activeTab === tab
                  ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-zinc-200/40 dark:border-zinc-800/40"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {tab === "frontend" && (
                <motion.div layoutId="ico">
                  <Monitor className="w-3 h-3" />
                </motion.div>
              )}
              {tab === "backend" && (
                <motion.div layoutId="ico">
                  <Server className="w-3 h-3" />
                </motion.div>
              )}
              {tab === "fullstack" && (
                <motion.div layoutId="ico">
                  <Terminal className="w-3 h-3" />
                </motion.div>
              )}
              <span>{tab === "fullstack" ? "Full Stack" : tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Options Render Layer Box */}
      <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl min-h-[100px]">
        <motion.div
          layout="position"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="flex flex-wrap gap-1.5"
        >
          {getDisplayOptions().map((stack) => {
            const isSelected = selectedStacks.includes(stack);
            return (
              <button
                type="button"
                key={stack}
                onClick={() => onToggleStack(stack)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-xs scale-[1.02]"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
                <span>{stack}</span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* FIXED: Changed from <form> to <div> to stop nested form errors */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Can't find your stack? Type it here... (e.g., Figma, Docker)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-xs bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500/80 transition-all placeholder-zinc-400 dark:placeholder-zinc-500 font-medium"
        />
        <button
          type="button"
          onClick={handleCustomSubmit}
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 px-3.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer active:scale-95 shadow-xs"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
