import { useState, useCallback } from "react";

export interface SubmittedLog {
  title: string;
  desc: string;
  stacks: string[];
  uiUrl?: string;
}

// Flip this to false whenever you are ready to point to your real live serverless routes!
const IS_TESTING_MODE = true;

export function useWorkspaceLog(dayName: string) {
  const [hasAttendance, setHasAttendance] = useState<boolean>(false);
  const [logData, setLogData] = useState<SubmittedLog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Save Attendance Only (Handles arrival check-in timestamp)
  const saveAttendanceOnly = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (IS_TESTING_MODE) {
        // Simulate a 1-second server database write response
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(
          `[TEST MODE] Mock API: Attendance payload saved for ${dayName}`,
        );
      } else {
        const response = await fetch("/api/workspace/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            day: dayName,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error("Server rejected attendance log creation request.");
        }
      }

      setHasAttendance(true);
      console.log(`Attendance successfully secured for ${dayName}`);
    } catch (err: any) {
      setError(
        err.message || "Failed to lock in your attendance. Please try again.",
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [dayName]);

  // 2. Submit Both / Tasks Log (Handles full project metrics data)
  const submitWorkLog = useCallback(
    async (data: SubmittedLog) => {
      setIsSubmitting(true);
      setError(null);
      try {
        if (IS_TESTING_MODE) {
          // Simulate a 1-second server database write response
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log(
            `[TEST MODE] Mock API: Work log payload saved for ${dayName}`,
            data,
          );
        } else {
          const response = await fetch("/api/workspace/logs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              day: dayName,
              title: data.title,
              desc: data.desc,
              stacks: data.stacks,
              uiUrl: data.uiUrl,
            }),
          });

          if (!response.ok) {
            throw new Error("Server rejected work log database write request.");
          }
        }

        // If user skipped option 1 and went straight to both, flip attendance state true
        if (!hasAttendance) {
          setHasAttendance(true);
        }

        setLogData(data);
        console.log("Workspace logs successfully written to database:", data);
      } catch (err: any) {
        setError(
          err.message ||
            "Failed to submit your workspace logs. Please try again.",
        );
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [dayName, hasAttendance],
  );

  return {
    hasAttendance,
    logData,
    isSubmitting,
    error,
    saveAttendanceOnly,
    submitWorkLog,
  };
}
