import { Menu, X, ShieldCheck } from "lucide-react";
import ThemeToggle from "../../components/app/ThemeToggle";

interface AdminMobileNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AdminMobileNav({
  isOpen,
  setIsOpen,
}: AdminMobileNavProps) {
  return (
    <div className="md:hidden w-full h-16 bg-zinc-950 border-b border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-400">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg cursor-pointer border border-zinc-800"
          aria-label="Toggle Navigation Drawer"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-2">
          KATDICT <span className="text-emerald-500 text-[10px]">ADMIN</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-500" />
        <ThemeToggle />
      </div>
    </div>
  );
}
