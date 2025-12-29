'use client';

import { create } from "zustand";
import { nanoid } from "nanoid";
import type {
  ActivityLogEntry,
  AiModel,
  Automation,
  TaskStage,
  WorkplaceTask
} from "@/lib/types";

interface WorkplaceState {
  models: AiModel[];
  tasks: WorkplaceTask[];
  automations: Automation[];
  activity: ActivityLogEntry[];
  createTask: (input: Omit<WorkplaceTask, "id" | "createdAt">) => void;
  updateTaskStage: (taskId: string, stage: TaskStage) => void;
  assignTask: (taskId: string, modelId: string) => void;
  toggleAutomation: (automationId: string) => void;
  logEvent: (entry: Omit<ActivityLogEntry, "id" | "timestamp">) => void;
}

const initialModels: AiModel[] = [
  {
    id: "model-gpt4o",
    name: "GPT-4 Omni",
    provider: "OpenAI",
    modality: "agent",
    status: "online",
    load: 0.56,
    capabilities: [
      "Complex reasoning",
      "Tool orchestration",
      "Cross-modal synthesis"
    ],
    lastSync: "5m ago",
    description: "Primary orchestrator capable of reasoning across tasks and delegating work."
  },
  {
    id: "model-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    modality: "text",
    status: "online",
    load: 0.42,
    capabilities: ["High-context summarization", "Spec drafting", "Decision support"],
    lastSync: "2m ago",
    description: "High-context writer ideal for policy drafts and strategic analysis."
  },
  {
    id: "model-deepseek",
    name: "DeepSeek Coder Pro",
    provider: "DeepSeek",
    modality: "code",
    status: "online",
    load: 0.71,
    capabilities: ["Software scaffolding", "Refactoring", "Test generation"],
    lastSync: "1m ago",
    description: "Optimized for codebase navigation and automated refactor proposals."
  },
  {
    id: "model-gemini",
    name: "Gemini Vision Expert",
    provider: "Google",
    modality: "vision",
    status: "degraded",
    load: 0.18,
    capabilities: ["Visual QA", "Design critique", "Slide synthesis"],
    lastSync: "14m ago",
    description: "Visual intelligence assistant for design review and multimodal research."
  }
];

const initialTasks: WorkplaceTask[] = [
  {
    id: "task-research-01",
    title: "Map competitive landscape for agentic copilots",
    objective: "Identify positioning and feature gaps across top competitors.",
    priority: "high",
    assignedModelId: "model-sonnet",
    stage: "research",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    tags: ["research", "strategy", "brief"],
    blockers: undefined
  },
  {
    id: "task-eng-02",
    title: "Draft integration guide for task routing API",
    objective: "Produce developer-ready documentation with code samples.",
    priority: "medium",
    assignedModelId: "model-deepseek",
    stage: "execution",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    tags: ["docs", "engineering"],
    blockers: "Awaiting OAuth scopes confirmation"
  },
  {
    id: "task-ops-03",
    title: "Align product update brief with leadership OKRs",
    objective: "Restructure weekly update to highlight key OKR outcomes.",
    priority: "low",
    assignedModelId: "model-gpt4o",
    stage: "review",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    tags: ["ops", "communication"]
  }
];

const initialAutomations: Automation[] = [
  {
    id: "automation-routing",
    name: "Task Router",
    trigger: "New intake form submission",
    actions: [
      "Classify task intent",
      "Estimate complexity",
      "Assign best-fit model",
      "Notify Slack channel"
    ],
    status: "active",
    successRate: 0.94
  },
  {
    id: "automation-retros",
    name: "Retro Synthesizer",
    trigger: "Weekly ops checkout",
    actions: ["Aggregate activity logs", "Draft retro brief", "Highlight risk areas"],
    status: "paused",
    successRate: 0.78
  },
  {
    id: "automation-safety",
    name: "Safety Guard",
    trigger: "Tool invocation request",
    actions: ["Run guardrails", "Escalate high-risk actions", "Log decision trail"],
    status: "active",
    successRate: 0.99
  }
];

