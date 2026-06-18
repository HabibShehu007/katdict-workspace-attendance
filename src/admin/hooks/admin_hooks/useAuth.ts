// src/hooks/admin_hooks/useAuth.ts
import { useState, useEffect } from "react";

export interface AuthUser {
  id: number;
  email: string;
  role?: string;
  managed_role?: string;
  isAdmin: boolean;
  fullName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // USE THE SAME KEY: 'katdict_user'
    const storedUser = localStorage.getItem("katdict_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse admin session", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    localStorage.setItem("katdict_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("katdict_user");
    setUser(null);
    window.location.href = "/admin/login"; // Redirect to admin-specific login
  };

  return {
    user,
    admin: user?.isAdmin ? user : null,
    loading,
    login,
    logout,
  };
}
