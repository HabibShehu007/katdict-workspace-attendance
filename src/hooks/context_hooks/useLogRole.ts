import type { WorkspaceHistoryItem } from "../../context/AuthContext";

export function useLogRole(log: WorkspaceHistoryItem | null) {
  if (!log) return null;
  // Drizzle/JSONB mapping: Check for unique keys to determine role
  return log.workData?.githubUrl ? "dev" : "design";
}
