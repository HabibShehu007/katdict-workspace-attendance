// src/hooks/context_hooks/useLogRole.ts

// Update this type definition to include your new role
export type LogRole = "dev" | "design" | "networking" | "data_science" | null;

export function useLogRole(log: any): LogRole {
  if (!log) return null;

  const activeRole = log.role || log.userRole;

  if (activeRole === "networking") return "networking";
  if (activeRole === "web_development") return "dev";
  if (activeRole === "ui_ux_design") return "design";
  if (activeRole === "data_science") return "data_science";

  return null;
}
