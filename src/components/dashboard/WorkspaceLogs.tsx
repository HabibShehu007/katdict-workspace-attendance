import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileEdit, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Import your custom sub-components
import WorkspaceEmptyState from "../workspacelog_components/WorkspaceEmptyState";
import WorkspaceActiveLogCard from "../workspacelog_components/WorkspaceActiveLogCard";
import AttendanceOptionModal from "../modals/AttendanceOptionModal";
import WorkspaceLogModal from "../modals/WorkspaceLogModal";

// Import your pulsing Skeleton Loader
import WorkspaceSkeleton from "../workspacelog_components/WorkspaceSkeleton";

// Import your central synchronizer master hook
import { useWorkspaceLog } from "../../hooks/WorkSpaceLog-hooks/useWorkspaceLog";
import { useAuth } from "../../context/AuthContext"; // Import context to access master switches

interface WorkspaceLogsProps {
  dayName: string;
}

export default function WorkspaceLogs({ dayName }: WorkspaceLogsProps) {
  const { BYPASS_TIME_GUARD } = useAuth(); // Read master time switch directly from the centralized brain

  const {
    hasAttendance,
    isAttendanceLoading, // Picked up directly from our custom hook expansion
    logData,
    isSubmitting,
    error,
    saveAttendanceOnly,
    submitWorkLog,
  } = useWorkspaceLog(dayName);

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showLogFormModal, setShowLogFormModal] = useState(false);

  // Client time boundary checker helper (Respects developer bypass rule)
  const isPastNoonCutoff = () => {
    if (BYPASS_TIME_GUARD) return false; // If bypass engine is running, it's NEVER locked or closed
    return new Date().getHours() >= 12;
  };

  const handleSelectAttendanceOnly = async () => {
    const isSavedSuccessfully = await saveAttendanceOnly();
    if (isSavedSuccessfully) {
      setShowOptionsModal(false);
    }
  };

  const handleSelectBoth = () => {
    if (isPastNoonCutoff()) {
      toast.error(
        "Submission closed! You can no longer submit daily logs after 12:00 PM.",
      );
      setShowOptionsModal(false);
      return;
    }
    setShowOptionsModal(false);
    setShowLogFormModal(true);
  };

  const handleOpenLogModalClick = () => {
    if (isPastNoonCutoff()) {
      toast.error("Log submission closed!", {
        description: "The modification window closed at 12:00 PM noon.",
      });
      return;
    }
    setShowLogFormModal(true);
  };

  const isClosed = isPastNoonCutoff();

  // 🛠️ THE UX INJECTION: If the centralized brain is running background async checks, intercept with a loader!
  if (isAttendanceLoading) {
    return <WorkspaceSkeleton />;
  }

  return (
    <>
      <div className="w-full space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl text-left">
            {error}
          </div>
        )}

        {!hasAttendance ? (
          <WorkspaceEmptyState
            dayName={dayName}
            onAddAttendanceClick={() => setShowOptionsModal(true)}
          />
        ) : (
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
                  onClick={handleOpenLogModalClick}
                  className={`flex items-center justify-center gap-2 text-xs font-black border px-5 py-3 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs disabled:opacity-50 ${
                    isClosed
                      ? "bg-zinc-100 text-zinc-400 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700 cursor-not-allowed"
                      : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <FileEdit
                    className={`w-4 h-4 ${isClosed ? "text-zinc-400" : "text-emerald-600 dark:text-emerald-400"}`}
                  />
                  <span>
                    {isSubmitting
                      ? "Saving..."
                      : isClosed
                        ? "Submission Closed"
                        : "Complete Daily Logs"}
                  </span>
                </button>
              )}
            </motion.div>

            {/* Dynamic Inner Panel Content Node */}
            {logData ? (
              <WorkspaceActiveLogCard
                logData={logData}
                onModifyClick={handleOpenLogModalClick}
              />
            ) : (
              <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl text-left py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    You have marked attendance to save your arrival punctuality
                    score, but haven't submitted your task metrics details yet.
                  </p>
                  {isClosed && (
                    <span className="text-xs text-rose-500 dark:text-rose-400 font-bold flex items-center gap-1.5 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Log submission
                      window closed at 12:00 PM noon.
                    </span>
                  )}
                </div>

                <button
                  disabled={isSubmitting || isClosed}
                  onClick={handleOpenLogModalClick}
                  className={`flex items-center justify-center gap-2 text-xs font-black px-5 py-3 rounded-xl transition-all active:scale-95 shadow-md tracking-wide shrink-0 ${
                    isClosed
                      ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed shadow-none"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? "Processing..."
                      : isClosed
                        ? "Locked"
                        : "Add Progress Logs Now"}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AttendanceOptionModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onAttendanceOnly={handleSelectAttendanceOnly}
        onBoth={handleSelectBoth}
      />

      <WorkspaceLogModal
        isOpen={showLogFormModal}
        isSubmitting={isSubmitting} // Correctly forwarding the button's loading spinner state
        onClose={() => setShowLogFormModal(false)}
        onSubmit={async (data) => {
          const success = await submitWorkLog(data);
          if (success) {
            setShowLogFormModal(false);
          }
        }}
      />
    </>
  );
}
