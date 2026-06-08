// types/auth.types.ts

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  current_streak?: number;
  highest_streak?: number;
  createdAt: string;
  // Professional adaptations
  role?: string;
  avatarUrl?: string;
  bio?: string;
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
  formatted_date: string;
  arrival_time: string;
  is_late: boolean;
  is_on_site: boolean;
  project_title: string;
  project_description: string;
  tech_stacks: string[];
  ui_reference_url?: string;
  github_url?: string;
  live_preview_url?: string;
  is_log_empty: boolean;
}

export interface AuthContextType {
  // Auth & Session
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginSession: (userData: UserProfile, isWithin: boolean) => void;
  logoutSession: () => void;
  setUser: (user: UserProfile | null) => void; // Added for internal state syncing

  // Profile Management
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  isUpdating: boolean;

  // Attendance & Workspace
  isWithinWorkspace: boolean;
  attendance: AttendanceStatus;
  isAttendanceLoading: boolean;
  refreshAttendance: () => Promise<boolean>;
  BYPASS_TIME_GUARD: boolean;
  BYPASS_LOCATION_GUARD: boolean;

  // History Tracking
  historyLogs: WorkspaceHistoryItem[];
  isHistoryLoading: boolean;
  fetchHistory: (
    range?: string,
    startDate?: string,
    endDate?: string,
    force?: boolean,
  ) => Promise<void>;
}
