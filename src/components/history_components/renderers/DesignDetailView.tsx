import { PenTool, Link2, ExternalLink, FolderArchive } from "lucide-react";

interface DesignDetailViewProps {
  data: any;
}

export const DesignDetailView = ({ data }: DesignDetailViewProps) => {
  const workData = data.workData || {};
  const tools = workData.tools || workData.stacks || data.design_tools || [];
  const uiUrl = workData.uiUrl || workData.figmaUrl || workData.ui_reference_url;
  const assetsUrl = workData.liveUrl || workData.assetsUrl || workData.asset_drive_url;

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
      {/* Design Tools List */}
      {tools.length > 0 && (
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-1 mb-2">
            <PenTool className="w-3 h-3" /> Design Tools
          </span>
          <div className="flex flex-wrap gap-1.5">
            {tools.map((t: string) => (
              <span
                key={t}
                className="text-[11px] font-bold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg border border-zinc-200 dark:border-zinc-700/60"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Project Links */}
      <div className="flex flex-col gap-2">
        {/* Figma / UI Link */}
        {uiUrl && (
          <a
            href={uiUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black text-emerald-600 hover:underline"
          >
            <Link2 className="w-3.5 h-3.5" /> Figma URL
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}

        {/* Assets / Live Handover Link */}
        {assetsUrl && (
          <a
            href={assetsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black text-blue-600 hover:underline"
          >
            <FolderArchive className="w-3.5 h-3.5" /> Assets URL
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}
      </div>
    </div>
  );
};