const initialActivity: ActivityLogEntry[] = [
  {
    id: nanoid(),
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    actor: "GPT-4 Omni",
    message: "Delegated metric deep-dive to DeepSeek Coder Pro.",
    channel: "model",
    taskId: "task-eng-02"
  },
  {
    id: nanoid(),
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    actor: "System",
    message: "Slack automation paused due to rate-limit spike.",
    channel: "system"
  },
  {
    id: nanoid(),
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    actor: "Ops Analyst",
    message: "Requested briefing refinement ahead of leadership sync.",
    channel: "human",
    taskId: "task-ops-03"
  }
];

export const useWorkplaceStore = create<WorkplaceState>((set) => ({
  models: initialModels,
  tasks: initialTasks,
  automations: initialAutomations,
  activity: initialActivity,
  createTask: (input) =>
    set((state) => {
      const id = `task-${nanoid(6)}`;
      const createdAt = new Date().toISOString();
      const nextTask: WorkplaceTask = { id, createdAt, ...input };
      return {
        tasks: [nextTask, ...state.tasks],
        activity: [
          {
            id: nanoid(),
            timestamp: createdAt,
            actor: "System",
            channel: "system",
            message: `Task "${input.title}" created with priority ${input.priority}.`,
            taskId: id
          },
          ...state.activity
        ]
      };
    }),
  updateTaskStage: (taskId, stage) =>
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, stage } : task
      );
      const task = state.tasks.find((t) => t.id === taskId);
      const logEntry: ActivityLogEntry | null = task
        ? {
            id: nanoid(),
            timestamp: new Date().toISOString(),
            actor: task.assignedModelId
              ? state.models.find((m) => m.id === task.assignedModelId)?.name ?? "System"
              : "System",
            channel: task.assignedModelId ? "model" : "system",
            message: `Stage updated to ${stage.toUpperCase()} for "${task.title}".`,
            taskId
          }
        : null;
      return {
        tasks: updatedTasks,
        activity: logEntry ? [logEntry, ...state.activity] : state.activity
      };
    }),
  assignTask: (taskId, modelId) =>
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, assignedModelId: modelId } : task
      );
      const model = state.models.find((m) => m.id === modelId);
      const task = state.tasks.find((t) => t.id === taskId);
      const logEntry: ActivityLogEntry | null =
        model && task
          ? {
              id: nanoid(),
              timestamp: new Date().toISOString(),
              actor: model.name,
              channel: "model",
              message: `Claimed task "${task.title}".`,
              taskId
            }
          : null;
      return {
        tasks: updatedTasks,
        activity: logEntry ? [logEntry, ...state.activity] : state.activity
      };
    }),
  toggleAutomation: (automationId) =>
    set((state) => {
      const updated = state.automations.map((automation) => {
        if (automation.id !== automationId) {
          return automation;
        }
        const nextStatus: Automation["status"] =
          automation.status === "active" ? "paused" : "active";
        return {
          ...automation,
          status: nextStatus
        };
      });
      const automation = state.automations.find((a) => a.id === automationId);
      const logEntry: ActivityLogEntry | null = automation
        ? {
            id: nanoid(),
            timestamp: new Date().toISOString(),
            actor: "System",
            channel: "system",
            message: `${automation.name} ${
              automation.status === "active" ? "paused" : "reactivated"
            } by operator.`,
            taskId: undefined
          }
        : null;
      return {
        automations: updated,
        activity: logEntry ? [logEntry, ...state.activity] : state.activity
      };
    }),
  logEvent: (entry) =>
    set((state) => ({
      activity: [
        {
          id: nanoid(),
          timestamp: new Date().toISOString(),
          ...entry
        },
        ...state.activity
      ]
    }))
}));
