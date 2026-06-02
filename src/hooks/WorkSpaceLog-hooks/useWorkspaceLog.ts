import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext"; // Import our brain

export interface SubmittedLog {
  title: string;
  desc: string;
  stacks: string[];
  uiUrl?: string;
}

export function useWorkspaceLog(dayName: string) {
  const {
    user,
    attendance,
    refreshAttendance,
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
      // Rules only apply if Bypass is OFF
      const isLate =
        !BYPASS_TIME_GUARD &&
        (now.getHours() > 9 ||
          (now.getHours() === 9 && now.getMinutes() >= 41));

      const response = await fetch("/api/workspace/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id, // Dynamically use the logged-in user
          day: dayName,
          timestamp: now.toISOString(),
          isLate: isLate,
        }),
      });

      if (!response.ok) throw new Error("Server rejected attendance.");

      // Tell the context to refresh and sync the UI immediately
      await refreshAttendance();

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
  }, [user, dayName, refreshAttendance, BYPASS_TIME_GUARD]);

  // 2. Submit Daily Progress Logs
  const submitWorkLog = useCallback(
    async (data: SubmittedLog) => {
      if (!user) return false;
      setIsSubmitting(true);

      try {
        const now = new Date();
        // Strict 12 PM cut-off rule (ignored if BYPASS_TIME_GUARD is true)
        if (!BYPASS_TIME_GUARD && now.getHours() >= 12) {
          toast.error(
            "Submission closed! Logs must be submitted before 12:00 PM.",
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

        await refreshAttendance();
        toast.success(`Progress logs for ${dayName} submitted!`);
        return true;
      } catch (err: any) {
        toast.error(err.message || "Failed to submit logs.");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, dayName, refreshAttendance, BYPASS_TIME_GUARD],
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
        }
      : null,
    isSubmitting,
    error,
    saveAttendanceOnly,
    submitWorkLog,
  };
}
