import { useState } from "react";
import { toast } from "sonner";

interface UseLoginArgs {
  onSuccess: () => void;
}

export function useLogin({ onSuccess }: UseLoginArgs) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill out all credential inputs.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      toast.success(data.message || "Welcome back to your workspace!");

      setEmail("");
      setPassword("");

      onSuccess(); // Redirect or update global user state
    } catch (err: any) {
      toast.error(err.message || "Login failed. Check your connection.");
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
