import { PenTool, Link2, ExternalLink } from "lucide-react";
import TechStackSelector from "../modals/TechStackSelector";

interface DesignLogFormProps {
  title: string;
  setTitle: (val: string) => void;
  desc: string;
  setDesc: (val: string) => void;
  figmaUrl: string;
  setFigmaUrl: (val: string) => void;
  assetsUrl: string;
  setAssetsUrl: (val: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  stacks: string[];
  setStacks: (val: string[]) => void;
}

export default function DesignLogForm({
  title,
  setTitle,
  desc,
  setDesc,
  figmaUrl,
  setFigmaUrl,
  assetsUrl,
  setAssetsUrl,
  handleFormSubmit,
  isSubmitting,
  stacks,
  setStacks,
}: DesignLogFormProps) {
  const isFigmaValid = !figmaUrl || figmaUrl.includes("figma.com");

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 text-left overflow-y-auto pr-1 flex-1"
    >
      <div className="space-y-1.5">
        <label className="text-xs font-black text-zinc-700 uppercase tracking-wider">
          Project Title
        </label>
        <input
          required
          disabled={isSubmitting}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-black text-zinc-700 uppercase tracking-wider">
          Description
        </label>
        <textarea
          required
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        />
      </div>

      <TechStackSelector
        key={JSON.stringify(stacks)}
        userRole="ui_ux_design"
        value={stacks}
        onChange={(newStacks) => {
          // LOG 2: Check if the selector is actually calling the update

          setStacks(newStacks);
        }}
      />

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
            <PenTool className="w-3.5 h-3.5" /> Figma Link
          </label>
          <input
            type="url"
            value={figmaUrl}
            onChange={(e) => setFigmaUrl(e.target.value)}
            className={`w-full text-sm px-3.5 py-2.5 border rounded-xl outline-none transition-all ${!isFigmaValid ? "border-red-500" : "border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"}`}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
            {/* Using Link2 for internal association and ExternalLink for the URL nature */}
            <Link2 className="w-3.5 h-3.5" /> Assets{" "}
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </label>
          <input
            type="url"
            value={assetsUrl}
            onChange={(e) => setAssetsUrl(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isFigmaValid}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl mt-4 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Submit Design Log"}
      </button>
    </form>
  );
}
