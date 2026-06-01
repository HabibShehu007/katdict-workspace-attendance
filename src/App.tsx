import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

// Page Imports
import Onboarding from "./pages/Onboarding";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

//  Dashboard and sub-pages imports
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { theme } = useThemeStore();

  // Sync theme class with HTML root on mount
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-100">
            <Routes>
              {/* The entry point of the app */}
              <Route path="/" element={<Onboarding />} />

              {/* Auth Routes */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />

              {/* Dashboard and sub-pages Route */}
              <Route path="/dashboard/*" element={<Dashboard />} />

              {/* Fallback to onboarding if route doesn't exist */}
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
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
