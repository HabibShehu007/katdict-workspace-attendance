import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCards from "../components/dashboard/StatCards";
import LocationGuard from "../components/dashboard/LocationGuard";
import WorkspaceLogs from "../components/dashboard/WorkspaceLogs";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  // Use the context for all state needs
  const { isWithinWorkspace, user, attendance } = useAuth();

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
          // Dynamically pull from the user object we updated in the hook/API
          streakCount={user?.current_streak || 0}
        />

        {/* GEOLOCATION BOUNDARY SECURITY LAYER */}
        <LocationGuard isWithinWorkspace={isWithinWorkspace} dayName={dayName}>
          {/* REGISTRATION CANVAS COMPONENT */}
          <WorkspaceLogs
            dayName={dayName}
            hasAttendance={attendance.hasAttendance}
            // REMOVE: onAddAttendance={() => {}}
          />
        </LocationGuard>
      </div>
    </DashboardLayout>
  );
}
