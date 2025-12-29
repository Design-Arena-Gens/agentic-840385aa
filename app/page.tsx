'use client';

import { WorkspaceHeader } from "@/components/WorkspaceHeader";
import { TaskComposer } from "@/components/TaskComposer";
import { TaskBoard } from "@/components/TaskBoard";
import { ModelGrid } from "@/components/ModelGrid";
import { AutomationPanel } from "@/components/AutomationPanel";
import { ActivityLog } from "@/components/ActivityLog";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <WorkspaceHeader />
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <TaskComposer />
          <TaskBoard />
        </div>
        <div className="space-y-6">
          <ModelGrid />
          <AutomationPanel />
          <ActivityLog />
        </div>
      </div>
    </main>
  );
}
