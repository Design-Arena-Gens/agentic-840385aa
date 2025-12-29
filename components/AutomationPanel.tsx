'use client';

import clsx from "clsx";
import { Gauge, Pause, Play } from "lucide-react";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";

export function AutomationPanel() {
  const automations = useWorkplaceStore((state) => state.automations);
  const toggleAutomation = useWorkplaceStore((state) => state.toggleAutomation);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Automation Mesh</h2>
          <p className="text-sm text-slate-400">
            Inspect automation health, triggers, and success rates for your agentic loops.
          </p>
        </div>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {automations.map((automation) => (
          <article
            key={automation.id}
            className="flex flex-col rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {automation.trigger}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">{automation.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => toggleAutomation(automation.id)}
                className={clsx(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border transition",
                  automation.status === "active"
                    ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30"
                    : "border-white/10 bg-white/10 text-slate-400 hover:text-white"
                )}
                aria-label={
                  automation.status === "active"
                    ? "Pause automation"
                    : "Activate automation"
                }
              >
                {automation.status === "active" ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              {automation.actions.map((action) => (
                <li key={action} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                  {action}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span
                className={clsx(
                  "rounded-full px-3 py-1 font-semibold uppercase tracking-wide",
                  automation.status === "active"
                    ? "bg-emerald-500/10 text-emerald-200"
                    : "bg-slate-800 text-slate-300"
                )}
              >
                {automation.status}
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-emerald-300">
                <Gauge className="h-4 w-4" />
                {Math.round(automation.successRate * 100)}% success
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
