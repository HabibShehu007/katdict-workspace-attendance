import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { NETWORKING_STACKS } from "../../constants/techStacks";

export interface SubmittedLog {
  title: string;
  desc: string;
  stacks: string[]; // Unified: both Devs and Designers use this
  uiUrl?: string; // Can represent Figma link for Designers
  githubUrl?: string; // Dev specific
  liveUrl?: string; // Can represent Assets/Drive link for Designers
  assetsUrl?: string; // Explicitly keeping for DB compatibility
  // New Networking URLs
  infrastructureUrl?: string;
  automationUrl?: string;
  docUrl?: string;
}

export function useWorkspaceLog(dayName: string) {
  const {
    user,
    attendance,
    refreshAttendance,
    fetchHistory,
    BYPASS_TIME_GUARD,
    isAttendanceLoading,
  } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingLabel, setLoadingLabel] = useState<string>("");

  const saveAttendanceOnly = useCallback(async () => {
    if (!user) return false;

    setIsSubmitting(true);
    setError(null);
    setLoadingLabel("Verifying attendance...");
    setIsSubmitting(true);

    try {
      const now = new Date();
      const isLate =
        !BYPASS_TIME_GUARD &&
        (now.getHours() > 9 ||
          (now.getHours() === 9 && now.getMinutes() >= 41));

      const response = await fetch("/api/workspace/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          day: dayName,
          timestamp: now.toISOString(),
          isLate,
        }),
      });

      if (!response.ok) throw new Error("Server rejected attendance.");

      await refreshAttendance();
      await fetchHistory("current_week");

      toast.success(
        isLate
          ? `Attendance marked late for ${dayName}.`
          : `Verified for ${dayName}.`,
      );
      return true;
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, dayName, refreshAttendance, fetchHistory, BYPASS_TIME_GUARD]);

  const submitWorkLog = useCallback(
    async (data: SubmittedLog) => {
      if (!user) return false;

      setIsSubmitting(true);
      setError(null);
      setLoadingLabel("Writing logs to workspace...");
      setIsSubmitting(true);

      const payload = {
        userId: user.id,
        day: dayName,
        title: data.title,
        desc: data.desc,
        workData: {
          stacks: data.stacks,
          uiUrl: data.uiUrl,
          githubUrl: data.githubUrl,
          liveUrl: data.liveUrl,
          assetsUrl: data.assetsUrl,
          infrastructureUrl: data.infrastructureUrl,
          automationUrl: data.automationUrl,
          docUrl: data.docUrl,
        },
      };

      try {
        const response = await fetch("/api/workspace/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Server rejected log write.");

        await refreshAttendance();
        await fetchHistory("current_week");

        toast.success(`Progress logs for ${dayName} saved successfully!`);
        return true;
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, dayName, refreshAttendance, fetchHistory],
  );

  return {
    hasAttendance: attendance.hasAttendance,
    isLogComplete: attendance.isLogComplete,
    isAttendanceLoading,
    logData: attendance.data
      ? (() => {
          const rawData = attendance.data as any;
          const workData = rawData.workData || {};
          const role = rawData.role || user?.role || "web_development";
          const isNetworking = role === "networking";
          const isDesigner = role === "ui_ux_design";

          const stacks = rawData.stacks || workData.stacks || [];

          // Categorization for Networking
          let protocols = rawData.protocols || workData.protocols || [];
          let hardware = rawData.hardware || workData.hardware || [];
          let automation = rawData.automation || workData.automation || [];

          if (
            isNetworking &&
            protocols.length === 0 &&
            hardware.length === 0 &&
            automation.length === 0
          ) {
            protocols = stacks.filter(
              (s: string) =>
                NETWORKING_STACKS.protocols.includes(s) ||
                (!NETWORKING_STACKS.hardware.includes(s) &&
                  !NETWORKING_STACKS.automation.includes(s)),
            );
            hardware = stacks.filter((s: string) =>
              NETWORKING_STACKS.hardware.includes(s),
            );
            automation = stacks.filter((s: string) =>
              NETWORKING_STACKS.automation.includes(s),
            );
          }

          // Categorization for Designers
          let tools = rawData.tools || workData.tools || [];
          if (isDesigner && tools.length === 0) {
            tools = stacks;
          }

          return {
            ...rawData,
            title:
              rawData.projectTitle ||
              rawData.title ||
              workData.title ||
              "Untitled Project",
            desc:
              rawData.projectDescription || rawData.desc || workData.desc || "",
            stacks,
            protocols,
            hardware,
            automation,
            tools,
            uiUrl: workData.uiUrl || rawData.uiUrl || "",
            githubUrl: workData.githubUrl || rawData.githubUrl || "",
            liveUrl: workData.liveUrl || rawData.liveUrl || "",
            docUrl: workData.docUrl || rawData.docUrl || "",
            infrastructureUrl:
              workData.infrastructureUrl || rawData.infrastructureUrl || "",
            automationUrl:
              workData.automationUrl || rawData.automationUrl || "",
            dayName: rawData.dayName,
            createdAt: rawData.createdAt,
            role,
          };
        })()
      : null,
    isSubmitting,
    loadingLabel,
    error,
    saveAttendanceOnly,
    submitWorkLog,
  };
}
