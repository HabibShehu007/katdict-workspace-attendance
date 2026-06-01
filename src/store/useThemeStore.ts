import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark", // Defaulting to dark theme for that rich, developer-centric workspace vibe
      toggleTheme: () => {
        const nextTheme = get().theme === "light" ? "dark" : "light";
        const root = window.document.documentElement;

        if (nextTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }

        set({ theme: nextTheme });
      },
    }),
    {
      name: "katdict-theme-storage",
    },
  ),
);
