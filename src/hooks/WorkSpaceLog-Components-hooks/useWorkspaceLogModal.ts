import { useState, useEffect, useCallback } from "react";
import { PLACEHOLDER_SUGGESTIONS } from "../../constants/techStacks";

interface UseWorkspaceLogModalProps {
  isOpen: boolean;
  onSubmit: (data: {
    title: string;
    desc: string;
    stacks: string[];
    uiUrl?: string;
    githubUrl: string;
    liveUrl?: string;
  }) => void;
  initialData?: any;
}

export function useWorkspaceLogModal({
  isOpen,
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

  // THE PREFILL ENGINE: Now mapped to the keys actually present in your object
  useEffect(() => {
    if (isOpen) {
      if (
        initialData &&
        typeof initialData === "object" &&
        Object.keys(initialData).length > 0
      ) {
        // Use the exact keys shown in your console log: title, desc, stacks, etc.
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
        ];

        const extractedCustom = (initialData.stacks || []).filter(
          (stack: string) => !defaultAvailableStacks.includes(stack),
        );
        setCustomStacks(extractedCustom);

        setUiUrl(initialData.uiUrl || "");
        setGithubUrl(initialData.githubUrl || "");
        setLiveUrl(initialData.liveUrl || "");
      } else {
        // Reset state
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
  // Dynamic placeholder switcher: Preserved
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length,
      );
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen]);

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
      if (!title.trim() || !desc.trim() || !githubUrl.trim()) return;

      onSubmit({
        title: title.trim(),
        desc: desc.trim(),
        stacks: selectedStacks,
        uiUrl: uiUrl.trim() || undefined,
        githubUrl: githubUrl.trim(),
        liveUrl: liveUrl.trim() || undefined,
      });

      setTitle("");
      setDesc("");
      setSelectedStacks([]);
      setCustomStacks([]);
      setUiUrl("");
      setGithubUrl("");
      setLiveUrl("");
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
