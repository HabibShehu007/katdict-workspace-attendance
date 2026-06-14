// components/ui/LoadingOverlay.tsx
import { motion } from "framer-motion";

export const LoadingOverlay = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm"
  >
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {message}
      </p>
    </div>
  </motion.div>
);
