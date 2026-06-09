import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminStatCards from "../components/dashboard_components/AdminStatCards";
import AdminStatSkeleton from "../components/dashboard_components/AdminStatSkeleton";
import RecentLogs from "../components/dashboard_components/RecentLogs"; // Assuming this is where you'll put it
import { useAdminDashboard } from "../hooks/useAdminDashboard";

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-zinc-500 mt-2">
            System overview and administrative controls.
          </p>
        </div>

        {/* Stats Section */}
        {isLoading ? (
          <AdminStatSkeleton />
        ) : (
          <AdminStatCards
            dayName={dayName}
            formattedDate={formattedDate}
            totalUsers={data?.totalUsers || 0}
            presentUsers={data?.presentUsers || 0}
            activeLogs={data?.activeLogs || 0}
          />
        )}

        {/* Recent Activity Section */}
        {!isLoading && data?.recentLogs && (
          <RecentLogs logs={data.recentLogs} />
        )}

        {/* System Status */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl transition-colors">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            System Status
          </h2>
          <p className="text-emerald-600 dark:text-emerald-500 font-mono">
            {">"} Gateway: OPERATIONAL
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 font-mono">
            {">"} Authentication Engine: ONLINE
          </p>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
