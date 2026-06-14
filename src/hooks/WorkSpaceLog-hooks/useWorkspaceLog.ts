import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export interface SubmittedLog {
  title: string;
  desc: string;
  stacks: string[]; // Unified: both Devs and Designers use this
  uiUrl?: string; // Can represent Figma link for Designers
  githubUrl?: string; // Dev specific
  liveUrl?: string; // Can represent Assets/Drive link for Designers
  assetsUrl?: string; // Explicitly keeping for DB compatibility
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

      // Group the work-related fields into a workData object
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
      ? {
          // Normalize data structure
          title:
            attendance.data.projectTitle ||
            attendance.data.workData?.title ||
            "",
          desc:
            attendance.data.projectDescription ||
            attendance.data.workData?.desc ||
            "",
          stacks: attendance.data.workData?.stacks || [],
          uiUrl:
            attendance.data.workData?.uiUrl ||
            attendance.data.workData?.figmaUrl ||
            "",
          githubUrl: attendance.data.workData?.githubUrl || "",
          liveUrl:
            attendance.data.workData?.liveUrl ||
            attendance.data.workData?.assetsUrl ||
            "",
          assetsUrl: attendance.data.workData?.assetsUrl || "",
          dayName: attendance.data.dayName,
          createdAt: attendance.data.createdAt,

          // Use 'as any' to bypass the missing type check for 'role'
          role:
            (attendance.data as any).role || user?.role || "web_development",
        }
      : null,
    isSubmitting,
    loadingLabel,
    error,
    saveAttendanceOnly,
    submitWorkLog,
  };
}
