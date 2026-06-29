// src/types/admin.types.ts

// Base fields shared by everyone
interface AdminBaseLog {
  id: number;
  user_id: number;
  log_date: string;
  arrival_time: string;
  project_title: string;
  project_description: string;
  is_late: boolean;
  is_on_site: boolean;
  is_log_empty: boolean;
  ui_reference_url?: string;
  user_name: string;
  user_email: string;
  user_avatar?: string;
}

interface WebDevAdminLog extends AdminBaseLog {
  user_role: "web_development";
  tech_stacks: string[];
  github_url?: string;
  live_preview_url?: string;
}

interface DesignAdminLog extends AdminBaseLog {
  user_role: "ui_ux_design";
  design_tools?: string[];
  asset_drive_url?: string;
}

interface NetworkingAdminLog extends AdminBaseLog {
  user_role: "networking";
  protocols?: string[];
  hardware?: string[];
  automation?: string[];
  infrastructure_url?: string;
  automation_url?: string;
  doc_url?: string;
}

interface DataScienceAdminLog extends AdminBaseLog {
  user_role: "data_science";
  libraries?: string[];
  concepts?: string[];
  tools_ds?: string[];
  dataset_url?: string;
  notebook_url?: string;
  dashboard_url?: string;
}

export type AdminLogItem =
  | WebDevAdminLog
  | DesignAdminLog
  | NetworkingAdminLog
  | DataScienceAdminLog;

// New: Admins Session Profile
export interface AdminProfile {
  id: number;
  email: string;
  role: string;
  managed_role: string;
  isAdmin: true;
}

// New: Admin Context Shape
export interface AdminContextType {
  admin: AdminProfile | null;
  isLoading: boolean;
  loginAdmin: (adminData: AdminProfile) => void;
  logoutAdmin: () => void;
}
