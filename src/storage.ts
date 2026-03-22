import { defaultState } from "./defaults";
import type { FlowletState } from "./types";

const KEY = "flowlet-state-v1";

export function loadState(): FlowletState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<FlowletState>;
    if (!parsed.flows?.length) return defaultState();
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      overrideFlowId: parsed.overrideFlowId ?? null,
      flows: parsed.flows,
      routines: parsed.routines?.length ? parsed.routines : base.routines,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: FlowletState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}
