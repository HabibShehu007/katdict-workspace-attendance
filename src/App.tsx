import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Onboarding from "./pages/Onboarding";

// 1. Initialize the TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents annoying re-fetches when switching tabs
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 2. Global UI components wrapper */}
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        {/* Our Onboarding Screen */}
        <Onboarding />

        {/* 3. The global notification toast engine */}
        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="dark" // Can be tied to your theme state later
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;
