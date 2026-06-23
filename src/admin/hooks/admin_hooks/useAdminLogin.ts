import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAdmin } from "../../context/AdminContext"; // Pointing to your new Context

export function useAdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginAdmin } = useAdmin(); // Accessing the new Admin provider
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

      // Update the global Admin context
      // data.user here is your AdminProfile type
      loginAdmin(data.user);

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
