import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, KeyRound, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useForgotPassword } from "../hooks/auth_hooks/useForgotPassword";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [tempToken, setTempToken] = useState("");
  const { initiate, verify, confirm, loading } = useForgotPassword();

  const handleNext = async () => {
    if (step === 1) {
      if (await initiate(formData.email)) setStep(2);
    } else if (step === 2) {
      const token = await verify(formData.email, formData.otp);
      if (token) {
        setTempToken(token);
        setStep(3);
      }
    } else {
      await confirm(
        formData.email,
        tempToken,
        formData.password,
        formData.confirmPassword,
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
          Reset Password
        </h2>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">
                Enter Your Registered Email
              </label>
              <div className="relative mb-4">
                <Mail
                  className="absolute left-4 top-4 text-zinc-400"
                  size={18}
                />
                <input
                  type="email"
                  className="w-full p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">
                Verification Code
              </label>
              <div className="relative mb-4">
                <KeyRound
                  className="absolute left-4 top-4 text-zinc-400"
                  size={18}
                />
                <input
                  type="text"
                  maxLength={6}
                  className="w-full p-4 pl-12 text-center text-xl tracking-widest rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  placeholder="000000"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative mb-3">
                <KeyRound
                  className="absolute left-4 top-4 text-zinc-400"
                  size={18}
                />
                <input
                  type="password"
                  className="w-full p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  placeholder="New Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="relative mb-4">
                <CheckCircle
                  className="absolute left-4 top-4 text-zinc-400"
                  size={18}
                />
                <input
                  type="password"
                  className="w-full p-4 pl-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : step === 3 ? (
            <CheckCircle size={20} />
          ) : (
            <ArrowRight size={20} />
          )}
          {loading
            ? "Processing..."
            : step === 3
              ? "Complete Update"
              : "Continue"}
        </button>
      </div>
    </div>
  );
}
