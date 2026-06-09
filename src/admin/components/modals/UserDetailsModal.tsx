// src/admin/components/modals/UserDetailsModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Flame, Trophy, Mail, User, BookOpen } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function UserDetailsModal({ isOpen, onClose, user }: Props) {
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl z-50 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 text-2xl font-black">
                {user.full_name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-zinc-400" />
                  {user.full_name}
                </h2>
                <p className="text-zinc-500 text-sm flex items-center gap-2 mt-1">
                  <Mail className="w-3 h-3" /> {user.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20">
                <p className="text-[10px] uppercase font-bold text-orange-600 flex items-center gap-2">
                  <Flame className="w-3 h-3" /> Current Streak
                </p>
                <p className="text-2xl font-black text-orange-900 dark:text-orange-500">
                  {user.current_streak}
                </p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                <p className="text-[10px] uppercase font-bold text-emerald-600 flex items-center gap-2">
                  <Trophy className="w-3 h-3" /> Highest Streak
                </p>
                <p className="text-2xl font-black text-emerald-900 dark:text-emerald-500">
                  {user.highest_streak}
                </p>
              </div>
            </div>
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
              <p className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-zinc-400" /> Joined:{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2 flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Bio
                </p>
                <p className="italic text-zinc-700 dark:text-zinc-300">
                  {user.bio || "No bio provided yet."}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
