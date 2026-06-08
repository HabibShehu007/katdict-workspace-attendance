import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminStatCards from "../components/dashboard_components/AdminStatCards";
import AdminStatSkeleton from "../components/dashboard_components/AdminStatSkeleton"; // New
import { useAdminDashboard } from "../hooks/useAdminDashboard";

export default function AdminDashboard() {
  const { totalUsers, presentUsers, activeLogs, loading } = useAdminDashboard();

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
        </div>

        {/* Conditional rendering for smoother transition */}
        {loading ? (
          <AdminStatSkeleton />
        ) : (
          <AdminStatCards
            dayName={dayName}
            formattedDate={formattedDate}
            totalUsers={totalUsers}
            presentUsers={presentUsers}
            activeLogs={activeLogs}
          />
        )}

        {/* System Status... */}
      </div>
    </AdminDashboardLayout>
  );
}
