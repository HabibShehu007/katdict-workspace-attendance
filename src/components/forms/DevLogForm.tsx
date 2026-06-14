import { GitBranch, ExternalLink } from "lucide-react";
import TechStackSelector from "../modals/TechStackSelector";

interface DevLogFormProps {
  title: string;
  setTitle: (val: string) => void;
  desc: string;
  setDesc: (val: string) => void;
  githubUrl: string;
  setGithubUrl: (val: string) => void;
  liveUrl: string;
  setLiveUrl: (val: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  // Add these two
  stacks: string[];
  setStacks: (val: string[]) => void;
}

export default function DevLogForm({
  title,
  setTitle,
  desc,
  setDesc,
  githubUrl,
  setGithubUrl,
  liveUrl,
  setLiveUrl,
  handleFormSubmit,
  isSubmitting,
  stacks,
  setStacks,
}: DevLogFormProps) {
  const isGithubValid =
    !githubUrl || githubUrl.startsWith("https://github.com");

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
        userRole="web_development"
        value={stacks}
        onChange={setStacks}
      />

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
            <GitBranch className="w-3.5 h-3.5" /> GitHub Repository *
          </label>
          <input
            type="url"
            required
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className={`w-full text-sm px-3.5 py-2.5 border rounded-xl outline-none transition-all ${!isGithubValid ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500"}`}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
            <ExternalLink className="w-3.5 h-3.5" /> Live Demo (Optional)
          </label>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isGithubValid}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl mt-4 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Submit Log"}
      </button>
    </form>
  );
}
