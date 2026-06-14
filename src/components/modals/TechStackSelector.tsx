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
import type { UserRole } from "../../types/auth.types";

interface TechStackSelectorProps {
  userRole: Extract<UserRole, "web_development" | "ui_ux_design">;
  value: string[];
  onChange: (value: string[]) => void;
}

export default function TechStackSelector({
  userRole,
  value = [],
  onChange,
}: TechStackSelectorProps) {
  // We hook into your logic, passing a helper to handle additions directly through the onChange prop
  const {
    activeTab,
    setActiveTab,
    customInput,
    setCustomInput,
    getDisplayOptions,
    handleCustomSubmit,
  } = useTechStackSelector({
    userRole,
    value,
    onAddCustomStack: (stack) => onChange([...value, stack]),
  });

  const toggleStack = (stack: string) => {
    const nextValue = value.includes(stack)
      ? value.filter((s) => s !== stack)
      : [...value, stack];
    onChange(nextValue); // This sends a fresh array reference
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomSubmit(e as any);
    }
  };

  const displayOptions = getDisplayOptions() || [];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <label className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
          {userRole === "ui_ux_design"
            ? "Design Tools & Categories"
            : "Technologies Used"}
        </label>

        <div className="flex p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl text-[11px] font-bold self-start sm:self-auto">
          {(userRole === "ui_ux_design"
            ? (["tools", "categories"] as TabType[])
            : (["frontend", "backend", "fullstack"] as TabType[])
          ).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all capitalize ${
                activeTab === tab
                  ? "bg-white dark:bg-zinc-900 text-emerald-600 shadow-xs border border-zinc-200/40"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
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

      <div className="p-3 bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl min-h-[100px]">
        <motion.div layout className="flex flex-wrap gap-1.5">
          {displayOptions.map((stack) => {
            const isSelected = value.includes(stack);
            return (
              <button
                type="button"
                key={stack}
                onClick={() => toggleStack(stack)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-emerald-600 border-emerald-600 text-white scale-[1.02]"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                {stack}
              </button>
            );
          })}
        </motion.div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={
            userRole === "ui_ux_design"
              ? "Add custom tool..."
              : "Can't find your stack?..."
          }
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-xs bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 rounded-xl px-3.5 py-2 outline-none focus:border-emerald-500 transition-all"
        />
        <button
          type="button"
          onClick={() => handleCustomSubmit(null as any)}
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
