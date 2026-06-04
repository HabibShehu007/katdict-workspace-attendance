import { toast } from "sonner";

interface TogglerProps {
  activeView: "weekly" | number;
  onToggle: (view: "weekly" | number) => void;
  isLocked: boolean;
}

export function PerformanceToggler({
  activeView,
  onToggle,
  isLocked,
}: TogglerProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const handleSelection = (view: "weekly" | number) => {
    if (view === "weekly" && isLocked) {
      toast.error(
        "Overall week performance is under review until Friday at 12:00 PM.",
      );
      return;
    }
    onToggle(view);
  };

  return (
    <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-x-auto">
      <button
        onClick={() => handleSelection("weekly")}
        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
          activeView === "weekly"
            ? "bg-white dark:bg-zinc-700 shadow-sm"
            : "text-zinc-500 hover:text-zinc-900"
        }`}
      >
        Weekly
      </button>
      {days.map((day, index) => (
        <button
          key={day}
          onClick={() => handleSelection(index)}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
            activeView === index
              ? "bg-white dark:bg-zinc-700 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
}
