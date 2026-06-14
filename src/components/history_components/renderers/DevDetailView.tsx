import { Code2, GitBranch, ExternalLink, Globe } from "lucide-react";

export const DevDetailView = ({ data }: { data: any }) => {
  const liveUrl = data.workData?.liveUrl || data.workData?.live_url;

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
      {data.workData?.stacks?.length > 0 && (
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1 mb-2">
            <Code2 className="w-3 h-3" /> Tech Stack
          </span>
          <div className="flex flex-wrap gap-1.5">
            {data.workData.stacks.map((s: string) => (
              <span
                key={s}
                className="text-[11px] font-bold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg border border-zinc-200 dark:border-zinc-700/60"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {data.workData?.githubUrl && (
          <a
            href={data.workData.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black text-emerald-600 hover:underline"
          >
            <GitBranch className="w-3.5 h-3.5" /> GitHub Repository
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}

        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black text-blue-600 hover:underline"
          >
            <Globe className="w-3.5 h-3.5" /> Live Preview
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}
      </div>
    </div>
  );
};
