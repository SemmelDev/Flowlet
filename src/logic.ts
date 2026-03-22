import { currentDayOfWeek, currentHour, todayKey } from "./dateUtils";
import type { Flow, FlowletState, Routine, Task } from "./types";

const MAX_VISIBLE = 3;

export function ensureDay(state: FlowletState): FlowletState {
  const key = todayKey();
  if (state.dayKey === key) return state;
  return {
    ...state,
    dayKey: key,
    completedTaskIds: [],
    skippedByFlow: {},
  };
}

function hourInRange(h: number, start: number, end: number): boolean {
  if (end > start) return h >= start && h < end;
  // overnight window e.g. 22–6
  return h >= start || h < end;
}

export function activeRoutine(
  routines: Routine[],
  now: Date = new Date()
): Routine | undefined {
  const h = currentHour(now);
  const dow = currentDayOfWeek(now);
  return routines.find(
    (r) => r.days.includes(dow) && hourInRange(h, r.startHour, r.endHour)
  );
}

export function resolveActiveFlowId(state: FlowletState): string {
  const r = activeRoutine(state.routines);
  if (r && state.flows.some((f) => f.id === r.flowId)) return r.flowId;
  if (state.flows.some((f) => f.id === state.defaultFlowId))
    return state.defaultFlowId;
  return state.flows[0]?.id ?? "";
}

export function activeFlowId(state: FlowletState): string {
  if (
    state.overrideFlowId &&
    state.flows.some((f) => f.id === state.overrideFlowId)
  ) {
    return state.overrideFlowId;
  }
  return resolveActiveFlowId(state);
}

export function flowById(state: FlowletState, id: string): Flow | undefined {
  return state.flows.find((f) => f.id === id);
}

/** Pending tasks for a flow today, with skipped tasks at the end; max MAX_VISIBLE. */
export function visibleTasks(state: FlowletState, flowId: string): Task[] {
  const flow = state.flows.find((f) => f.id === flowId);
  if (!flow) return [];
  const done = new Set(state.completedTaskIds);
  const pending = flow.tasks.filter((t) => !done.has(t.id));
  const skipped = state.skippedByFlow[flowId] ?? [];
  const skipSet = new Set(skipped);
  const notSkipped = pending.filter((t) => !skipSet.has(t.id));
  const skippedOrdered = skipped
    .map((id) => pending.find((t) => t.id === id))
    .filter((t): t is Task => Boolean(t));
  const ordered = [...notSkipped, ...skippedOrdered];
  return ordered.slice(0, MAX_VISIBLE);
}

export function progressLine(state: FlowletState, flowId: string): string {
  const flow = state.flows.find((f) => f.id === flowId);
  if (!flow) return "";
  const done = new Set(state.completedTaskIds);
  const total = flow.tasks.length;
  const n = flow.tasks.filter((t) => done.has(t.id)).length;
  return `${n} of ${total} done today`;
}
