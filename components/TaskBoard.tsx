'use client';

import { useMemo } from "react";
import clsx from "clsx";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import type { TaskStage, WorkplaceTask } from "@/lib/types";

const stages: { id: TaskStage; label: string; accent: string }[] = [
  { id: "intake", label: "Intake", accent: "from-slate-800 via-slate-900 to-slate-950" },
  { id: "research", label: "Research", accent: "from-sky-700 via-slate-900 to-slate-950" },
  {
    id: "execution",
    label: "Execution",
    accent: "from-brand-700 via-slate-900 to-slate-950"
  },
  { id: "review", label: "Review", accent: "from-amber-600 via-slate-900 to-slate-950" },
  { id: "complete", label: "Complete", accent: "from-emerald-700 via-slate-900 to-slate-950" }
];

export function TaskBoard() {
  const tasks = useWorkplaceStore((state) => state.tasks);
  const updateStage = useWorkplaceStore((state) => state.updateTaskStage);
  const assignTask = useWorkplaceStore((state) => state.assignTask);
  const models = useWorkplaceStore((state) => state.models);

  const grouped = useMemo(() => {
    const map = new Map<TaskStage, WorkplaceTask[]>();
    for (const stage of stages) {
      map.set(stage.id, []);
    }
    for (const task of tasks) {
      map.get(task.stage)?.push(task);
    }
    return map;
  }, [tasks]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Mission Pipeline</h2>
          <p className="text-sm text-slate-400">
            Track task orchestration across stages and delegate to best-fit models.
          </p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        {stages.map((stage) => {
          const stageTasks = grouped.get(stage.id) ?? [];
          return (
            <div
              key={stage.id}
              className={clsx(
                "rounded-3xl border border-white/5 bg-gradient-to-b p-4",
                stage.accent
              )}
            >
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                  {stage.label}
                </h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                  {stageTasks.length}
                </span>
              </header>
              <div className="mt-4 space-y-3">
                {stageTasks.map((task) => (
                  <article
                    key={task.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-200 shadow-inner"
                  >
                    <p className="text-xs uppercase tracking-wide text-brand-200">
                      {task.priority.toUpperCase()} PRIORITY
                    </p>
                    <h4 className="mt-1 text-base font-semibold text-white">{task.title}</h4>
                    <p className="mt-2 text-xs text-slate-300">{task.objective}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {task.blockers && (
                      <p className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                        Blocker: {task.blockers}
                      </p>
                    )}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>
                          Owner:{" "}
                          <strong className="text-slate-100">
                            {task.assignedModelId
                              ? models.find((model) => model.id === task.assignedModelId)?.name ??
                                "Unknown model"
                              : "Unassigned"}
                          </strong>
                        </span>
                        <span>
                          {new Date(task.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                      <select
                        value={task.assignedModelId ?? ""}
                        onChange={(event) => assignTask(task.id, event.target.value)}
                        className="w-full rounded-xl bg-slate-900/80 px-3 py-2 text-xs text-white outline-none ring-1 ring-white/10 focus:ring-brand-300"
                      >
                        <option value="">Route to...</option>
                        {models.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                      <StageControls
                        currentStage={task.stage}
                        onStageChange={(nextStage) => updateStage(task.id, nextStage)}
                      />
                    </div>
                  </article>
                ))}
                {stageTasks.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-3 py-8 text-center text-xs text-slate-300">
                    Ready for next handoff.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const stageSequence: TaskStage[] = ["intake", "research", "execution", "review", "complete"];

function StageControls({
  currentStage,
  onStageChange
}: {
  currentStage: TaskStage;
  onStageChange: (stage: TaskStage) => void;
}) {
  const currentIndex = stageSequence.indexOf(currentStage);
  const prevStage = currentIndex > 0 ? stageSequence[currentIndex - 1] : null;
  const nextStage =
    currentIndex >= 0 && currentIndex < stageSequence.length - 1
      ? stageSequence[currentIndex + 1]
      : null;

  return (
    <div className="flex items-center justify-between text-xs">
      <button
        type="button"
        disabled={!prevStage}
        onClick={() => prevStage && onStageChange(prevStage)}
        className={clsx(
          "rounded-full px-3 py-1 font-semibold uppercase tracking-wide",
          prevStage
            ? "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
            : "border border-white/5 bg-white/5 text-slate-500"
        )}
      >
        Back
      </button>
      <span className="font-mono text-slate-300">{currentStage.toUpperCase()}</span>
      <button
        type="button"
        disabled={!nextStage}
        onClick={() => nextStage && onStageChange(nextStage)}
        className={clsx(
          "rounded-full px-3 py-1 font-semibold uppercase tracking-wide",
          nextStage
            ? "border border-brand-400/40 bg-brand-500/20 text-brand-50 hover:bg-brand-500/30"
            : "border border-white/5 bg-white/5 text-slate-500"
        )}
      >
        Advance
      </button>
    </div>
  );
}
