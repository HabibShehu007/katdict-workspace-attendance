import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  return (
    <div className="md:hidden w-full h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-400">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 rounded-lg cursor-pointer"
          aria-label="Toggle Navigation Drawer"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-sm font-black tracking-wider text-zinc-900 dark:text-white uppercase">
          KATDICT <span className="text-emerald-500">WS</span>
        </span>
      </div>

      <ThemeToggle />
    </div>
  );
}
