import { useState, useEffect } from "react";

export function useAdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    presentUsers: 0,
    activeLogs: 0,
    loading: true,
  });

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/get-stats");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      setStats({
        totalUsers: data.totalUsers || 0,
        presentUsers: data.presentUsers || 0,
        activeLogs: data.activeLogs || 0,
        loading: false,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
    // Optional: Refresh stats every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
