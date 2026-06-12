import { useState, useEffect, useCallback } from "react";
import type {
  UserProfile,
  AttendanceStatus,
  WorkspaceHistoryItem,
} from "../../types/auth.types";

export const BYPASS_LOCATION_GUARD = true;
export const BYPASS_TIME_GUARD = true;

export function useAuthLogic() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isWithinWorkspace, setIsWithinWorkspace] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [attendance, setAttendance] = useState<AttendanceStatus>({
    hasAttendance: false,
    isLogComplete: false,
    data: null,
  });
  const [isAttendanceLoading, setIsAttendanceLoading] =
    useState<boolean>(false);
  const [historyLogs, setHistoryLogs] = useState<WorkspaceHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  const isAdmin = user?.role === "admin";

  const refreshAttendance = useCallback(async (userId: number) => {
    setIsAttendanceLoading(true);
    try {
      const response = await fetch(`/api/workspace/status?userId=${userId}`);
      if (response.ok) {
        const { data } = await response.json();
        if (data) {
          // Update streaks in user state
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  currentStreak: data.current_streak,
                  highestStreak: data.highest_streak,
                }
              : null,
          );

          const exists = !!data.attendance_exists;
          setAttendance({
            hasAttendance: exists,
            isLogComplete: exists ? !data.is_log_empty : false,
            data: exists ? data : null, // data now contains the nested JSONB workData
          });
          return true;
        }
      }
      setAttendance({ hasAttendance: false, isLogComplete: false, data: null });
      return false;
    } catch (err) {
      console.error("Attendance sync failed", err);
      return false;
    } finally {
      setIsAttendanceLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(
    async (
      range = "current_week",
      startDate?: string,
      endDate?: string,
      force = false,
    ) => {
      if (range === "current_week" && historyLogs.length > 0 && !force) return;

      const storedUser = localStorage.getItem("katdict_user");
      const userId =
        user?.id || (storedUser ? JSON.parse(storedUser).id : null);
      if (!userId) return;

      setIsHistoryLoading(true);
      try {
        let url = `/api/workspace/history?userId=${userId}&range=${range}`;
        if (range === "custom" && startDate && endDate)
          url += `&startDate=${startDate}&endDate=${endDate}`;

        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          if (result.success) setHistoryLogs(result.data); // result.data now contains full objects with JSONB
        }
      } catch (err) {
        console.error("History engine fetch failed:", err);
      } finally {
        setIsHistoryLoading(false);
      }
    },
    [user?.id, historyLogs.length],
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("katdict_user");
    const storedGeo = localStorage.getItem("katdict_geo_status");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      refreshAttendance(parsedUser.id);

      const status =
        parsedUser.role === "admin"
          ? true
          : BYPASS_LOCATION_GUARD || storedGeo === "true";
      setIsWithinWorkspace(status);
    }
    setIsLoading(false);
  }, [refreshAttendance]);

  const loginSession = (userData: UserProfile, isWithin: boolean) => {
    setUser(userData);
    const finalStatus =
      userData.role === "admin" ? true : BYPASS_LOCATION_GUARD || isWithin;
    setIsWithinWorkspace(finalStatus);
    localStorage.setItem("katdict_user", JSON.stringify(userData));
    localStorage.setItem("katdict_geo_status", String(finalStatus));
    refreshAttendance(userData.id);
  };

  const logoutSession = () => {
    setUser(null);
    setIsWithinWorkspace(false);
    setAttendance({ hasAttendance: false, isLogComplete: false, data: null });
    setHistoryLogs([]);
    localStorage.removeItem("katdict_user");
    localStorage.removeItem("katdict_geo_status");
  };

  return {
    user,
    isAdmin,
    isWithinWorkspace,
    isLoading,
    attendance,
    isAttendanceLoading,
    historyLogs,
    isHistoryLoading,
    refreshAttendance,
    fetchHistory,
    loginSession,
    logoutSession,
    setUser,
  };
}
