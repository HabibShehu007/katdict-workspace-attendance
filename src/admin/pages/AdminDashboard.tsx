import { RefreshCw } from "lucide-react";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminStatCards from "../components/dashboard_components/AdminStatCards";
import AdminStatSkeleton from "../components/dashboard_components/AdminStatSkeleton";
import RecentLogs from "../components/dashboard_components/RecentLogs";
import PunctualityChart from "../components/dashboard_components/PunctualityChart";
import ActivityStatusChart from "../components/dashboard_components/ActivityStatusChart";
import { useAdminDashboard } from "../hooks/dashbaord_hooks/useAdminDashboard"; // Updated import

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching({ queryKey: ["adminStats"] });
  const { data, isLoading } = useAdminDashboard(); // Use the hook pointing to the consolidated API

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Map API data to component expectations
  const totalUsers = data?.total_users || 0;
  const presentUsers = data?.present_users || 0;
  const activeLogs = data?.active_logs || 0;

  const formattedLogs =
    data?.recentLogs?.map((log: any) => ({
      ...log,
      id: typeof log.id === "string" ? parseInt(log.id, 10) : log.id,
    })) || [];

  if (isLoading)
    return (
      <AdminDashboardLayout>
        <div className="space-y-8 animate-pulse">
          <div className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-1/3" />
          <AdminStatSkeleton />
        </div>
      </AdminDashboardLayout>
    );

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-zinc-500 mt-2">
              System overview and administrative controls.
            </p>
          </div>

          <button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["adminStats"] })
            }
            disabled={isFetching > 0}
            className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-zinc-400 hover:text-emerald-600 disabled:opacity-50"
            title="Refresh Dashboard"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching > 0 ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <AdminStatCards
          dayName={dayName}
          formattedDate={formattedDate}
          totalUsers={totalUsers}
          presentUsers={presentUsers}
          activeLogs={activeLogs}
        />

        <div className="w-full">
          <RecentLogs logs={formattedLogs} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">
              Daily Punctuality Rate
            </h3>
            <PunctualityChart total={totalUsers} present={presentUsers} />
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">
              Log Submission Rate
            </h3>
            <ActivityStatusChart
              totalUsers={presentUsers}
              activeUsers={activeLogs}
            />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
