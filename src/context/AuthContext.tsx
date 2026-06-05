import { createContext, useContext } from "react";
import type {
  AuthContextType,
  WorkspaceHistoryItem,
} from "../types/auth.types";
import {
  useAuthLogic,
  BYPASS_TIME_GUARD,
} from "../hooks/context_hooks/useAuthLogic";

export type { WorkspaceHistoryItem };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const logic = useAuthLogic();

  return (
    <AuthContext.Provider
      value={{
        ...logic,
        isAuthenticated: !!logic.user,
        BYPASS_TIME_GUARD,
        refreshAttendance: async () => {
          const storedUser = localStorage.getItem("katdict_user");
          const targetId =
            logic.user?.id || (storedUser ? JSON.parse(storedUser).id : null);
          return targetId ? await logic.refreshAttendance(targetId) : false;
        },
      }}
    >
      {!logic.isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used inside an AuthProvider component.");
  return context;
}
