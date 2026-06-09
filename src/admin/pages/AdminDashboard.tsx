// src/admin/pages/AdminDashboard.tsx
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminStatCards from "../components/dashboard_components/AdminStatCards";
import AdminStatSkeleton from "../components/dashboard_components/AdminStatSkeleton";
import RecentLogs from "../components/dashboard_components/RecentLogs";
import PunctualityChart from "../components/dashboard_components/PunctualityChart";
import { useAdminStats } from "../hooks/dashbaord_hooks/useAdminStats";

// A small helper to keep the dashboard clean
const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-1/3" />
    <AdminStatSkeleton />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-64 bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />
      <div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />
    </div>
  </div>
);

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedLogs =
    data?.recentLogs?.map((log) => ({
      ...log,
      id: typeof log.id === "string" ? parseInt(log.id, 10) : log.id,
    })) || [];

  if (isLoading)
    return (
      <AdminDashboardLayout>
        <DashboardSkeleton />
      </AdminDashboardLayout>
    );

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

        {/* Top: Stat Cards (Full Width) */}
        <AdminStatCards
          dayName={dayName}
          formattedDate={formattedDate}
          totalUsers={data?.totalUsers || 0}
          presentUsers={data?.presentUsers || 0}
          activeLogs={data?.activeLogs || 0}
        />

        {/* Bottom: Recent Logs + Punctuality Pulse (Side-by-Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: Recent Logs */}
          <div className="lg:col-span-2">
            {data?.recentLogs ? (
              <RecentLogs logs={formattedLogs} />
            ) : (
              <div className="h-64 bg-zinc-50 dark:bg-zinc-900/50 border border-dashed rounded-3xl flex items-center justify-center text-zinc-400">
                No recent activity
              </div>
            )}
          </div>

          {/* Right: Punctuality Pulse */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex flex-col justify-center transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">
              Punctuality Pulse
            </h3>
            <PunctualityChart
              total={data?.totalUsers || 0}
              present={data?.presentUsers || 0}
            />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
