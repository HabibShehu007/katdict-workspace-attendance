import { useState, useEffect, useCallback } from "react";
import { PLACEHOLDER_SUGGESTIONS } from "../../constants/techStacks";

interface UseWorkspaceLogModalProps {
  isOpen: boolean;
  userRole: "web_development" | "ui_ux_design";
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function useWorkspaceLogModal({
  isOpen,
  userRole,
  onSubmit,
  initialData,
}: UseWorkspaceLogModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [customStacks, setCustomStacks] = useState<string[]>([]);
  const [uiUrl, setUiUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // THE PREFILL ENGINE
  useEffect(() => {
    if (isOpen) {
      if (
        initialData &&
        typeof initialData === "object" &&
        Object.keys(initialData).length > 0
      ) {
        setTitle(initialData.title || "");
        setDesc(initialData.desc || "");
        setSelectedStacks(initialData.stacks || []);

        const defaultAvailableStacks = [
          "React",
          "Node.js",
          "Fastify",
          "Tailwind CSS",
          "Next.js",
          "TypeScript",
          "Supabase",
          "Figma",
        ];

        const extractedCustom = (initialData.stacks || []).filter(
          (stack: string) => !defaultAvailableStacks.includes(stack),
        );
        setCustomStacks(extractedCustom);

        setUiUrl(initialData.uiUrl || "");
        setGithubUrl(initialData.githubUrl || "");
        setLiveUrl(initialData.liveUrl || "");
      } else {
        setTitle("");
        setDesc("");
        setSelectedStacks([]);
        setCustomStacks([]);
        setUiUrl("");
        setGithubUrl("");
        setLiveUrl("");
      }
    }
  }, [isOpen, initialData]);

  // FIXED: Dynamic placeholder switcher
  useEffect(() => {
    if (!isOpen) return;

    // Select the array based on role first
    const rolePlaceholders = PLACEHOLDER_SUGGESTIONS[userRole] || [];

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rolePlaceholders.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isOpen, userRole]);

  const handleToggleStack = useCallback((stack: string) => {
    setSelectedStacks((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack],
    );
  }, []);

  const handleAddCustomStack = useCallback((newStack: string) => {
    setCustomStacks((prev) =>
      prev.includes(newStack) ? prev : [...prev, newStack],
    );
    setSelectedStacks((prev) =>
      prev.includes(newStack) ? prev : [...prev, newStack],
    );
  }, []);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // Added basic validation
      if (!title.trim() || !desc.trim()) return;

      onSubmit({
        title: title.trim(),
        desc: desc.trim(),
        stacks: selectedStacks,
        uiUrl: uiUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
      });
    },
    [title, desc, selectedStacks, uiUrl, githubUrl, liveUrl, onSubmit],
  );

  return {
    title,
    setTitle,
    desc,
    setDesc,
    selectedStacks,
    customStacks,
    uiUrl,
    setUiUrl,
    githubUrl,
    setGithubUrl,
    liveUrl,
    setLiveUrl,
    placeholderIndex,
    handleToggleStack,
    handleAddCustomStack,
    handleFormSubmit,
  };
}
