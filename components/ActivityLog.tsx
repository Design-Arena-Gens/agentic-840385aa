'use client';

import { formatDistanceToNow } from "date-fns";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";

const channelStyles = {
  system: "bg-slate-800 text-slate-100",
  model: "bg-brand-600 text-white",
  human: "bg-emerald-600 text-white"
} as const;

export function ActivityLog() {
  const activity = useWorkplaceStore((state) => state.activity);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Ops Event Stream</h2>
          <p className="text-sm text-slate-400">
            Structured event log of what&apos;s happening across the AI workplace.
          </p>
        </div>
      </header>
      <div className="mt-6 space-y-4">
        {activity.map((entry) => (
          <article
            key={entry.id}
            className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                  {entry.actor}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    channelStyles[entry.channel]
                  }`}
                >
                  {entry.channel}
                </span>
              </div>
              <time className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
              </time>
            </div>
            <p className="mt-3 text-sm">{entry.message}</p>
            {entry.taskId && (
              <p className="mt-3 inline-flex items-center rounded-full border border-brand-500/50 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-100">
                Task: {entry.taskId}
              </p>
            )}
          </article>
        ))}
        {activity.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-xs text-slate-300">
            No events yet. Automations and models will populate this stream in real time.
          </p>
        )}
      </div>
    </section>
  );
}
