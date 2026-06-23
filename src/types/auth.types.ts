// types/auth.types.ts

// 1. Core Roles
export type UserRole =
  | "admin"
  | "web_development"
  | "ui_ux_design"
  | "networking"
  | "data_science";

// Base Profile fields shared by all
interface BaseProfile {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

// 2. Profile Structures
export interface StandardUser extends BaseProfile {
  isAdmin: false;
  role: Exclude<UserRole, "admin">;
  currentStreak: number;
  highestStreak: number;
}

export interface AdminUser extends BaseProfile {
  isAdmin: true;
  role: "admin";
  currentStreak?: never; // Admins don't have streaks
  highestStreak?: never;
}

// The Discriminator: This is the source of truth for TypeScript
export type UserProfile = StandardUser | AdminUser;

// 3. Work Data
export interface WorkData {
  stacks?: string[];
  githubUrl?: string;
  liveUrl?: string;
  uiUrl?: string;
  tools?: string[];
  assetsUrl?: string;
  protocols?: string[];
  infrastructureUrl?: string;
  automationUrl?: string;
  libraries?: string[];
  concepts?: string[];
  tools_ds?: string[];
  datasetUrl?: string;
  notebookUrl?: string;
  dashboardUrl?: string;
  [key: string]: any;
}

// 4. History Logs
export interface WorkspaceHistoryItem {
  id: number;
  userId: number;
  dayName: string;
  logDate: string;
  projectTitle: string;
  projectDescription: string;
  isLogEmpty: boolean;
  workData: WorkData;
  createdAt: string;
  title?: string;
  isLate: boolean;
  isOnSite: boolean;
  desc?: string;
  stacks?: string[];
  tools?: string[];
  uiUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  updatedAt: string;
  role?: string;
}

export interface AttendanceStatus {
  hasAttendance: boolean;
  isLogComplete: boolean;
  data: WorkspaceHistoryItem | null;
}

// 5. Auth Context
export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginSession: (userData: UserProfile, isWithin: boolean) => void;
  logoutSession: () => void;
  setUser: (user: UserProfile | null) => void;

  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  isUpdating: boolean;
  BYPASS_TIME_GUARD: boolean;
  BYPASS_LOCATION_GUARD: boolean;
  isWithinWorkspace: boolean;
  attendance: AttendanceStatus;
  isAttendanceLoading: boolean;
  refreshAttendance: () => Promise<boolean>;

  historyLogs: WorkspaceHistoryItem[];
  isHistoryLoading: boolean;
  fetchHistory: (
    range?: string,
    startDate?: string,
    endDate?: string,
  ) => Promise<void>;
}
