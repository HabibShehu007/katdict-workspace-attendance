import { useState, useEffect, useCallback } from "react";
import { PLACEHOLDER_SUGGESTIONS } from "../../constants/techStacks";

interface UseWorkspaceLogModalProps {
  isOpen: boolean;
  onSubmit: (data: {
    title: string;
    desc: string;
    stacks: string[];
    uiUrl?: string;
  }) => void;
}

export function useWorkspaceLogModal({
  isOpen,
  onSubmit,
}: UseWorkspaceLogModalProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [customStacks, setCustomStacks] = useState<string[]>([]);
  const [uiUrl, setUiUrl] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Dynamic placeholder switcher interval loop
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
      if (!title.trim() || !desc.trim()) return;

      // Send pristine data structure directly upstream to our main hook runner
      onSubmit({
        title: title.trim(),
        desc: desc.trim(),
        stacks: selectedStacks,
        uiUrl: uiUrl.trim() || undefined,
      });

      // Clean reset all fields on successful push
      setTitle("");
      setDesc("");
      setSelectedStacks([]);
      setCustomStacks([]);
      setUiUrl("");
    },
    [title, desc, selectedStacks, uiUrl, onSubmit],
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
    placeholderIndex,
    handleToggleStack,
    handleAddCustomStack,
    handleFormSubmit,
  };
}
