import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  KeyRound,
  Mail,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useAdminReset } from "../hooks/admin_hooks/useAdminReset";
import ThemeToggle from "../../components/app/ThemeToggle";

export default function AdminSettings() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newEmail: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [tempToken, setTempToken] = useState("");
  const { initiate, verify, confirm, loading } = useAdminReset();

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
      if (formData.newPassword !== formData.confirmPassword)
        return toast.error("Passwords don't match");
      if (await confirm({ ...formData, tempResetToken: tempToken })) {
        setStep(1);
        setFormData({
          email: "",
          otp: "",
          newEmail: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      {/* Navigation Bar */}
      <div className="max-w-md mx-auto w-full mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </button>
        <ThemeToggle />
      </div>

      {/* Centering Wrapper for the Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white">
                Security Settings
              </h2>
              <p className="text-zinc-500 text-xs">Update your credentials.</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
                  Admin Email
                </label>
                <div className="relative mb-6">
                  <Mail
                    className="absolute left-4 top-4 text-zinc-400"
                    size={18}
                  />
                  <input
                    type="email"
                    className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 pl-12 rounded-xl text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="admin@katdict.com"
                    required
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
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 text-center text-2xl tracking-[0.5em] rounded-xl mb-6 text-zinc-900 dark:text-white"
                  placeholder="000000"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[
                  {
                    icon: Mail,
                    key: "newEmail",
                    placeholder: "New Email",
                    type: "email",
                  },
                  {
                    icon: KeyRound,
                    key: "newPassword",
                    placeholder: "New Password",
                    type: "password",
                  },
                  {
                    icon: CheckCircle,
                    key: "confirmPassword",
                    placeholder: "Confirm Password",
                    type: "password",
                  },
                ].map((field, i) => (
                  <div key={i} className="relative">
                    <field.icon
                      className="absolute left-4 top-4 text-zinc-400"
                      size={18}
                    />
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 pl-12 rounded-xl text-zinc-900 dark:text-white"
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
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
    </div>
  );
}
