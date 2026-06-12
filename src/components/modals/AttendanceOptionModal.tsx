import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, FilePlus2 } from "lucide-react";
import { useAttendanceOptionModal } from "../../hooks/WorkSpaceLog-Components-hooks/useAttendanceOptionModal";

interface AttendanceOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttendanceOnly: () => void;
  onBoth: () => void;
}

export default function AttendanceOptionModal({
  isOpen,
  onClose,
  onAttendanceOnly,
  onBoth,
}: AttendanceOptionModalProps) {
  // Pull isolated logic cleanly into the component view
  const { handleAttendanceOnlyAction, handleBothAction, isProcessing } =
    useAttendanceOptionModal({
      onClose,
      onAttendanceOnlySelected: onAttendanceOnly,
      onBothSelected: onBoth,
    });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
          />

          {/* Popup Box Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xl z-10 flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Text */}
            <div className="mb-6">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                Check In Options
              </h3>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                How would you like to save your work log details today?
              </p>
            </div>

            {/* Selection Buttons Group */}
            <div className="space-y-3">
              {/* Option 1: Attendance Only */}
              <button
                disabled={isProcessing}
                onClick={handleAttendanceOnlyAction}
                className="w-full flex items-start gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-zinc-50/50 dark:bg-zinc-800/30 text-left transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg group-hover:bg-amber-500/20 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-zinc-900 dark:text-white">
                    {isProcessing ? "Saving..." : "Save Attendance Only"}
                  </span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Secure your arrival time and punctuality score now.
                    {/* Dynamic text based on current time */}
                    {new Date().getHours() >= 12
                      ? " Note: The log submission window for today has closed."
                      : " You can add your task logs later before 12:00 PM."}
                  </span>
                </div>
              </button>

              {/* Option 2: Both Attendance and Logs */}
              <button
                onClick={handleBothAction}
                className="w-full flex items-start gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-zinc-50/50 dark:bg-zinc-800/30 text-left transition-all group cursor-pointer"
              >
                <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-lg group-hover:bg-emerald-500/20 shrink-0">
                  <FilePlus2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-zinc-900 dark:text-white">
                    Submit Attendance & Logs
                  </span>
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Mark your arrival time and fill out your project work
                    details at the same time right now.
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
