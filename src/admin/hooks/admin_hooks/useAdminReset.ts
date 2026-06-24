import { useState } from "react";
import { toast } from "sonner";

export function useAdminReset() {
  const [loading, setLoading] = useState(false);

  const initiate = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset?action=initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("Verification code sent to your email.");
        return true;
      }
      toast.error("Failed to initiate reset.");
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const verify = async (email: string, otp: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset?action=verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Verification successful.");
        return data.tempResetToken;
      }
      toast.error(data.error || "Invalid code.");
    } catch {
      toast.error("Error verifying code.");
    } finally {
      setLoading(false);
    }
    return null;
  };

  const confirm = async (details: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset?action=confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      if (res.ok) {
        toast.success("Credentials updated successfully!");
        return true;
      }
      toast.error("Failed to update.");
    } catch {
      toast.error("System error.");
    } finally {
      setLoading(false);
    }
    return false;
  };

  return { initiate, verify, confirm, loading };
}
