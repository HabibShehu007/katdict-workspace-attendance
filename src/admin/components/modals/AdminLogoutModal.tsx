import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { Portal } from "./Portal"; // Import the portal

export function AdminLogoutModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { logoutSession } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-xs p-6 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
              {/* ... rest of your modal content remains the same ... */}
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-900/50">
                <LogOut className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                Sign Out?
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 mb-8 leading-relaxed">
                Are you sure you want to end your current session?
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    logoutSession();
                    window.location.href = "/admin/login";
                  }}
                  className="w-full px-5 py-3.5 rounded-xl font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all active:scale-95"
                >
                  Yes, Sign Out
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-5 py-3.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
