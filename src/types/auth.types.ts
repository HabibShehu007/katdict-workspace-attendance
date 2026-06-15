// types/auth.types.ts

// 1. Core Roles
export type UserRole =
  | "admin"
  | "web_development"
  | "ui_ux_design"
  | "networking";

// 2. Base Profile
export interface UserProfile {
  id: number; // Changed to number to match Drizzle serial ID
  fullName: string;
  email: string;
  currentStreak: number;
  highestStreak: number;
  createdAt: string;
  role: UserRole;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface WorkData {
  // Web Dev fields
  stacks?: string[];
  githubUrl?: string;
  liveUrl?: string;
  uiUrl?: string;
  // UI/UX fields
  tools?: string[];
  assetsUrl?: string;
  // Networking (New)
  protocols?: string[]; // e.g., BGP, OSPF, VLAN, IPv6
  infrastructureUrl?: string; // Link to topology (e.g., Lucidchart/Draw.io)
  automationUrl?: string; // Link to scripts (e.g., Ansible/Python/Git)
  // Flexible access for any extra metadata
  [key: string]: any;
}

// 4. History Logs
// We match this to the actual structure returned by the database
export interface WorkspaceHistoryItem {
  id: number;
  userId: number;
  dayName: string;
  logDate: string; // The formatted date
  projectTitle: string;
  projectDescription: string;
  isLogEmpty: boolean;
  workData: WorkData; // Here is our JSONB dynamic field
  createdAt: string;
  title?: string;
  isLate: boolean; // Add this
  isOnSite: boolean;
  desc?: string;
  stacks?: string[];
  tools?: string[];
  uiUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  updatedAt: string;
}

export interface AttendanceStatus {
  hasAttendance: boolean;
  isLogComplete: boolean;
  data: WorkspaceHistoryItem | null;
}

// 5. Auth Context (Your global state controller)
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
