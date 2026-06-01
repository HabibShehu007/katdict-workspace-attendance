import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardX, Plus, CheckCircle2, FileEdit, Code } from "lucide-react";
import AttendanceOptionModal from "../modals/AttendanceOptionModal";
import WorkspaceLogModal from "../modals/WorkspaceLogModal";

interface WorkspaceLogsProps {
  dayName: string;
  hasAttendance: boolean;
  onAddAttendance: () => void;
}

interface SubmittedLog {
  title: string;
  desc: string;
  stacks: string[];
  uiUrl?: string;
}

export default function WorkspaceLogs({
  dayName,
  hasAttendance,
  onAddAttendance,
}: WorkspaceLogsProps) {
  // Modal toggle state controls
  const [showOptions, setShowOptions] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);

  // Simulated local state to show entered data instantly on screen
  const [logData, setLogData] = useState<SubmittedLog | null>(null);

  // Triggered when user picks "Save Attendance Only"
  const handleSelectAttendanceOnly = () => {
    onAddAttendance(); // Triggers parent verified attendance state
    setShowOptions(false);
  };

  // Triggered when user picks "Submit Attendance & Logs"
  const handleSelectBoth = () => {
    setShowOptions(false);
    setShowLogForm(true); // Open the details form immediately
  };

  // Triggered when full work logs form is submitted
  const handleLogFormSubmit = (data: SubmittedLog) => {
    if (!hasAttendance) {
      onAddAttendance(); // Make sure attendance activates too
    }
    setLogData(data);
    setShowLogForm(false);
  };

  if (!hasAttendance) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center p-12 sm:p-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl transition-colors shadow-sm"
        >
          <div className="p-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-full mb-4">
            <ClipboardX className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
            No active logs detected
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-2 mb-10 leading-relaxed">
            No attendance or active session logs for{" "}
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {dayName}
            </span>
            . Please register your workspace presence below.
          </p>

          <button
            onClick={() => setShowOptions(true)}
            className="group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95 cursor-pointer text-base"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Add Attendance</span>
          </button>
        </motion.div>

        {/* Dynamic Connected Modals Layers */}
        <AttendanceOptionModal
          isOpen={showOptions}
          onClose={() => setShowOptions(false)}
          onAttendanceOnly={handleSelectAttendanceOnly}
          onBoth={handleSelectBoth}
        />

        <WorkspaceLogModal
          isOpen={showLogForm}
          onClose={() => setShowLogForm(false)}
          onSubmit={handleLogFormSubmit}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 sm:p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl border-dashed space-y-6 text-left"
      >
        {/* Core Success Verification Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-4">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <span className="font-black text-sm uppercase tracking-widest block">
                Workspace Active
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Alhamdulillah! Your presence for{" "}
                <span className="font-bold">{dayName}</span> is verified.
              </span>
            </div>
          </div>

          {/* Show the Add Log details button if no logs are attached yet */}
          {!logData && (
            <button
              onClick={() => setShowLogForm(true)}
              className="flex items-center justify-center gap-2 text-xs font-bold bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer self-start sm:self-auto shadow-xs"
            >
              <FileEdit className="w-4 h-4 text-emerald-500" />
              <span>Add Workspace Daily Log</span>
            </button>
          )}
        </div>

        {/* DISPLAY PANEL: Render custom log card details instantly if they exist */}
        {logData ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-2xl space-y-4 shadow-xs">
            <div>
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Project Focus
              </h4>
              <h3 className="text-base font-black text-zinc-900 dark:text-white mt-0.5">
                {logData.title}
              </h3>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Description
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mt-0.5 leading-relaxed">
                {logData.desc}
              </p>
            </div>

            {logData.stacks.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Code className="w-3 h-3" /> Used Tech Stacks
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {logData.stacks.map((stack) => (
                    <span
                      key={stack}
                      className="text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-md"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {logData.uiUrl && (
              <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-400">Design Sample Attachment:</span>
                <a
                  href={logData.uiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-500 hover:underline font-bold"
                >
                  View Screenshot →
                </a>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
            You haven't submitted your task description layout details yet. Make
            sure to complete them before the morning window closes at 12:00 PM
            Noon!
          </p>
        )}
      </motion.div>

      {/* Form modal handler for isolated log adding */}
      <WorkspaceLogModal
        isOpen={showLogForm}
        onClose={() => setShowLogForm(false)}
        onSubmit={handleLogFormSubmit}
      />
    </>
  );
}
