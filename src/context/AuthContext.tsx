import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// =========================================================
// 🛠️ DEVELOPMENT SWITCHES
// =========================================================
const BYPASS_LOCATION_GUARD = true;
const BYPASS_TIME_GUARD = true; // Set to true to bypass 9:40AM and 12PM rules

interface UserProfile {
  id: string; // This will be "4" in your current case
  fullName: string;
  email: string;
  createdAt: string;
}

interface AttendanceStatus {
  hasAttendance: boolean;
  isLogComplete: boolean;
  data: any | null;
}

// 📦 High-Fidelity Type Contract for History Entries
export interface WorkspaceHistoryItem {
  id: number;
  user_id: number;
  day_name: string;
  formatted_date: string;
  arrival_time: string;
  is_late: boolean;
  is_on_site: boolean;
  project_title: string;
  project_description: string;
  tech_stacks: string[];
  ui_reference_url?: string;
  is_log_empty: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isWithinWorkspace: boolean;
  isAuthenticated: boolean;
  attendance: AttendanceStatus; // Shared attendance state
  isAttendanceLoading: boolean;
  refreshAttendance: () => Promise<void>; // Function to manually re-sync
  loginSession: (userData: UserProfile, isWithin: boolean) => void;
  logoutSession: () => void;
  BYPASS_TIME_GUARD: boolean;
  // ✨ Optimized History Cache Contracts
  historyLogs: WorkspaceHistoryItem[];
  isHistoryLoading: boolean;
  fetchHistory: (
    range?: string,
    startDate?: string,
    endDate?: string,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isWithinWorkspace, setIsWithinWorkspace] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State to track if attendance is marked for the day
  const [attendance, setAttendance] = useState<AttendanceStatus>({
    hasAttendance: false,
    isLogComplete: false,
    data: null,
  });

  const [isAttendanceLoading, setIsAttendanceLoading] =
    useState<boolean>(false);

  // ✨ History Engine Local Caching States
  const [historyLogs, setHistoryLogs] = useState<WorkspaceHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  // Function to check the database for today's status
  const refreshAttendance = useCallback(async (userId: string) => {
    setIsAttendanceLoading(true); // Turn loader on before query fires
    try {
      const response = await fetch(`/api/workspace/status?userId=${userId}`);
      if (response.ok) {
        const { data } = await response.json();
        if (data) {
          setAttendance({
            hasAttendance: true,
            isLogComplete: !data.is_log_empty,
            data: data,
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
      setIsAttendanceLoading(false); // Shut loader off when network returns
    }
  }, []);

  // ✨ The Upgraded High-Speed Synchronized History Fetcher Logic
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
        // Build robust dynamic query parameters supporting custom parameters cleanly
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
    setHistoryLogs([]); // Clear history cache on logout
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
        refreshAttendance: () =>
          user ? refreshAttendance(user.id) : Promise.resolve(),
        loginSession,
        logoutSession,
        BYPASS_TIME_GUARD,
        // Expose history data array cache to your frontend layers
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
