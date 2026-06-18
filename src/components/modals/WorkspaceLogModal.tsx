import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useWorkspaceLogModal } from "../../hooks/WorkSpaceLog-Components-hooks/useWorkspaceLogModal";
import type { WorkspaceHistoryItem, UserRole } from "../../types/auth.types";
import DevLogForm from "../forms/DevLogForm";
import DesignLogForm from "../forms/DesignLogForm";
import NetworkingLogForm from "../forms/NetworkLogForm"; // Ensure this is imported

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  initialData: WorkspaceHistoryItem | null;
  userRole: Extract<
    UserRole,
    "web_development" | "ui_ux_design" | "networking"
  >;
}

export default function WorkspaceLogModal(props: Props) {
  const { isOpen, onClose, isSubmitting, userRole } = props;
  const modalLogic = useWorkspaceLogModal(props);

  // Helper to determine title
  const getTitle = () => {
    switch (userRole) {
      case "ui_ux_design":
        return "Design Log Details";
      case "networking":
        return "Network Log Details";
      default:
        return "Daily Work Details";
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
            onClick={!isSubmitting ? onClose : undefined}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xl z-10 my-auto max-h-[90vh] flex flex-col"
          >
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5 text-left">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                {getTitle()}
              </h3>
            </div>

            {/* Modal Factory Switch */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {userRole === "web_development" && (
                <DevLogForm
                  {...modalLogic}
                  isSubmitting={isSubmitting || false}
                />
              )}
              {userRole === "ui_ux_design" && (
                <DesignLogForm
                  {...modalLogic}
                  isSubmitting={isSubmitting || false}
                />
              )}
              {userRole === "networking" && (
                <NetworkingLogForm
                  {...modalLogic}
                  isSubmitting={isSubmitting || false}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
