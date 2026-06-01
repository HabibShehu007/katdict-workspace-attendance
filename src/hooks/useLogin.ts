import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext"; // Import hook hook

interface UseLoginArgs {
  onSuccess: () => void;
}

export function useLogin({ onSuccess }: UseLoginArgs) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginSession } = useAuth(); // Destructure initialization payload handler

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
    const toastId = toast.loading("Verifying security parameters...");

    try {
      toast.loading("Calculating physical workspace proximity...", {
        id: toastId,
      });
      const locationData = await captureLocation();

      const latitude = locationData.coords.latitude;
      const longitude = locationData.coords.longitude;

      toast.loading("Authenticating credentials...", { id: toastId });
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, latitude, longitude }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      // WRITE TO GLOBAL STATE ENGINE INSTANTLY
      loginSession(data.user, data.isWithinWorkspace);

      toast.success(data.message || "Welcome back to your workspace!", {
        id: toastId,
      });

      setEmail("");
      setPassword("");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Login failed. Check your connection.", {
        id: toastId,
      });
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
