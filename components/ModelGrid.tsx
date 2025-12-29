'use client';

import { useMemo, useState } from "react";
import clsx from "clsx";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import type { AiModel } from "@/lib/types";

export function ModelGrid() {
  const models = useWorkplaceStore((state) => state.models);
  const tasks = useWorkplaceStore((state) => state.tasks);

  const [expanded, setExpanded] = useState<string | null>(null);

  const assignedCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const task of tasks) {
      if (task.assignedModelId) {
        map.set(task.assignedModelId, (map.get(task.assignedModelId) ?? 0) + 1);
      }
    }
    return map;
  }, [tasks]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Model Fleet</h2>
          <p className="text-sm text-slate-400">
            Status of orchestrated models, their current load, and capability surfaces.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {models.map((model) => (
          <article
            key={model.id}
            className={clsx(
              "group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-5 transition",
              expanded === model.id && "ring-2 ring-brand-400"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {model.provider}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">{model.name}</h3>
              </div>
              <StatusBadge status={model.status} />
            </div>

            <p className="mt-3 text-sm text-slate-300">{model.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {model.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                >
                  {capability}
                </span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Metric label="Current load" value={`${Math.round(model.load * 100)}%`} />
              <Metric
                label="Active tasks"
                value={(assignedCount.get(model.id) ?? 0).toString()}
              />
              <Metric label="Mode" value={model.modality.toUpperCase()} />
              <Metric label="Last sync" value={model.lastSync} />
            </div>

            <button
              type="button"
              onClick={() => setExpanded((prev) => (prev === model.id ? null : model.id))}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-200 transition hover:bg-brand-500/20"
            >
              {expanded === model.id ? "Hide Ops Profile" : "View Ops Profile"}
            </button>

            <ExpandedModelView model={model} visible={expanded === model.id} />
          </article>
        ))}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: AiModel["status"] }) {
  const styles: Record<AiModel["status"], string> = {
    online: "bg-emerald-500/15 text-emerald-300",
    degraded: "bg-amber-500/15 text-amber-200",
    training: "bg-sky-500/15 text-sky-200",
    offline: "bg-rose-500/15 text-rose-200"
  };
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 text-left">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function ExpandedModelView({ model, visible }: { model: AiModel; visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-full z-10 mt-3 translate-y-0 rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-sm text-slate-200 shadow-xl backdrop-blur-md transition-all">
      <p className="font-semibold text-white">Operational profile</p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Escalation</dt>
          <dd className="mt-1 text-sm">
            {model.status === "online"
              ? "Auto-escalate only on safety guard triggers."
              : "Route to GPT-4 Omni until reliability recovers."}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-400">Guardrails</dt>
          <dd className="mt-1 text-sm">
            {model.modality === "code"
              ? "Restricted to read/write in sandbox; requires approval for production pushes."
              : "Scoped to knowledge repositories with read-only toolset."}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-wide text-slate-400">Notes</dt>
          <dd className="mt-1 text-sm">
            {model.id === "model-deepseek"
              ? "Pair with GPT-4 Omni for architecture-level decisions; excels at refactors with detailed briefs."
              : "Sync capabilities weekly to keep orchestrator routing rules aligned."}
          </dd>
        </div>
      </dl>
    </div>
  );
}
