import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initiate = async (email: string) => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login?action=initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("A verification code has been sent to your email.");
        return true;
      }
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not start the reset process.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const verify = async (email: string, otp: string) => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return null;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login?action=verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Code verified successfully.");
        return data.tempResetToken;
      }
      toast.error(data.error || "Invalid or expired code.");
    } catch {
      toast.error("Error verifying code.");
    } finally {
      setLoading(false);
    }
    return null;
  };

  const confirm = async (
    email: string,
    tempResetToken: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    if (newPassword !== confirmPassword) {
      toast.error("Your passwords do not match.");
      return false;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login?action=confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tempResetToken, newPassword }),
      });
      if (res.ok) {
        toast.success("Password updated! Please log in.");
        navigate("/login");
        return true;
      }
      toast.error("Failed to update password.");
    } catch {
      toast.error("System error.");
    } finally {
      setLoading(false);
    }
    return false;
  };

  return { initiate, verify, confirm, loading };
}
