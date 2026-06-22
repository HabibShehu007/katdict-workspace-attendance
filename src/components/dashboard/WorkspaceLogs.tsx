import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FileEdit } from "lucide-react";
import { toast } from "sonner";

// Components
import WorkspaceEmptyState from "../workspacelog_components/WorkspaceEmptyState";
import WorkspaceActiveLogCard from "../workspacelog_components/WorkspaceActiveLogCard";
import AttendanceOptionModal from "../modals/AttendanceOptionModal";
import WorkspaceLogModal from "../modals/WorkspaceLogModal";
import WorkspaceSkeleton from "../workspacelog_components/WorkspaceSkeleton";
import { LoadingOverlay } from "../ui/LoadingOverlay";

// Hooks & Types
import { useWorkspaceLog } from "../../hooks/WorkSpaceLog-hooks/useWorkspaceLog";
import { useAuth } from "../../context/AuthContext";
import type { WorkspaceHistoryItem } from "../../types/auth.types";

interface WorkspaceLogsProps {
  dayName: string;
  hasAttendance: boolean;
}

export default function WorkspaceLogs({
  dayName,
  hasAttendance,
}: WorkspaceLogsProps) {
  const { user, BYPASS_TIME_GUARD } = useAuth();

  const {
    isAttendanceLoading,
    logData,
    isLogComplete,
    isSubmitting,
    error,
    saveAttendanceOnly,
    submitWorkLog,
  } = useWorkspaceLog(dayName);

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showLogFormModal, setShowLogFormModal] = useState(false);

  // Define a map or a simple check to normalize the role
  // Use the declared variable instead of hardcoding a string
  const getModalRole = (
    role: string | undefined,
  ): "web_development" | "ui_ux_design" | "networking" | "data_science" => {
    const activeRole = role || currentUserRole; // Uses the variable now
    if (activeRole === "ui_ux_design") return "ui_ux_design";
    if (activeRole === "networking") return "networking";
    if (activeRole === "data_science") return "data_science";
    return "web_development";
  };

  const isPastNoonCutoff = () =>
    !BYPASS_TIME_GUARD && new Date().getHours() >= 12;
  const isClosed = isPastNoonCutoff();

  const typedLogData = logData as WorkspaceHistoryItem | null;

  const currentUserRole = user?.role || "web_development";

  const handleSelectAttendanceOnly = async () => {
    if (await saveAttendanceOnly()) setShowOptionsModal(false);
  };

  const handleSelectBoth = () => {
    if (isClosed) {
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
    if (isClosed) {
      toast.error("Log submission closed!", {
        description: "The modification window closed at 12:00 PM noon.",
      });
      return;
    }
    setShowLogFormModal(true);
  };

  if (isAttendanceLoading) return <WorkspaceSkeleton />;

  return (
    <>
      <AnimatePresence>
        {isSubmitting && (
          <LoadingOverlay
            message={
              hasAttendance ? "Updating logs..." : "Marking attendance..."
            }
          />
        )}
      </AnimatePresence>

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
                    Attendance Verified
                  </span>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    Presence for{" "}
                    <span className="text-emerald-600">{dayName}</span> is
                    locked.
                  </p>
                </div>
              </div>
            </motion.div>

            {isLogComplete && typedLogData?.title ? (
              <WorkspaceActiveLogCard
                onModifyClick={handleOpenLogModalClick}
                logData={typedLogData}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 text-center flex flex-col items-center"
              >
                <FileEdit className="w-10 h-10 text-emerald-500 mb-4" />
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  Logs Pending
                </h3>
                <p className="text-sm text-zinc-500 mt-2 mb-6 max-w-sm">
                  Attendance is marked, but your progress metrics for {dayName}{" "}
                  are still missing.
                </p>
                <button
                  disabled={isSubmitting || isClosed}
                  onClick={handleOpenLogModalClick}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-xs hover:bg-emerald-500 transition-colors"
                >
                  {isClosed ? "Submission Closed" : "Submit Progress Logs"}
                </button>
              </motion.div>
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
        isSubmitting={isSubmitting}
        onClose={() => setShowLogFormModal(false)}
        initialData={typedLogData}
        userRole={getModalRole(user?.role)} // Use the safe mapping function
        onSubmit={async (data: any) => {
          if (await submitWorkLog(data)) setShowLogFormModal(false);
        }}
      />
    </>
  );
}
