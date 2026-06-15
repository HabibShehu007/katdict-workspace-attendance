import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, Briefcase, FileText, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { UserProfile } from "../../types/auth.types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: UserProfile;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
}: EditProfileModalProps) {
  const { updateProfile, isUpdating } = useAuth();

  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    role: initialData.role || "",
    bio: initialData.bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, ...updateData } = formData;
    const success = await updateProfile(updateData);
    if (success) onClose();
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ui_ux_design":
        return "UI/UX & GRAPHIC DESIGN";
      case "networking":
        return "NETWORKING";
      case "web_development":
      default:
        return "WEB DEVELOPMENT";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Edit Profile
              </h2>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* LOCKED FULL NAME FIELD */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    disabled
                    value={formData.fullName}
                    className="w-full bg-zinc-100 dark:bg-zinc-950 pl-10 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* LOCKED ROLE FIELD */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    disabled
                    value={getRoleLabel(formData.role)}
                    className="w-full bg-zinc-100 dark:bg-zinc-950 pl-10 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* BIO FIELD */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Bio
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full bg-zinc-50 dark:bg-zinc-800 pl-10 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-900 h-24 resize-none"
                  />
                </div>
              </div>

              <button
                disabled={isUpdating}
                className="w-full mt-4 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2 transition-all"
              >
                {isUpdating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isUpdating ? "Saving Changes..." : "Save Profile"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
