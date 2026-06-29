import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLogin } from "../hooks/auth_hooks/useLogin";
import ThemeToggle from "../components/app/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLoginSubmit,
  } = useLogin({
    // Receive the user object here
    onSuccess: (user) => {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-zinc-50 dark:bg-zinc-800 transition-colors duration-400 ease-in-out">
      {/* Navigation Overlay Header */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
        <button
          onClick={() => navigate("/")}
          className="pointer-events-auto group flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors bg-white/80 dark:bg-zinc-800/40 py-2 px-3.5 rounded-xl backdrop-blur-md border border-zinc-200 dark:border-zinc-700/20 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* LEFT PANEL: Graphic Context */}
      <div
        className="hidden md:flex md:w-1/2 relative bg-cover bg-center items-end p-12 overflow-hidden"
        style={{ backgroundImage: "url('/KATDICT-2-scaled.jpg')" }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/40 via-zinc-950/80 to-zinc-950" />

        <div className="relative z-10 max-w-sm space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
            <MapPin className="w-3 h-3" /> Location Awareness Required
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back to the Workspace.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Log in to manage your projects, submit logs, and collaborate with
            other professionals."
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Form presentation */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white transition-colors">
              Sign In
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors">
              Provide workspace credentials to unlock full session access.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 transition-colors"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-zinc-400 dark:text-zinc-500 transition-colors" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-xl border border-zinc-200 dark:border-zinc-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden py-4 pl-12 pr-4 transition-all disabled:opacity-50 text-base"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              {/* Flex container to keep label on left and link on right */}
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 transition-colors"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-zinc-400 dark:text-zinc-500 transition-colors" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-xl border border-zinc-200 dark:border-zinc-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden py-4 pl-12 pr-12 transition-all disabled:opacity-50 text-base"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg transition-colors focus:outline-hidden disabled:opacity-50 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-70 cursor-pointer text-base shadow-emerald-900/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* New Account Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors">
              New here?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer underline underline-offset-4"
              >
                Create an Account
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
