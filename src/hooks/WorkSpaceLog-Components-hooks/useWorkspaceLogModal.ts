import { useState, useEffect, useCallback } from "react";
import { PLACEHOLDER_SUGGESTIONS } from "../../constants/techStacks";

interface UseWorkspaceLogModalProps {
  isOpen: boolean;
  userRole: "web_development" | "ui_ux_design" | "networking" | "data_science";
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

  // Existing URLs
  const [uiUrl, setUiUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  // New Networking URLs
  const [infrastructureUrl, setInfrastructureUrl] = useState("");
  const [automationUrl, setAutomationUrl] = useState("");

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
        setUiUrl(initialData.uiUrl || "");
        setGithubUrl(initialData.githubUrl || "");
        setLiveUrl(initialData.liveUrl || "");
        // Handle new networking fields
        setInfrastructureUrl(initialData.infrastructureUrl || "");
        setAutomationUrl(initialData.automationUrl || "");
      } else {
        setTitle("");
        setDesc("");
        setSelectedStacks([]);
        setUiUrl("");
        setGithubUrl("");
        setLiveUrl("");
        setInfrastructureUrl("");
        setAutomationUrl("");
      }
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return;
    const rolePlaceholders = PLACEHOLDER_SUGGESTIONS[userRole] || [];
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rolePlaceholders.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen, userRole]);

  const handleAddCustomStack = useCallback((newStack: string) => {
    setSelectedStacks((prev) =>
      prev.includes(newStack) ? prev : [...prev, newStack],
    );
  }, []);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !desc.trim()) return;

      onSubmit({
        title: title.trim(),
        desc: desc.trim(),
        stacks: selectedStacks,
        uiUrl: uiUrl.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        infrastructureUrl: infrastructureUrl.trim() || undefined,
        automationUrl: automationUrl.trim() || undefined,
      });
    },
    [
      title,
      desc,
      selectedStacks,
      uiUrl,
      githubUrl,
      liveUrl,
      infrastructureUrl,
      automationUrl,
      onSubmit,
    ],
  );

  return {
    title,
    setTitle,
    desc,
    setDesc,
    stacks: selectedStacks,
    setStacks: setSelectedStacks,
    githubUrl,
    setGithubUrl,
    liveUrl,
    setLiveUrl,
    uiUrl,
    setUiUrl,
    // Added for Networking Forms
    infrastructureUrl,
    setInfrastructureUrl,
    automationUrl,
    setAutomationUrl,
    // Aliases
    figmaUrl: uiUrl,
    setFigmaUrl: setUiUrl,
    assetsUrl: liveUrl,
    setAssetsUrl: setLiveUrl,
    placeholderIndex,
    handleAddCustomStack,
    handleFormSubmit,
  };
}
