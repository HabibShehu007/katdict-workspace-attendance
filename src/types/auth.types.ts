// types/auth.types.ts

export type UserRole = "admin" | "web_development" | "ui_ux_design";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  current_streak?: number;
  highest_streak?: number;
  createdAt: string;
  role: UserRole; // Enforced role
  avatarUrl?: string;
  bio?: string;
}

export interface AttendanceStatus {
  hasAttendance: boolean;
  isLogComplete: boolean;
  data: any | null;
}

// 1. Base interface containing every field shared by ALL roles
interface BaseHistoryItem {
  id: number;
  user_id: number;
  day_name: string;
  formatted_date: string;
  arrival_time: string;
  is_late: boolean;
  is_on_site: boolean;
  project_title: string;
  project_description: string;
  is_log_empty: boolean;
  ui_reference_url?: string; // Shared by everyone
}

// 2. Developer-specific variant
interface WebDevHistory extends BaseHistoryItem {
  role: "web_development";
  tech_stacks: string[]; // Preserved from your original definition
  github_url?: string;
  live_preview_url?: string;
}

// 3. Designer-specific variant
interface DesignHistory extends BaseHistoryItem {
  role: "ui_ux_design";
  // You can add design-specific arrays here
  design_tools?: string[];
  asset_drive_url?: string;
}

// 4. The union type used by your history logs
export type WorkspaceHistoryItem = WebDevHistory | DesignHistory;

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
