import { createContext, useContext } from "react";
import type {
  AuthContextType,
  WorkspaceHistoryItem,
} from "../types/auth.types";
import {
  useAuthLogic,
  BYPASS_TIME_GUARD,
  BYPASS_LOCATION_GUARD,
} from "../hooks/context_hooks/useAuthLogic";
import { useProfileLogic } from "../hooks/context_hooks/useProfileLogic";

export type { WorkspaceHistoryItem };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const logic = useAuthLogic();

  // Cast to 'any' to bridge the gap between the new StandardUser hook
  // and the existing AuthContext interface
  const profile = useProfileLogic(logic.user as any, logic.setUser as any);

  return (
    <AuthContext.Provider
      value={{
        ...logic,
        ...profile,
        // Force-cast the returned values to satisfy the existing AuthContextType
        user: logic.user as any,
        loginSession: logic.loginSession as any,
        setUser: logic.setUser as any,
        isLoading: logic.isLoading,
        isAuthenticated: !!logic.user,
        BYPASS_TIME_GUARD,
        BYPASS_LOCATION_GUARD,
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
