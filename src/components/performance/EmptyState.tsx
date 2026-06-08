import { BarChart3 } from "lucide-react";

export function PerformanceEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        No performance data yet
      </h3>
      <p className="text-zinc-500 max-w-sm">
        Start logging your daily workspace sessions to see your productivity,
        consistency, and tech stack analytics come to life.
      </p>
    </div>
  );
}
