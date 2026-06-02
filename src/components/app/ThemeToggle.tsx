import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:scale-105 transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
      aria-label="Toggle workspace theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-zinc-700" />
        )}
      </motion.div>
    </button>
  );
}
