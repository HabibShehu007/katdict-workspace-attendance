import { Network, Terminal } from "lucide-react";
import TechStackSelector from "../modals/TechStackSelector";

interface NetworkLogFormProps {
  title: string;
  setTitle: (val: string) => void;
  desc: string;
  setDesc: (val: string) => void;
  infrastructureUrl: string; // New: For topology diagrams
  setInfrastructureUrl: (val: string) => void;
  automationUrl: string; // New: For Ansible/Python scripts
  setAutomationUrl: (val: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  stacks: string[];
  setStacks: (val: string[]) => void;
}

export default function NetworkLogForm({
  title,
  setTitle,
  desc,
  setDesc,
  infrastructureUrl,
  setInfrastructureUrl,
  automationUrl,
  setAutomationUrl,
  handleFormSubmit,
  isSubmitting,
  stacks,
  setStacks,
}: NetworkLogFormProps) {
  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 text-left overflow-y-auto pr-1 flex-1"
    >
      {/* Title & Desc same as before */}
      <div className="space-y-1.5">
        <label className="text-xs font-black text-zinc-700 uppercase tracking-wider">
          Project Title
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-black text-zinc-700 uppercase tracking-wider">
          Description / Scope
        </label>
        <textarea
          required
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
        />
      </div>

      <TechStackSelector
        key={JSON.stringify(stacks)}
        userRole="networking"
        value={stacks}
        onChange={setStacks}
      />

      <div className="space-y-3">
        {/* Topology/Infra Reference */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Network className="w-3.5 h-3.5" /> Topology / Diagram Reference
          </label>
          <input
            type="url"
            placeholder="Lucidchart, Draw.io, or Visio link"
            value={infrastructureUrl}
            onChange={(e) => setInfrastructureUrl(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
          />
          <p className="text-[10px] text-zinc-400">
            Link to your network design or architecture diagram.
          </p>
        </div>

        {/* Automation/Scripting Reference */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-zinc-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5" /> Automation / Scripting
            (Optional)
          </label>
          <input
            type="url"
            placeholder="GitHub link to Ansible/Python scripts"
            value={automationUrl}
            onChange={(e) => setAutomationUrl(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
          />
          <p className="text-[10px] text-zinc-400">
            Link to your automation playbooks, Python scripts, or config files.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-3 rounded-xl mt-4 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Submit Network Log"}
      </button>
    </form>
  );
}
