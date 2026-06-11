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

  // Updated to accept 'role' as an argument
  const handleSignUpSubmit = async (e: React.FormEvent, role: string) => {
    e.preventDefault();

    // 1. Validation checks
    if (!fullName || !email || !password || !confirmPassword || !role) {
      toast.error("Please fill in all fields, including your role.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. API call including the new 'role' field
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role, // Now sending the role to the backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration system failed.");
      }

      toast.success(
        data.message ||
          "Welcome aboard! Your workspace account has been created.",
      );

      // Clean the form
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Registration could not be completed.");
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
