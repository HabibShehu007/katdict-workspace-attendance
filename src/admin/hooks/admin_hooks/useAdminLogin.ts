import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";

export function useAdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginSession } = useAuth();
  const navigate = useNavigate();

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unauthorized access attempt");
      }

      // Security: We ensure the session flag is explicitly true
      // and update the global auth state
      loginSession({ ...data.user, isAdmin: true }, true);

      toast.success("Welcome back, Administrator.");

      // Redirect to Admin Dashboard
      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { adminLogin, isLoading };
}
