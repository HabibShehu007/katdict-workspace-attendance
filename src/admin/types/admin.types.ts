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

export type AdminLogItem = WebDevAdminLog | DesignAdminLog;
