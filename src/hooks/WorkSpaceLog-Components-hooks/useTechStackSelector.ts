import { useState, useCallback } from "react";
import { DEV_STACKS, DESIGN_STACKS } from "../../constants/techStacks";
import type { UserRole } from "../../types/auth.types"; // Import your UserRole type

// Updated tabs to handle both developer roles and design roles
export type TabType =
  | "frontend"
  | "backend"
  | "fullstack"
  | "tools"
  | "categories";

interface UseTechStackSelectorProps {
  userRole: UserRole; // Accept the role here
  customStacks: string[];
  onAddCustomStack: (stack: string) => void;
}

export function useTechStackSelector({
  userRole,
  customStacks,
  onAddCustomStack,
}: UseTechStackSelectorProps) {
  // Set default tab based on the user's role
  const [activeTab, setActiveTab] = useState<TabType>(
    userRole === "ui_ux_design" ? "tools" : "frontend",
  );
  const [customInput, setCustomInput] = useState("");

  const getDisplayOptions = useCallback(() => {
    // If designer, use Design constants
    if (userRole === "ui_ux_design") {
      const { tools, categories } = DESIGN_STACKS;
      switch (activeTab) {
        case "tools":
          return [...tools, ...customStacks.filter((s) => !tools.includes(s))];
        case "categories":
          return [
            ...categories,
            ...customStacks.filter((s) => !categories.includes(s)),
          ];
        default:
          return [...tools, ...categories, ...customStacks];
      }
    }

    // Otherwise, default to Developer constants
    const { frontend, backend } = DEV_STACKS;
    switch (activeTab) {
      case "frontend":
        return [
          ...frontend,
          ...customStacks.filter((s) => !frontend.includes(s)),
        ];
      case "backend":
        return [
          ...backend,
          ...customStacks.filter((s) => !backend.includes(s)),
        ];
      case "fullstack":
        return [...frontend, ...backend, ...customStacks];
      default:
        return [...frontend, ...backend];
    }
  }, [activeTab, customStacks, userRole]);

  // ... (handleCustomSubmit remains the same)
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
