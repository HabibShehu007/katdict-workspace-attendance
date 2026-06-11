// src/types/admin.types.ts

export interface AdminLogItem {
  // --- Core Log Fields (Matches the old WorkspaceHistoryItem structure) ---
  id: number;
  user_id: number;
  log_date: string; // Keep this, but we can compute day_name/formatted_date in the UI
  arrival_time: string;
  project_title: string;
  project_description: string;
  tech_stacks: string[];
  is_late: boolean;
  is_on_site: boolean;
  is_log_empty: boolean;

  // Optional URL fields if your components expect them
  ui_reference_url?: string;
  github_url?: string;
  live_preview_url?: string;

  // --- Joined User Fields (The "Admin" Additions) ---
  user_name: string;
  user_email: string;
  user_avatar: string;
}
