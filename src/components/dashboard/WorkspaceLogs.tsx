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

// Hooks & Types
import { useWorkspaceLog } from "../../hooks/WorkSpaceLog-hooks/useWorkspaceLog";
import { useAuth } from "../../context/AuthContext";
import type { WorkspaceHistoryItem } from "../../types/auth.types";

interface WorkspaceLogsProps {
  dayName: string;
  hasAttendance: boolean;
}

const LoadingOverlay = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm"
  >
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border border-zinc-200 dark:border-zinc-800">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-black text-zinc-900 dark:text-white tracking-wide uppercase">
        {text}
      </p>
    </div>
  </motion.div>
);

export default function WorkspaceLogs({
  dayName,
  hasAttendance,
}: WorkspaceLogsProps) {
  const { user, BYPASS_TIME_GUARD } = useAuth();
  const {
    isAttendanceLoading,
    logData,
    isSubmitting,
    error,
    saveAttendanceOnly,
    submitWorkLog,
  } = useWorkspaceLog(dayName);

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showLogFormModal, setShowLogFormModal] = useState(false);

  const isPastNoonCutoff = () =>
    !BYPASS_TIME_GUARD && new Date().getHours() >= 12;
  const isClosed = isPastNoonCutoff();

  // Cast logData to our type
  const typedLogData = logData as WorkspaceHistoryItem | null;

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
            text={
              hasAttendance
                ? `Updating logs for ${dayName}...`
                : `Marking attendance for ${dayName}...`
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
                  className={`flex items-center gap-2 text-xs font-black border px-5 py-3 rounded-xl transition-all ${isClosed ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-white hover:bg-zinc-50"}`}
                >
                  <FileEdit className="w-4 h-4" />
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

            {typedLogData ? (
              <WorkspaceActiveLogCard
                onModifyClick={handleOpenLogModalClick}
                // Cast to 'any' to bridge the local type vs component interface requirement
                logData={typedLogData as any}
              />
            ) : (
              <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl flex justify-between gap-4">
                <p className="text-sm text-zinc-500">
                  You haven't submitted your task metrics details yet.
                </p>
                <button
                  disabled={isSubmitting || isClosed}
                  onClick={handleOpenLogModalClick}
                  className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-black text-xs hover:bg-emerald-500"
                >
                  Add Progress Logs Now
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
        isSubmitting={isSubmitting}
        onClose={() => setShowLogFormModal(false)}
        initialData={typedLogData}
        userRole={user?.role || "web_development"}
        onSubmit={async (data: any) => {
          if (await submitWorkLog(data)) setShowLogFormModal(false);
        }}
      />
    </>
  );
}
