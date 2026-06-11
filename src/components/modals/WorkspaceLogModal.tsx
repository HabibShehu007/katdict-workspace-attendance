import { motion } from "framer-motion";
import {
  Monitor,
  Server,
  Terminal,
  Plus,
  Check,
  PenTool,
  LayoutTemplate,
} from "lucide-react";
import { useTechStackSelector } from "../../hooks/WorkSpaceLog-Components-hooks/useTechStackSelector";
import type { TabType } from "../../hooks/WorkSpaceLog-Components-hooks/useTechStackSelector";

interface TechStackSelectorProps {
  // Use the strict union to ensure this component only handles these two cases
  userRole: "web_development" | "ui_ux_design";
  selectedStacks: string[];
  onToggleStack: (stack: string) => void;
  onAddCustomStack: (stack: string) => void;
  customStacks: string[];
}

export default function TechStackSelector({
  userRole,
  selectedStacks,
  onToggleStack,
  onAddCustomStack,
  customStacks,
}: TechStackSelectorProps) {
  const {
    activeTab,
    setActiveTab,
    customInput,
    setCustomInput,
    getDisplayOptions,
    handleCustomSubmit,
  } = useTechStackSelector({ userRole, customStacks, onAddCustomStack });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomSubmit(e as any);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
          {userRole === "ui_ux_design"
            ? "Design Tools & Categories"
            : "Technologies Used"}
        </label>

        {/* Dynamic Tab Bar */}
        <div className="flex p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl text-[11px] font-bold self-start sm:self-auto">
          {(userRole === "ui_ux_design"
            ? (["tools", "categories"] as TabType[])
            : (["frontend", "backend", "fullstack"] as TabType[])
          ).map((tab) => (
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
              {/* Icons updated to include Design specific tabs */}
              {tab === "frontend" && <Monitor className="w-3 h-3" />}
              {tab === "backend" && <Server className="w-3 h-3" />}
              {tab === "fullstack" && <Terminal className="w-3 h-3" />}
              {tab === "tools" && <PenTool className="w-3 h-3" />}
              {tab === "categories" && <LayoutTemplate className="w-3 h-3" />}

              <span>{tab === "fullstack" ? "Full Stack" : tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Options Render Layer */}
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

      {/* Custom Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={
            userRole === "ui_ux_design"
              ? "Add custom tool..."
              : "Can't find your stack? Type it here..."
          }
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-xs bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-900 dark:text-white focus:outline-hidden focus:border-emerald-500/80 transition-all placeholder-zinc-400 dark:placeholder-zinc-500 font-medium"
        />
        <button
          type="button"
          onClick={() => handleCustomSubmit(null as any)}
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 px-3.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer active:scale-95 shadow-xs"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
