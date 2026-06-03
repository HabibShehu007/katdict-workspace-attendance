import { useWorkspaceHistory } from "../hooks/history_hooks/useWorkspaceHistory";
import { usePerformanceStats } from "../hooks/performance_hooks/usePerformanceStats";
import { PerformanceCard } from "../components/performance/PerformanceCard";
import { Clock, Zap, Target, Award, Lock } from "lucide-react"; // Added Lock
import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function Performance() {
  const { historyLogs, isHistoryLoading } = useWorkspaceHistory();
  const stats = usePerformanceStats(historyLogs);

  if (isHistoryLoading) {
    return (
      <div className="p-8 text-zinc-500">Calculating your performance...</div>
    );
  }

  if (!stats) {
    return <div className="p-8 text-zinc-500">No data available.</div>;
  }

  // Access the summary object correctly
  const { summary } = stats;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Weekly Performance
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {summary.isLocked
              ? "Metrics are brewing! Your final grade will be available Friday at 12:00 PM."
              : "Here is how you performed this week. Keep up the momentum!"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PerformanceCard
            title="Punctuality"
            value={summary.punctuality}
            icon={Clock}
          />
          <PerformanceCard
            title="Consistency"
            value={summary.consistency}
            icon={Zap}
          />
          <PerformanceCard
            title="Deliverance"
            value={summary.completion}
            icon={Target}
          />
          <PerformanceCard
            title="Overall Grade"
            value={summary.overallGrade}
            icon={summary.isLocked ? Lock : Award}
            isLocked={summary.isLocked}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
