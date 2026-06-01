import { CalendarDays, Flame, MapPin, MapPinOff } from "lucide-react";

interface StatCardsProps {
  dayName: string;
  formattedDate: string;
  isWithinWorkspace: boolean;
  streakCount?: number;
}

export default function StatCards({
  dayName,
  formattedDate,
  isWithinWorkspace,
  streakCount = 7,
}: StatCardsProps) {
  return (
    /* We use flex layout, prevent shrinking, and allow overflow scrolling with a hidden scrollbar track */
    <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2 sm:pb-0">
      {/* CARD 1 */}
      <div className="min-w-[280px] sm:min-w-0 snap-start bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 shadow-xs transition-all">
        <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            System Chronology
          </h4>
          <h2 className="text-base font-black tracking-tight text-zinc-900 dark:text-white mt-0.5">
            {dayName}
          </h2>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* CARD 2 */}
      <div className="min-w-[280px] sm:min-w-0 snap-start bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 shadow-xs transition-all">
        <div className="p-3 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl">
          <Flame className="w-5 h-5 fill-amber-500/10" />
        </div>
        <div>
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Consistency Streak
          </h4>
          <h2 className="text-base font-black tracking-tight text-zinc-900 dark:text-white mt-0.5">
            {streakCount} Days Active
          </h2>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Keep up the momentum!
          </p>
        </div>
      </div>

      {/* CARD 3 */}
      <div
        className={`min-w-[280px] sm:min-w-0 snap-start p-5 rounded-2xl border flex items-center gap-4 shadow-xs transition-all ${
          isWithinWorkspace
            ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            : "bg-amber-500/5 dark:bg-amber-500/[0.02] border-amber-500/20"
        }`}
      >
        <div
          className={`p-3 rounded-xl ${
            isWithinWorkspace
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-500 dark:text-amber-400 animate-pulse"
          }`}
        >
          {isWithinWorkspace ? (
            <MapPin className="w-5 h-5" />
          ) : (
            <MapPinOff className="w-5 h-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Perimeter Detection
          </h4>
          <h2
            className={`text-sm font-black tracking-tight truncate mt-0.5 ${
              isWithinWorkspace
                ? "text-zinc-900 dark:text-white"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {isWithinWorkspace
              ? "Katdict Workspace Building"
              : "Isolated Grid Terminal"}
          </h2>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
            {isWithinWorkspace
              ? "Verified Node Connection"
              : "Outside Authorized Zone"}
          </p>
        </div>
      </div>
    </div>
  );
}
