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
  userRole: Extract<UserRole, "web_development" | "ui_ux_design">;
  // Made optional so you don't have to pass an empty array in the component
  value: string[];
  customStacks?: string[];
  onAddCustomStack: (stack: string) => void;
}

export function useTechStackSelector({
  userRole,
  value,
  customStacks = [],
  onAddCustomStack,
}: UseTechStackSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>(
    userRole === "ui_ux_design" ? "tools" : "frontend",
  );
  const [customInput, setCustomInput] = useState("");

  const getDisplayOptions = useCallback((): string[] => {
    const all = (list: string[]) =>
      Array.from(new Set([...list, ...customStacks, ...value]));

    if (userRole === "ui_ux_design") {
      const { tools, categories } = DESIGN_STACKS;
      const optionsMap: Record<string, string[]> = {
        tools: all(tools),
        categories: all(categories),
      };
      return optionsMap[activeTab] || all([...tools, ...categories]);
    }

    const { frontend, backend } = DEV_STACKS;
    const optionsMap: Record<string, string[]> = {
      frontend: all(frontend),
      backend: all(backend),
      fullstack: all([...frontend, ...backend]),
    };
    return optionsMap[activeTab] || all([...frontend, ...backend]);
  }, [activeTab, customStacks, value, userRole]);

  const handleCustomSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault?.();
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
