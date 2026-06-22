import { Code2, GitBranch } from "lucide-react";

export const WebDevRenderer = ({ data }: { data: any }) => (
  <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
    <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1">
      <Code2 className="w-3 h-3" /> Tech Stack
    </span>
    <div className="flex flex-wrap gap-1.5">
      {(data.workData.stacks || data.workData.tech_stacks || []).map(
        (t: string) => (
          <span
            key={t}
            className="text-[10px] font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md"
          >
            {t}
          </span>
        ),
      )}
    </div>
    {data.workData.githubUrl && (
      <a
        href={data.workData.githubUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-xs font-bold text-emerald-600"
      >
        <GitBranch className="w-3.5 h-3.5" /> Repository
      </a>
    )}
  </div>
);
