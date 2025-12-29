'use client';

import { FormEvent, useMemo, useState } from "react";
import clsx from "clsx";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import type { WorkplaceTask } from "@/lib/types";

const defaultTask: Omit<WorkplaceTask, "id" | "createdAt"> = {
  title: "",
  objective: "",
  assignedModelId: null,
  priority: "medium",
  stage: "intake",
  tags: [],
  blockers: undefined
};

export function TaskComposer() {
  const createTask = useWorkplaceStore((state) => state.createTask);
  const models = useWorkplaceStore((state) => state.models);
  const [form, setForm] = useState(defaultTask);
  const [tagsInput, setTagsInput] = useState("");

  const canSubmit = useMemo(
    () => form.title.trim().length > 4 && form.objective.trim().length > 8,
    [form.title, form.objective]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    const tags = Array.from(
      new Set([...form.tags, ...tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean)])
    );
    createTask({ ...form, tags });
    setForm(defaultTask);
    setTagsInput("");
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
      <form className="space-y-4 text-sm text-slate-200" onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Create Mission</h2>
            <p className="text-xs text-slate-400">
              Spin up a new task, route it to the right model, and drop metadata for context.
            </p>
          </div>
          <PrioritySelector
            value={form.priority}
            onChange={(priority) => setForm((prev) => ({ ...prev, priority }))}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Ship workflow automation playbook"
              className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/30"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Assign</span>
            <select
              value={form.assignedModelId ?? ""}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  assignedModelId: event.target.value === "" ? null : event.target.value
                }))
              }
              className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/30"
            >
              <option value="">Auto route later</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">Objective</span>
          <textarea
            value={form.objective}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, objective: event.target.value }))
            }
            placeholder="Detail the mission intent, acceptance criteria, linked docs, and necessary guardrails."
            rows={3}
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/30"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">Tags</span>
          <input
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="research, partnership, qa"
            className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/30"
          />
        </label>
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-brand-500 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition enabled:hover:bg-brand-400 disabled:bg-slate-700 disabled:text-slate-400"
          >
            Launch task
          </button>
        </div>
      </form>
    </section>
  );
}

function PrioritySelector({
  value,
  onChange
}: {
  value: WorkplaceTask["priority"];
  onChange: (priority: WorkplaceTask["priority"]) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 p-1">
      {(["low", "medium", "high"] as const).map((priority) => {
        const isActive = priority === value;
        return (
          <button
            key={priority}
            type="button"
            onClick={() => onChange(priority)}
            className={clsx(
              "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition",
              isActive
                ? "bg-brand-500 text-white"
                : "bg-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            {priority}
          </button>
        );
      })}
    </div>
  );
}
