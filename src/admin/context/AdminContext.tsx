import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  AdminProfile,
  AdminContextType,
} from "../../admin/types/admin.types";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We use a distinct key for Admin to prevent session collision
    const storedAdmin = localStorage.getItem("katdict_admin_session");
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (e) {
        console.error("Failed to restore admin session", e);
      }
    }
    setIsLoading(false);
  }, []);

  const loginAdmin = (adminData: AdminProfile) => {
    setAdmin(adminData);
    localStorage.setItem("katdict_admin_session", JSON.stringify(adminData));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("katdict_admin_session");
    window.location.href = "/admin/login";
  };

  return (
    <AdminContext.Provider
      value={{ admin, isLoading, loginAdmin, logoutAdmin }}
    >
      {!isLoading && children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
