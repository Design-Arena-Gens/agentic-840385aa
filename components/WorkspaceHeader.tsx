'use client';

import { useMemo } from "react";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { formatDistanceToNow } from "date-fns";

export function WorkspaceHeader() {
  const models = useWorkplaceStore((state) => state.models);
  const tasks = useWorkplaceStore((state) => state.tasks);

  const { onlineModels, avgLoad, activeTasks } = useMemo(() => {
    const online = models.filter((model) => model.status === "online").length;
    const load =
      models.reduce((acc, model) => acc + model.load, 0) / (models.length || 1);
    const active = tasks.filter((task) => task.stage !== "complete").length;
    return { onlineModels: online, avgLoad: load, activeTasks: active };
  }, [models, tasks]);

  const lastChange = useMemo(() => {
    if (tasks.length === 0) return "No activity yet";
    const latest = tasks
      .map((task) => task.createdAt)
      .sort()
      .at(-1);
    return latest
      ? `${formatDistanceToNow(new Date(latest), { addSuffix: true })}`
      : "No activity";
  }, [tasks]);

  return (
    <header className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-brand-300">
            Agentic Control Surface
          </p>
          <h1 className="mt-2 text-3xl font-medium text-white sm:text-4xl">
            AI Workplace Command Center
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Orchestrate multi-model workflows, track automation health, and coordinate
            tasks across your AI workforce from a single surface.
          </p>
        </div>
        <div className="grid w-full max-w-md grid-cols-2 gap-3 text-sm text-slate-200 sm:text-base">
          <MetricPill label="Models online" value={`${onlineModels}/${models.length}`} />
          <MetricPill label="Active tasks" value={activeTasks.toString()} />
          <MetricPill label="Fleet load" value={`${Math.round(avgLoad * 100)}%`} />
          <MetricPill label="Last intake" value={lastChange} />
        </div>
      </div>
    </header>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}
