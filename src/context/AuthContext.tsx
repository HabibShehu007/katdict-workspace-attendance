import { createContext, useContext, useState, useEffect } from "react";

// 1. Structural blueprint definition for our User profile data
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

// 2. Blueprint for the complete Auth Engine state
interface AuthContextType {
  user: UserProfile | null;
  isWithinWorkspace: boolean;
  isAuthenticated: boolean;
  loginSession: (userData: UserProfile, isWithin: boolean) => void;
  logoutSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isWithinWorkspace, setIsWithinWorkspace] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 3. Sync memory layout: Mount state out of localStorage upon initial boot load
  useEffect(() => {
    const storedUser = localStorage.getItem("katdict_user");
    const storedGeo = localStorage.getItem("katdict_geo_status");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedGeo) {
      setIsWithinWorkspace(storedGeo === "true");
    }
    setIsLoading(false);
  }, []);

  // 4. Action: Initialize workspace session credentials
  const loginSession = (userData: UserProfile, isWithin: boolean) => {
    setUser(userData);
    setIsWithinWorkspace(isWithin);

    localStorage.setItem("katdict_user", JSON.stringify(userData));
    localStorage.setItem("katdict_geo_status", String(isWithin));
  };

  // 5. Action: Clear session parameters on exit
  const logoutSession = () => {
    setUser(null);
    setIsWithinWorkspace(false);
    localStorage.removeItem("katdict_user");
    localStorage.removeItem("katdict_geo_status");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isWithinWorkspace,
        isAuthenticated,
        loginSession,
        logoutSession,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to cleanly consume credentials inside layout sub-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be executed within an explicit AuthProvider layer.",
    );
  }
  return context;
}
