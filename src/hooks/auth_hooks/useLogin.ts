import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import type { UserProfile } from "../../types/auth.types"; // Ensure UserProfile is imported

interface UseLoginArgs {
  onSuccess: (user: UserProfile) => void; // Updated: Now accepts the user object
}

export function useLogin({ onSuccess }: UseLoginArgs) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginSession } = useAuth();

  const captureLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(
          new Error(
            "Your browser or device does not support location tracking services.",
          ),
        );
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(
                new Error(
                  "Location access denied. You must grant location permissions to sign into the workspace.",
                ),
              );
              break;
            case error.POSITION_UNAVAILABLE:
              reject(
                new Error(
                  "Workspace location network signal could not be determined. Try again.",
                ),
              );
              break;
            case error.TIMEOUT:
              reject(
                new Error(
                  "Location verification request timed out. Please check your GPS signal strength.",
                ),
              );
              break;
            default:
              reject(
                new Error(
                  "An unexpected security error occurred while verifying location parameters.",
                ),
              );
          }
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 },
      );
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill out all credential inputs.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Authenticating...");

    try {
      // 1. Attempt Admin Login first (No location required)
      const adminResponse = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        loginSession(adminData.user, true); // Force bypass location check
        toast.success("Admin access granted.");
        onSuccess(adminData.user);
        return;
      }

      // 2. If Admin login fails, proceed with User Login + Location Check
      toast.loading("Calculating workspace proximity...", { id: toastId });
      const locationData = await captureLocation();

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        }),
      });

      const userData = await response.json();
      if (!response.ok) throw new Error(userData.error || "Login failed.");

      loginSession(userData.user, userData.isWithinWorkspace);
      toast.success(userData.message || "Welcome back!");

      onSuccess(userData.user);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLoginSubmit,
  };
}
