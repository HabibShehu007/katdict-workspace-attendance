import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AdminProvider, useAdmin } from "./admin/context/AdminContext"; // New Import
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import React from "react";

// Pages
import Onboarding from "./pages/Onboarding";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkspaceHistory from "./pages/WorkspaceHistory";
import Performance from "./pages/Performance";
import ProfilePage from "./pages/Profile";

// Admin Pages
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminHistory from "./admin/pages/AdminHistory";
import UserManagement from "./admin/pages/UserManagement";

// User Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Admin Guard
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { admin, isLoading } = useAdmin();
  if (isLoading) return <div>Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

function App() {
  const { theme } = useThemeStore();
  useEffect(() => {
    theme === "dark"
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Wrap Admin routes with AdminProvider separately */}
        <AdminProvider>
          <AuthProvider>
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-100">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Onboarding />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* User Routes */}
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <WorkspaceHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/performance"
                  element={
                    <ProtectedRoute>
                      <Performance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes (Wrapped in AdminProtectedRoute) */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/history"
                  element={
                    <AdminProtectedRoute>
                      <AdminHistory />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminProtectedRoute>
                      <UserManagement />
                    </AdminProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <Toaster
                position="top-center"
                richColors
                closeButton
                theme={theme === "dark" ? "dark" : "light"}
              />
            </div>
          </AuthProvider>
        </AdminProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
