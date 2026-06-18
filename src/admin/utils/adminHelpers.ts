// src/utils/adminHelpers.ts
export const getAdminTitle = (role: string | undefined) => {
  switch (role) {
    case "web_development":
      return "Web Dev Admin";
    case "ui_ux_design":
      return "UI/UX Design Admin";
    case "networking":
      return "Networking Admin";
    default:
      return "System Administrator";
  }
};
