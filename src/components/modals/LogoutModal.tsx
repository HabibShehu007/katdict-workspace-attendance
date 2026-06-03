import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export function LogoutModal({
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-sm p-6 rounded-2xl shadow-xl"
          >
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Sign Out?
            </h2>
            <p className="text-zinc-500 text-sm mt-2 mb-6">
              Are you sure you want to end your current session?
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg font-bold bg-zinc-100 hover:bg-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logoutSession();
                  window.location.href = "/login";
                }}
                className="flex-1 px-4 py-2.5 rounded-lg font-bold bg-rose-600 text-white hover:bg-rose-700"
              >
                Yes, Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
