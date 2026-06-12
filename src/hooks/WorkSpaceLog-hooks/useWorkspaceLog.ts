import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export interface SubmittedLog {
  title: string;
  desc: string;
  stacks?: string[]; // Made optional to support designers
  tools?: string[]; // Added for designers
  uiUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  assetsUrl?: string;
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
          isLate,
        }),
      });

      if (!response.ok) throw new Error("Server rejected attendance.");

      await refreshAttendance();
      // FIX: fetchHistory only accepts 3 arguments
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

      try {
        const response = await fetch("/api/workspace/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, day: dayName, ...data }),
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
    isLogComplete: attendance.isLogComplete, // Expose this status to the UI
    isAttendanceLoading,
    logData: attendance.data
      ? {
          title: attendance.data.projectTitle || "",
          desc: attendance.data.projectDescription || "",
          stacks: attendance.data.workData?.stacks || [],
          tools: attendance.data.workData?.tools || [],
          uiUrl: attendance.data.workData?.uiUrl || "",
          githubUrl: attendance.data.workData?.githubUrl || "",
          liveUrl: attendance.data.workData?.liveUrl || "",
          assetsUrl: attendance.data.workData?.assetsUrl || "",
          dayName: attendance.data.dayName,
          createdAt: attendance.data.createdAt,
        }
      : null,
    isSubmitting,
    error,
    saveAttendanceOnly,
    submitWorkLog,
  };
}
