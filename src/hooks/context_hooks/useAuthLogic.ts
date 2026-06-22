import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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

  // Ref for the inactivity timer - explicitly typed
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const isAdmin = useMemo(() => !!user?.isAdmin, [user]);

  const normalizeLog = useCallback(
    (raw: any): WorkspaceHistoryItem => {
      const workData = raw.work_data || raw.workData || {};
      const role =
        raw.role || raw.user_role || raw.userRole || user?.role || "";

      return {
        id: raw.id,
        userId: raw.user_id || raw.userId,
        dayName: raw.day_name || raw.dayName,
        logDate: raw.log_date || raw.logDate,
        projectTitle: raw.project_title || raw.projectTitle || workData.title,
        projectDescription:
          raw.project_description || raw.projectDescription || workData.desc,
        isLogEmpty: raw.is_log_empty ?? raw.isLogEmpty ?? true,
        isLate: raw.is_late ?? raw.isLate ?? false,
        isOnSite: raw.is_on_site ?? raw.isOnSite ?? true,
        workData,
        createdAt: raw.created_at || raw.createdAt,
        updatedAt: raw.updated_at || raw.updatedAt,
        role,
        title: raw.project_title || raw.projectTitle || workData.title,
        desc:
          raw.project_description || raw.projectDescription || workData.desc,
        stacks: workData.stacks || [],
        tools: workData.tools || [],
        uiUrl: workData.uiUrl || workData.figmaUrl || "",
      };
    },
    [user?.role],
  );

  const refreshAttendance = useCallback(
    async (userId: number) => {
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
                    currentStreak: data.current_streak,
                    highestStreak: data.highest_streak,
                  }
                : null,
            );
            const exists = !!data.attendance_exists;
            setAttendance({
              hasAttendance: exists,
              isLogComplete: exists ? !data.is_log_empty : false,
              data: exists ? normalizeLog(data) : null,
            });
            return true;
          }
        }
        setAttendance({
          hasAttendance: false,
          isLogComplete: false,
          data: null,
        });
        return false;
      } catch (err) {
        console.error("Attendance sync failed", err);
        return false;
      } finally {
        setIsAttendanceLoading(false);
      }
    },
    [normalizeLog],
  );

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
          if (result.success && Array.isArray(result.data)) {
            setHistoryLogs(result.data.map((item: any) => normalizeLog(item)));
          }
        }
      } catch (err) {
        console.error("History engine fetch failed:", err);
      } finally {
        setIsHistoryLoading(false);
      }
    },
    [user?.id, historyLogs.length, normalizeLog],
  );

  const logoutSession = useCallback(() => {
    setUser(null);
    setIsWithinWorkspace(false);
    setAttendance({ hasAttendance: false, isLogComplete: false, data: null });
    setHistoryLogs([]);
    localStorage.removeItem("katdict_user");
    localStorage.removeItem("katdict_geo_status");

    // Fix: Check if timer exists before clearing
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }

    window.location.href = "/admin/login";
  }, []);

  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(logoutSession, 120000); // 2 minutes
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [user, logoutSession]);

  useEffect(() => {
    const storedUser = localStorage.getItem("katdict_user");
    const storedGeo = localStorage.getItem("katdict_geo_status");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        refreshAttendance(parsedUser.id);
        setIsWithinWorkspace(BYPASS_LOCATION_GUARD || storedGeo === "true");
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoading(false);
  }, [refreshAttendance]);

  const loginSession = (userData: UserProfile, isWithin: boolean) => {
    const sessionData = {
      ...userData,
      isAdmin: !!userData.isAdmin,
    };

    setUser(sessionData);
    const finalStatus = BYPASS_LOCATION_GUARD || isWithin;
    setIsWithinWorkspace(finalStatus);
    localStorage.setItem("katdict_user", JSON.stringify(sessionData));
    localStorage.setItem("katdict_geo_status", String(finalStatus));
    refreshAttendance(sessionData.id);
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
