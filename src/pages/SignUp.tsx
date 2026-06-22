import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  MapPin,
  Eye,
  EyeOff,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSignUp } from "../hooks/auth_hooks/useSignUp";
import ThemeToggle from "../components/app/ThemeToggle";

export default function SignUp() {
  const navigate = useNavigate();

  const {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    handleSignUpSubmit,
  } = useSignUp({
    onSuccess: () => navigate("/login"),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("");

  return (
    <div className="min-h-screen w-full flex bg-zinc-50 dark:bg-zinc-800 transition-colors duration-400 ease-in-out overflow-y-auto md:overflow-hidden">
      {/* Navigation Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none sm:top-6 sm:left-6 sm:right-6">
        <button
          onClick={() => navigate("/")}
          className="pointer-events-auto group flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors bg-white/80 dark:bg-zinc-800/40 py-2 px-3.5 rounded-xl backdrop-blur-md border border-zinc-200 dark:border-zinc-700/20 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back Home</span>
        </button>
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* LEFT: Graphic Context */}
      <div
        className="hidden md:flex md:w-1/2 relative bg-cover bg-center items-center p-12 lg:p-16 overflow-hidden"
        style={{ backgroundImage: "url('/KATDICT-2-scaled.jpg')" }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950" />
        <div className="relative z-10 max-w-sm space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest w-fit">
            <MapPin className="w-3 h-3" /> Location Awareness Required
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Building the local tech ecosystem.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Join the community, log your daily progress, and stay synced with
            the team.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-12 relative z-10 md:h-screen md:overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-5 my-auto pt-12 md:pt-0"
        >
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white transition-colors">
              Join KATDICT
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 transition-colors">
              Enter your details to create your workspace account.
            </p>
          </div>

          <form
            onSubmit={(e) => handleSignUpSubmit(e, role)}
            className="space-y-3.5"
          >
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  required
                  type="text"
                  placeholder="FULL NAME"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-xl border border-zinc-200 dark:border-zinc-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden py-3 pl-11 pr-4 transition-all disabled:opacity-50 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-xl border border-zinc-200 dark:border-zinc-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden py-3 pl-11 pr-4 transition-all disabled:opacity-50 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Professional Role
              </label>
              <div className="relative flex items-center">
                <Briefcase className="absolute left-4 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <select
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-xl border border-zinc-200 dark:border-zinc-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden py-3 pl-11 pr-4 transition-all disabled:opacity-50 text-sm sm:text-base cursor-pointer appearance-none"
                >
                  <option value="" disabled>
                    Select your expertise
                  </option>
                  <option value="web_development">Web Development</option>
                  <option value="ui_ux_design">UI/UX & Graphic Design</option>
                  <option value="networking">Networking</option>
                  <option value="data_science">Data Science</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-xl border border-zinc-200 dark:border-zinc-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden py-3 pl-11 pr-11 transition-all disabled:opacity-50 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-xl border border-zinc-200 dark:border-zinc-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden py-3 pl-11 pr-11 transition-all disabled:opacity-50 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-70 cursor-pointer text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Create Workspace Account</span>
              )}
            </button>
          </form>

          <div className="text-center pt-1">
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 underline underline-offset-4 cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
