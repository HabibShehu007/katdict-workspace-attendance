import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAdminCalendarPicker } from "../../hooks/history_hooks/useAdminCalendarPicker";

interface CustomCalendarPickerProps {
  onSelectRange: (startDate: string, endDate: string) => void;
}

export default function AdminCalendarPicker({
  onSelectRange,
}: CustomCalendarPickerProps) {
  const {
    isOpen,
    setIsOpen,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleApply,
  } = useAdminCalendarPicker({ onSelectRange });

  // ... (Keep the JSX return exactly as you had it in your User component)
  // Just ensure the import for useCalendarPicker is updated to useAdminCalendarPicker
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-[2px] z-[60]"
          />
        )}
      </AnimatePresence>

      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-black text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all active:scale-95"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Pick Dates</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 w-[90vw] max-w-[320px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl p-6 z-[70]"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                  Filter by Date
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Start from
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Up to
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all"
                >
                  <Check className="w-3.5 h-3.5" /> Apply Filter
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
