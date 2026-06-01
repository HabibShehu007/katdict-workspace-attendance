import { createContext, useContext, useState, useEffect } from "react";

// =========================================================
// 🛠️ DEVELOPMENT SWITCH
// Set this to true to turn off the location check while working at home.
// Set this to false when you are ready to use the real location check again.
// =========================================================
const BYPASS_LOCATION_GUARD = true;

// 1. Define what a user profile looks like
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

// 2. Define what data our authentication state will share
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

  // 3. Load saved user details from browser storage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("katdict_user");
    const storedGeo = localStorage.getItem("katdict_geo_status");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Check if the development switch is turned on
    if (BYPASS_LOCATION_GUARD) {
      setIsWithinWorkspace(true); // Force the location to be valid
    } else if (storedGeo) {
      setIsWithinWorkspace(storedGeo === "true"); // Use real saved location status
    }

    setIsLoading(false);
  }, []);

  // 4. Action: Log the user in and save their session data
  const loginSession = (userData: UserProfile, isWithin: boolean) => {
    setUser(userData);

    // If our development switch is on, force it to be true. Otherwise, use the real value.
    const finalLocationStatus = BYPASS_LOCATION_GUARD ? true : isWithin;
    setIsWithinWorkspace(finalLocationStatus);

    localStorage.setItem("katdict_user", JSON.stringify(userData));
    localStorage.setItem("katdict_geo_status", String(finalLocationStatus));
  };

  // 5. Action: Log the user out and clear saved data
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

// Custom hook to easily use authentication data in other parts of our app
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider component.");
  }
  return context;
}
