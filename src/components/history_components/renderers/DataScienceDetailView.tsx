import { Database, Brain, ExternalLink, Library } from "lucide-react";

interface DataScienceDetailViewProps {
  data: any;
}

export const DataScienceDetailView = ({ data }: DataScienceDetailViewProps) => {
  const workData = data.workData || {};
  const libraries = workData.libraries || workData.stacks || [];
  const concepts = workData.concepts || [];
  const toolsDs = workData.tools_ds || [];

  const notebookUrl =
    workData.notebookUrl ||
    workData.githubUrl ||
    data.notebookUrl ||
    data.github_url;
  const datasetUrl =
    workData.datasetUrl ||
    workData.uiUrl ||
    data.datasetUrl ||
    data.ui_reference_url;
  const dashboardUrl =
    workData.dashboardUrl ||
    workData.liveUrl ||
    data.dashboardUrl ||
    data.live_preview_url ||
    data.live_url;

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
      {/* Libraries & Tools */}
      {(libraries.length > 0 || toolsDs.length > 0) && (
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1 mb-2">
            <Library className="w-3 h-3" /> Libraries & Tools
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[...libraries, ...toolsDs].map((l: string) => (
              <span
                key={l}
                className="text-[11px] font-bold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-900/50"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Concepts */}
      {concepts.length > 0 && (
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1 mb-2">
            <Brain className="w-3 h-3" /> Domain Concepts
          </span>
          <div className="flex flex-wrap gap-1.5">
            {concepts.map((c: string) => (
              <span
                key={c}
                className="text-[11px] font-bold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg border border-zinc-200 dark:border-zinc-700/60"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* URLs */}
      <div className="flex flex-col gap-2">
        {notebookUrl && (
          <a
            href={notebookUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black text-emerald-600 hover:underline"
          >
            <Brain className="w-3.5 h-3.5" /> Notebook / Colab Link
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}

        {datasetUrl && (
          <a
            href={datasetUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black text-sky-600 hover:underline"
          >
            <Database className="w-3.5 h-3.5" /> Dataset Source
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}

        {dashboardUrl && (
          <a
            href={dashboardUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black text-blue-600 hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Hosted Dashboard / App
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}
      </div>
    </div>
  );
};
