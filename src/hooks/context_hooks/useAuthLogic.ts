import { useState, useEffect, useCallback } from "react";
import type {
  UserProfile,
  AttendanceStatus,
  WorkspaceHistoryItem,
} from "../../types/auth.types";

export const BYPASS_LOCATION_GUARD = false;
export const BYPASS_TIME_GUARD = false;

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

  // Helper for UI components
  const isAdmin = user?.role === "admin";

  const refreshAttendance = useCallback(async (userId: string) => {
    setIsAttendanceLoading(true);
    try {
      const response = await fetch(`/api/workspace/status?userId=${userId}`);
      if (response.ok) {
        const { data } = await response.json();
        if (data) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  current_streak: data.current_streak,
                  highest_streak: data.highest_streak,
                }
              : null,
          );
          const exists = !!data.attendance_exists;
          setAttendance({
            hasAttendance: exists,
            isLogComplete: exists ? !data.is_log_empty : false,
            data: exists ? data : null,
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
      let currentUserId =
        user?.id || (storedUser ? JSON.parse(storedUser).id : null);
      if (!currentUserId) return;

      setIsHistoryLoading(true);
      try {
        let url = `/api/workspace/history?userId=${currentUserId}&range=${range}`;
        if (range === "custom" && startDate && endDate)
          url += `&startDate=${startDate}&endDate=${endDate}`;
        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          if (result.success) setHistoryLogs(result.data);
        }
      } catch (err) {
        console.error("History engine tracking fetch failed:", err);
      } finally {
        setIsHistoryLoading(false);
      }
    },
    [user?.id],
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("katdict_user");
    const storedGeo = localStorage.getItem("katdict_geo_status");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      refreshAttendance(parsedUser.id);

      // Apply Admin override logic on initial load
      if (parsedUser.role === "admin") {
        setIsWithinWorkspace(true);
      } else {
        setIsWithinWorkspace(BYPASS_LOCATION_GUARD || storedGeo === "true");
      }
    }
    setIsLoading(false);
  }, [refreshAttendance]);

  const loginSession = (userData: UserProfile, isWithin: boolean) => {
    setUser(userData);
    // Force true for Admins, otherwise use bypass or actual location
    const finalLocationStatus =
      userData.role === "admin" ? true : BYPASS_LOCATION_GUARD || isWithin;
    setIsWithinWorkspace(finalLocationStatus);
    localStorage.setItem("katdict_user", JSON.stringify(userData));
    localStorage.setItem("katdict_geo_status", String(finalLocationStatus));
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
