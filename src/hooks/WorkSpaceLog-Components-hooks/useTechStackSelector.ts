import { useState, useCallback } from "react";
import { DEV_STACKS, DESIGN_STACKS } from "../../constants/techStacks";
import type { UserRole } from "../../types/auth.types";

export type TabType =
  | "frontend"
  | "backend"
  | "fullstack"
  | "tools"
  | "categories";

interface UseTechStackSelectorProps {
  userRole: UserRole;
  customStacks: string[];
  onAddCustomStack: (stack: string) => void;
}

export function useTechStackSelector({
  userRole,
  customStacks = [], // Default to empty array if undefined
  onAddCustomStack,
}: UseTechStackSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>(
    userRole === "ui_ux_design" ? "tools" : "frontend",
  );
  const [customInput, setCustomInput] = useState("");

  // Ensure we always have an array to work with to prevent .filter() errors
  const safeCustomStacks = Array.isArray(customStacks) ? customStacks : [];

  const getDisplayOptions = useCallback(() => {
    // If designer, use Design constants
    if (userRole === "ui_ux_design") {
      const { tools, categories } = DESIGN_STACKS;
      switch (activeTab) {
        case "tools":
          return [
            ...tools,
            ...safeCustomStacks.filter((s) => !tools.includes(s)),
          ];
        case "categories":
          return [
            ...categories,
            ...safeCustomStacks.filter((s) => !categories.includes(s)),
          ];
        default:
          return [...tools, ...categories, ...safeCustomStacks];
      }
    }

    // Developer constants
    const { frontend, backend } = DEV_STACKS;
    switch (activeTab) {
      case "frontend":
        return [
          ...frontend,
          ...safeCustomStacks.filter((s) => !frontend.includes(s)),
        ];
      case "backend":
        return [
          ...backend,
          ...safeCustomStacks.filter((s) => !backend.includes(s)),
        ];
      case "fullstack":
        return [...frontend, ...backend, ...safeCustomStacks];
      default:
        return [...frontend, ...backend];
    }
  }, [activeTab, safeCustomStacks, userRole]);

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
