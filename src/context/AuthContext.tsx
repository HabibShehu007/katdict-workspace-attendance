// context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  UserProfile,
  AttendanceStatus,
  AuthContextType,
} from "../types/auth.types";

// 🔥 Fixes the page import error: Re-exporting the type straight out of our type vault!
import type { WorkspaceHistoryItem } from "../types/auth.types";
export type { WorkspaceHistoryItem };

const BYPASS_LOCATION_GUARD = true;
const BYPASS_TIME_GUARD = true;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  // Dynamic status checker for real-time state synchronization
  const refreshAttendance = useCallback(async (userId: string) => {
    setIsAttendanceLoading(true);
    try {
      const response = await fetch(`/api/workspace/status?userId=${userId}`);
      if (response.ok) {
        const { data } = await response.json();
        if (data) {
          setAttendance({
            hasAttendance: true,
            isLogComplete: !data.is_log_empty,
            data: data, // Automatically incorporates new metadata tracking values
          });
        } else {
          setAttendance({
            hasAttendance: false,
            isLogComplete: false,
            data: null,
          });
        }
      }
    } catch (err) {
      console.error("Attendance sync failed", err);
    } finally {
      setIsAttendanceLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(
    async (
      range: string = "current_week",
      startDate?: string,
      endDate?: string,
    ) => {
      const storedUser = localStorage.getItem("katdict_user");
      let currentUserId = user?.id;

      if (!currentUserId && storedUser) {
        currentUserId = JSON.parse(storedUser).id;
      }

      if (!currentUserId) return;

      setIsHistoryLoading(true);
      try {
        let url = `/api/workspace/history?userId=${currentUserId}&range=${range}`;
        if (range === "custom" && startDate && endDate) {
          url += `&startDate=${startDate}&endDate=${endDate}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setHistoryLogs(result.data);
          }
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
    }

    if (BYPASS_LOCATION_GUARD) {
      setIsWithinWorkspace(true);
    } else if (storedGeo) {
      setIsWithinWorkspace(storedGeo === "true");
    }

    setIsLoading(false);
  }, [refreshAttendance]);

  const loginSession = (userData: UserProfile, isWithin: boolean) => {
    setUser(userData);
    const finalLocationStatus = BYPASS_LOCATION_GUARD ? true : isWithin;
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

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isWithinWorkspace,
        isAuthenticated,
        attendance,
        isAttendanceLoading,
        // Robust parameter pass fallback handling
        refreshAttendance: () => {
          const storedUser = localStorage.getItem("katdict_user");
          const targetId =
            user?.id || (storedUser ? JSON.parse(storedUser).id : null);
          return targetId ? refreshAttendance(targetId) : Promise.resolve();
        },
        loginSession,
        logoutSession,
        BYPASS_TIME_GUARD,
        historyLogs,
        isHistoryLoading,
        fetchHistory,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider component.");
  }
  return context;
}
