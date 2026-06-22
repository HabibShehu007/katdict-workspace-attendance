import { Database, Brain, ExternalLink } from "lucide-react";
import TechStackSelector from "../modals/TechStackSelector";

interface DataScienceLogFormProps {
  title: string;
  setTitle: (val: string) => void;
  desc: string;
  setDesc: (val: string) => void;
  githubUrl: string; // Used for Notebook / GitHub repository
  setGithubUrl: (val: string) => void;
  uiUrl: string; // Used for Dataset URL
  setUiUrl: (val: string) => void;
  liveUrl: string; // Used for Streamlit / hosted dashboard
  setLiveUrl: (val: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  stacks: string[];
  setStacks: (val: string[]) => void;
}

export default function DataScienceLogForm({
  title,
  setTitle,
  desc,
  setDesc,
  githubUrl,
  setGithubUrl,
  uiUrl,
  setUiUrl,
  liveUrl,
  setLiveUrl,
  handleFormSubmit,
  isSubmitting,
  stacks,
  setStacks,
}: DataScienceLogFormProps) {
  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 text-left overflow-y-auto pr-1 flex-1"
    >
      <div className="space-y-1.5">
        <label className="text-xs font-black text-zinc-700 uppercase tracking-wider">
          Project / Research Title
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
          Description & Insights
        </label>
        <textarea
          required
          placeholder="What insights or models did you work on today? Include findings..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        />
      </div>

      <TechStackSelector
        key={JSON.stringify(stacks)}
        userRole="data_science"
        value={stacks}
        onChange={setStacks}
      />

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" /> Notebook / Colab Link *
          </label>
          <input
            type="url"
            required
            placeholder="https://github.com/... or https://colab.research.google.com/..."
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Database className="w-3.5 h-3.5" /> Dataset Source URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://kaggle.com/datasets/... or custom data link"
            value={uiUrl}
            onChange={(e) => setUiUrl(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
            <ExternalLink className="w-3.5 h-3.5" /> Hosted Dashboard / App Link (Optional)
          </label>
          <input
            type="url"
            placeholder="https://streamlit.app/... or Tableau / PowerBI dashboard"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl mt-4 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Submit Log"}
      </button>
    </form>
  );
}
