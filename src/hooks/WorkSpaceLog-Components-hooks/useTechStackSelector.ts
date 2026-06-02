import { useState, useCallback } from "react";
import { FRONTEND_STACKS, BACKEND_STACKS } from "../../constants/techStacks";

export type TabType = "frontend" | "backend" | "fullstack";

interface UseTechStackSelectorProps {
  customStacks: string[];
  onAddCustomStack: (stack: string) => void;
}

export function useTechStackSelector({
  customStacks,
  onAddCustomStack,
}: UseTechStackSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("frontend");
  const [customInput, setCustomInput] = useState("");

  const getDisplayOptions = useCallback(() => {
    switch (activeTab) {
      case "frontend":
        return [
          ...FRONTEND_STACKS,
          ...customStacks.filter((s) => !FRONTEND_STACKS.includes(s)),
        ];
      case "backend":
        return [
          ...BACKEND_STACKS,
          ...customStacks.filter((s) => !BACKEND_STACKS.includes(s)),
        ];
      case "fullstack":
        return [...FRONTEND_STACKS, ...BACKEND_STACKS, ...customStacks];
    }
  }, [activeTab, customStacks]);

  const handleCustomSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cleanTag = customInput.trim();
      if (!cleanTag) return;

      onAddCustomStack(cleanTag);
      setCustomInput("");
    },
    [customInput, onAddCustomStack],
  );

  return {
    activeTab,
    setActiveTab,
    customInput,
    setCustomInput,
    getDisplayOptions,
    handleCustomSubmit,
  };
}
