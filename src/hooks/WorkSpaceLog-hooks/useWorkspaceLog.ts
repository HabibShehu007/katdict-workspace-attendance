import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export interface SubmittedLog {
  title: string;
  desc: string;
  stacks: string[];
  uiUrl?: string;
  githubUrl: string;
  liveUrl?: string;
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

  // 1. Save Attendance Only
  const saveAttendanceOnly = useCallback(async () => {
    if (!user) return false;
    setIsSubmitting(true);
    setError(null);

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
          isLate: isLate,
        }),
      });

      if (!response.ok) throw new Error("Server rejected attendance.");

      // Sync status and force-refresh history engine
      await refreshAttendance();
      await fetchHistory("current_week", undefined, undefined, true);

      if (isLate) {
        toast.warning(`Attendance marked late for ${dayName}.`);
      } else {
        toast.success(`Excellent timing! Verified for ${dayName}.`);
      }
      return true;
    } catch (err: any) {
      toast.error(err.message || "Attendance failed.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, dayName, refreshAttendance, fetchHistory, BYPASS_TIME_GUARD]);

  // 2. Submit Daily Progress Logs
  const submitWorkLog = useCallback(
    async (data: SubmittedLog) => {
      if (!user) return false;
      setIsSubmitting(true);

      try {
        const now = new Date();
        if (!BYPASS_TIME_GUARD && now.getHours() >= 12) {
          toast.error(
            "Submission closed! Logs cannot be submitted or modified after 12:00 PM.",
          );
          return false;
        }

        const response = await fetch("/api/workspace/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            day: dayName,
            ...data,
          }),
        });

        if (!response.ok) throw new Error("Server rejected log write.");

        // Sync status and force-refresh history engine
        await refreshAttendance();
        await fetchHistory("current_week", undefined, undefined, true);

        toast.success(`Progress logs for ${dayName} saved successfully!`);
        return true;
      } catch (err: any) {
        toast.error(err.message || "Failed to submit logs.");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, dayName, refreshAttendance, fetchHistory, BYPASS_TIME_GUARD],
  );

  return {
    hasAttendance: attendance.hasAttendance,
    isAttendanceLoading,
    logData: attendance.isLogComplete
      ? {
          title: attendance.data?.project_title,
          desc: attendance.data?.project_description,
          stacks: attendance.data?.tech_stacks || [],
          uiUrl: attendance.data?.ui_reference_url,
          githubUrl: attendance.data?.github_url || "",
          liveUrl: attendance.data?.live_preview_url || "",
        }
      : null,
    isSubmitting,
    error,
    saveAttendanceOnly,
    submitWorkLog,
  };
}
