import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCards from "../components/dashboard/StatCards";
import LocationGuard from "../components/dashboard/LocationGuard";
import WorkspaceLogs from "../components/dashboard/WorkspaceLogs";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { isWithinWorkspace } = useAuth();
  const [hasAttendance, setHasAttendance] = useState(false);

  // Dynamic Engine for Date Tracking
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* MODULAR STATUS GRID SYSTEM */}
        <StatCards
          dayName={dayName}
          formattedDate={formattedDate}
          isWithinWorkspace={isWithinWorkspace}
          streakCount={7}
        />

        {/* GEOLOCATION BOUNDARY SECURITY LAYER */}
        <LocationGuard isWithinWorkspace={isWithinWorkspace} dayName={dayName}>
          {/* REGISTRATION CANVAS COMPONENT */}
          <WorkspaceLogs
            dayName={dayName}
            hasAttendance={hasAttendance}
            onAddAttendance={() => setHasAttendance(true)}
          />
        </LocationGuard>
      </div>
    </DashboardLayout>
  );
}
