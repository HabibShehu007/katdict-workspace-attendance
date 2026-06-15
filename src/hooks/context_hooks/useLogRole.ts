// src/hooks/context_hooks/useLogRole.ts

// Update this type definition to include your new role
export type LogRole = "dev" | "design" | "networking" | null;

export function useLogRole(log: any): LogRole {
  // Update your logic that determines the role
  if (!log) return null;

  // Ensure this returns the string "networking" when appropriate
  if (log.role === "networking") return "networking";
  if (log.role === "web_development") return "dev";
  if (log.role === "ui_ux_design") return "design";

  return null;
}
