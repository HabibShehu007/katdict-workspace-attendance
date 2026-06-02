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
const BYPASS_TIME_GUARD = true; // NEW: Set to true to bypass 9:40AM and 12PM rules

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
  isAttendanceLoading: boolean; // Add this line!
  refreshAttendance: () => Promise<void>; // Function to manually re-sync
  loginSession: (userData: UserProfile, isWithin: boolean) => void;
  logoutSession: () => void;
  BYPASS_TIME_GUARD: boolean;
  // ✨ History Extension Contracts
  historyLogs: WorkspaceHistoryItem[];
  isHistoryLoading: boolean;
  fetchHistory: (range?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isWithinWorkspace, setIsWithinWorkspace] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // NEW: State to track if attendance is marked for the day
  const [attendance, setAttendance] = useState<AttendanceStatus>({
    hasAttendance: false,
    isLogComplete: false,
    data: null,
  });

  const [isAttendanceLoading, setIsAttendanceLoading] =
    useState<boolean>(false);

  // ✨ History Engine Local States
  const [historyLogs, setHistoryLogs] = useState<WorkspaceHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);

  // Function to check the database for today's status
  const refreshAttendance = useCallback(async (userId: string) => {
    setIsAttendanceLoading(true); // 👈 1. Turn loader on before query fires
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
          // Reset layout state safely if no records exist for today
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
      setIsAttendanceLoading(false); // 👈 2. Shut loader off when network returns!
    }
  }, []);

  // ✨ The Synchronized History Fetcher Logic
  const fetchHistory = useCallback(
    async (range: string = "7days") => {
      // Read the active dynamic state container inside storage closures
      const storedUser = localStorage.getItem("katdict_user");
      let currentUserId = user?.id;

      if (!currentUserId && storedUser) {
        currentUserId = JSON.parse(storedUser).id;
      }

      if (!currentUserId) return;

      setIsHistoryLoading(true);
      try {
        const response = await fetch(
          `/api/workspace/history?userId=${currentUserId}&range=${range}`,
        );
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
      // Immediately check database for this user's attendance on load
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

    // Sync attendance immediately after login
    refreshAttendance(userData.id);
  };

  const logoutSession = () => {
    setUser(null);
    setIsWithinWorkspace(false);
    setAttendance({ hasAttendance: false, isLogComplete: false, data: null });
    setHistoryLogs([]); // Clear history states cleanly on logout
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
        BYPASS_TIME_GUARD, // Exported so components can hide the "Closed" error
        // ✨ Expose history items down to the consumer hook layers
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
