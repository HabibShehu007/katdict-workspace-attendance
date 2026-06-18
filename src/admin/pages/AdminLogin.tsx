import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import ThemeToggle from "../../components/app/ThemeToggle";
// 1. Import your new hook
import { useAdminLogin } from "../hooks/admin_hooks/useAdminLogin";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2. Destructure the hook
  const { adminLogin, isLoading } = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 3. Call the hook instead of local logic
    await adminLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 transition-colors duration-500 p-6 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Admin Access
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Authorized personnel only.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            // 4. Use the hook's loading state
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-all shadow-sm disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
          Secure Internal Environment
        </p>
      </div>
    </div>
  );
}
