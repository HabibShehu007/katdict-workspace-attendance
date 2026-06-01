import { motion } from "framer-motion";
import { MapPinOff } from "lucide-react";

interface LocationGuardProps {
  isWithinWorkspace: boolean;
  dayName: string;
  children: React.ReactNode;
}

export default function LocationGuard({
  isWithinWorkspace,
  dayName,
  children,
}: LocationGuardProps) {
  // If the calculation confirms the user is inside, render the normal dashboard children components
  if (isWithinWorkspace) {
    return <>{children}</>;
  }

  // If outside, intercept completely and show the restricted 404 state layout
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-12 sm:p-20 bg-white dark:bg-zinc-900 border border-amber-500/20 rounded-3xl transition-colors shadow-xs"
    >
      <div className="p-5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl mb-6">
        <MapPinOff className="w-12 h-12" />
      </div>
      <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-200 tracking-tight">
        Outside Workspace Perimeter
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mt-2 mb-6 leading-relaxed">
        In order to add attendance on{" "}
        <span className="font-bold text-zinc-900 dark:text-zinc-100">
          {dayName}
        </span>{" "}
        or submit workspace logs, you must physically locate yourself at the{" "}
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          KATDICT Workspace location
        </span>
        .
      </p>
      <div className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-4 py-2 rounded-xl font-mono border border-zinc-200 dark:border-zinc-700/60 max-w-xs truncate">
        Write access disabled remotely
      </div>
    </motion.div>
  );
}
