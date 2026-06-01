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

    // Clean human validation checks
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields to register your account.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify and try again.");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Security standard check: Password must be at least 6 characters.",
      );
      return;
    }

    setIsLoading(true);

    try {
      // Future Vercel serverless function fetch request will drop right here!
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated latency

      toast.success(
        "Welcome aboard! Your workspace account has been created successfully.",
      );
      onSuccess();
    } catch (err) {
      toast.error(
        "Registration could not be completed. Please check your network.",
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
