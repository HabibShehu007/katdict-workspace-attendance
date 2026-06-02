// src/components/workspacelog_components/WorkspaceSkeleton.tsx
import { motion } from "framer-motion";

export function HeaderSkeleton() {
  return (
    <div className="w-full p-5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3.5 w-full sm:w-2/3">
        {/* Mock Rounded Square Icon */}
        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl shrink-0" />
        {/* Mock Text Lines */}
        <div className="space-y-2 w-full">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-24" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4" />
        </div>
      </div>
      {/* Mock Button on the right side */}
      <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-36 shrink-0 hidden sm:block" />
    </div>
  );
}

export function ContentCardSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4 text-left animate-pulse shadow-xs">
      <div className="space-y-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/4" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-5/6" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-16" />
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-16" />
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-16" />
      </div>
    </div>
  );
}

// A complete wrapper to group them cleanly together
export default function WorkspaceSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-6 text-left"
    >
      <HeaderSkeleton />
      <ContentCardSkeleton />
    </motion.div>
  );
}
