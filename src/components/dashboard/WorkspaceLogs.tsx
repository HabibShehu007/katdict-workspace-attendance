import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileEdit, Plus } from "lucide-react";

// Import your custom sub-components
import WorkspaceEmptyState from "./workspacelog_components/WorkspaceEmptyState";
import WorkspaceActiveLogCard from "./workspacelog_components/WorkspaceActiveLogCard";
import AttendanceOptionModal from "../modals/AttendanceOptionModal";
import WorkspaceLogModal from "../modals/WorkspaceLogModal";

// Import your central synchronizer master hook
import { useWorkspaceLog } from "../../hooks/WorkSpaceLog-hooks/useWorkspaceLog";

interface WorkspaceLogsProps {
  dayName: string;
}

export default function WorkspaceLogs({ dayName }: WorkspaceLogsProps) {
  // 1. Initialize the single source of truth for database state
  const {
    hasAttendance,
    logData,
    isSubmitting,
    error,
    saveAttendanceOnly,
    submitWorkLog,
  } = useWorkspaceLog(dayName);

  // 2. Keep local UI modal state clean and minimal
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showLogFormModal, setShowLogFormModal] = useState(false);

  // Handlers to route modal selections straight into the database hook
  const handleSelectAttendanceOnly = () => {
    saveAttendanceOnly();
  };

  const handleSelectBoth = () => {
    setShowLogFormModal(true);
  };

  return (
    <>
      <div className="w-full space-y-6">
        {/* Error Notification Banner if backend fails */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl text-left">
            {error}
          </div>
        )}

        {/* State Router Guard 1: User hasn't checked in at all yet */}
        {!hasAttendance ? (
          <WorkspaceEmptyState
            dayName={dayName}
            onAddAttendanceClick={() => setShowOptionsModal(true)}
          />
        ) : (
          /* State Router Guard 2: User is checked in and active */
          <div className="w-full space-y-6">
            {/* Status Header Notification Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-5 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block">
                    Workspace Status Active
                  </span>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    Your presence for{" "}
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {dayName}
                    </span>{" "}
                    is verified and locked.
                  </p>
                </div>
              </div>

              {!logData && (
                <button
                  disabled={isSubmitting}
                  onClick={() => setShowLogFormModal(true)}
                  className="flex items-center justify-center gap-2 text-xs font-black bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 px-5 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all active:scale-95 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <FileEdit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {isSubmitting ? "Saving..." : "Complete Daily Logs"}
                  </span>
                </button>
              )}
            </motion.div>

            {/* Dynamic Inner Panel Content Node */}
            {logData ? (
              <WorkspaceActiveLogCard
                logData={logData}
                onModifyClick={() => setShowLogFormModal(true)}
              />
            ) : (
              <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl text-left py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                  You have marked attendance to save your arrival punctuality
                  score, but haven't submitted your task metrics layout details
                  yet. Make sure to complete them before the morning window
                  closes!
                </p>
                <button
                  disabled={isSubmitting}
                  onClick={() => setShowLogFormModal(true)}
                  className="flex items-center justify-center gap-2 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md tracking-wide shrink-0 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isSubmitting ? "Processing..." : "Add Progress Logs Now"}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mounting the modals at the base layer */}
      <AttendanceOptionModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onAttendanceOnly={handleSelectAttendanceOnly}
        onBoth={handleSelectBoth}
      />

      <WorkspaceLogModal
        isOpen={showLogFormModal}
        onClose={() => setShowLogFormModal(false)}
        onSubmit={submitWorkLog}
      />
    </>
  );
}
