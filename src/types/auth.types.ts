// types/auth.types.ts

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  current_streak?: number; // Add this
  highest_streak?: number; // Add this
  createdAt: string; // Used to prevent filtering before signup date (e.g., "2026-06-02")
}

export interface AttendanceStatus {
  hasAttendance: boolean;
  isLogComplete: boolean;
  data: any | null;
}

export interface WorkspaceHistoryItem {
  id: number;
  user_id: number;
  day_name: string;
  formatted_date: string; // expected format: YYYY-MM-DD
  arrival_time: string;
  is_late: boolean;
  is_on_site: boolean;
  project_title: string;
  project_description: string;
  tech_stacks: string[];
  ui_reference_url?: string;
  github_url?: string; // Added for tracking source control repositories
  live_preview_url?: string; // Added for tracking live deployment links
  is_log_empty: boolean;
}

export interface AuthContextType {
  user: UserProfile | null;
  isWithinWorkspace: boolean;
  isAuthenticated: boolean;
  attendance: AttendanceStatus;
  isAttendanceLoading: boolean;
  refreshAttendance: () => Promise<boolean>;
  loginSession: (userData: UserProfile, isWithin: boolean) => void;
  logoutSession: () => void;
  BYPASS_TIME_GUARD: boolean;
  historyLogs: WorkspaceHistoryItem[];
  isHistoryLoading: boolean;
  fetchHistory: (
    range?: string,
    startDate?: string,
    endDate?: string,
    force?: boolean,
  ) => Promise<void>;
}
