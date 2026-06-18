import { Network, Server, Terminal, Link2, ExternalLink } from "lucide-react";
import { NETWORKING_STACKS } from "../../../constants/techStacks";

interface NetworkingDetailViewProps {
  data: any;
}

export const NetworkingDetailView = ({ data }: NetworkingDetailViewProps) => {
  const workData = data.workData || {};

  // Extract stacks
  const stacks = workData.stacks || [];

  // Use categorized lists if they exist, otherwise filter from stacks
  let protocols = workData.protocols || [];
  let hardware = workData.hardware || [];
  let automation = workData.automation || [];

  if (
    protocols.length === 0 &&
    hardware.length === 0 &&
    automation.length === 0 &&
    stacks.length > 0
  ) {
    protocols = stacks.filter(
      (s: string) =>
        NETWORKING_STACKS.protocols.includes(s) ||
        (!NETWORKING_STACKS.hardware.includes(s) &&
          !NETWORKING_STACKS.automation.includes(s)),
    );
    hardware = stacks.filter((s: string) =>
      NETWORKING_STACKS.hardware.includes(s),
    );
    automation = stacks.filter((s: string) =>
      NETWORKING_STACKS.automation.includes(s),
    );
  }

  // URLs
  const docUrl = workData.docUrl || workData.doc_url;
  const infrastructureUrl = workData.infrastructureUrl || workData.infrastructure_url || workData.dashboardUrl;
  const automationUrl = workData.automationUrl || workData.automation_url;

  const hasContent =
    protocols.length > 0 || hardware.length > 0 || automation.length > 0;

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
      {/* Networking Categories Grid */}
      {hasContent && (
        <div className="space-y-3">
          {protocols.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase flex items-center gap-1 mb-2">
                <Network className="w-3 h-3" /> Protocols
              </span>
              <div className="flex flex-wrap gap-1.5">
                {protocols.map((p: string) => (
                  <span
                    key={p}
                    className="text-[11px] font-bold px-2.5 py-1 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 rounded-lg border border-sky-100 dark:border-sky-900/50"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hardware.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase flex items-center gap-1 mb-2">
                <Server className="w-3 h-3" /> Infrastructure
              </span>
              <div className="flex flex-wrap gap-1.5">
                {hardware.map((h: string) => (
                  <span
                    key={h}
                    className="text-[11px] font-bold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg border border-zinc-200 dark:border-zinc-700/60"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {automation.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1 mb-2">
                <Terminal className="w-3 h-3" /> Automation
              </span>
              <div className="flex flex-wrap gap-1.5">
                {automation.map((a: string) => (
                  <span
                    key={a}
                    className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-100 dark:border-emerald-900/50"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Network Project Links */}
      <div className="flex flex-col gap-2">
        {docUrl && (
          <a
            href={docUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black text-sky-600 hover:underline"
          >
            <Link2 className="w-3.5 h-3.5" /> Documentation URL
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}

        {infrastructureUrl && (
          <a
            href={infrastructureUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black text-zinc-900 dark:text-zinc-100 hover:underline"
          >
            <Link2 className="w-3.5 h-3.5" /> Infrastructure Dashboard
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}
        
        {automationUrl && (
          <a
            href={automationUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black text-emerald-600 hover:underline"
          >
            <Terminal className="w-3.5 h-3.5" /> Automation Scripts
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        )}
      </div>
    </div>
  );
};

