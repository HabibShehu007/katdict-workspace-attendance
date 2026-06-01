import { useState } from "react";
import { toast } from "sonner";

interface UseSignUpArgs {
  onSuccess: () => void;
}

export function useSignUp({ onSuccess }: UseSignUpArgs) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Clean UI validation checks before opening network stream
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields to register your account.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify and try again.");
      return;
    }

    if (password.length < 6) {
      toast.error(" Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Fire the real API call to our Vercel serverless function endpoint
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      // 3. Catch structural rejections (400, 409 duplicate email, 500 database errors)
      if (!response.ok) {
        throw new Error(data.error || "Registration system failed.");
      }

      // 4. On absolute success, celebrate and reroute
      toast.success(
        data.message ||
          "Welcome aboard! Your workspace account has been created.",
      );

      // Clean the form state out
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      onSuccess(); // Triggers the router redirect to /login
    } catch (err: any) {
      // Direct message stream from backend or fallback network message
      toast.error(
        err.message ||
          "Registration could not be completed. Check your server connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    handleSignUpSubmit,
  };
}
