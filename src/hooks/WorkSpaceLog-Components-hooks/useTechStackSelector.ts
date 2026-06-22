import { useState, useCallback } from "react";
import {
  DEV_STACKS,
  DESIGN_STACKS,
  NETWORKING_STACKS,
  DATA_SCIENCE_STACKS,
} from "../../constants/techStacks";
import type { UserRole } from "../../types/auth.types";

export type TabType =
  | "frontend"
  | "backend"
  | "fullstack"
  | "tools"
  | "categories"
  | "protocols"
  | "hardware"
  | "automation"
  | "libraries"
  | "tools_ds"
  | "concepts";

interface UseTechStackSelectorProps {
  userRole: UserRole;
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
    userRole === "ui_ux_design"
      ? "tools"
      : userRole === "networking"
        ? "protocols"
        : userRole === "data_science"
          ? "libraries"
          : "frontend",
  );
  const [customInput, setCustomInput] = useState("");

  const getDisplayOptions = useCallback((): string[] => {
    const all = (list: string[]) =>
      Array.from(new Set([...list, ...customStacks, ...value]));

    // 1. UI/UX Case
    if (userRole === "ui_ux_design") {
      const { tools, categories } = DESIGN_STACKS;
      const optionsMap: Record<string, string[]> = {
        tools: all(tools),
        categories: all(categories),
      };
      return optionsMap[activeTab] || all([...tools, ...categories]);
    }

    // 2. Networking Case
    if (userRole === "networking") {
      const { protocols, hardware, automation } = NETWORKING_STACKS;
      const optionsMap: Record<string, string[]> = {
        protocols: all(protocols),
        hardware: all(hardware),
        automation: all(automation),
      };
      return (
        optionsMap[activeTab] || all([...protocols, ...hardware, ...automation])
      );
    }

    // 3. Data Science Case
    if (userRole === "data_science") {
      const { libraries, tools, concepts } = DATA_SCIENCE_STACKS;
      const optionsMap: Record<string, string[]> = {
        libraries: all(libraries),
        tools_ds: all(tools),
        concepts: all(concepts),
      };
      return (
        optionsMap[activeTab] || all([...libraries, ...tools, ...concepts])
      );
    }

    // 4. Web Development Case
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
