export type Task = {
  id: string;
  title: string;
  hint?: string;
};

export type Flow = {
  id: string;
  name: string;
  contextLabel: string;
  tasks: Task[];
};

/** When the clock falls in [startHour, endHour) on one of `days`, this flow is suggested. */
export type Routine = {
  id: string;
  name: string;
  flowId: string;
  /** 0–23, inclusive start */
  startHour: number;
  /** 0–24, exclusive end (e.g. 12 means before noon) */
  endHour: number;
  /** 0 = Sunday … 6 = Saturday */
  days: number[];
};

export type FlowletState = {
  flows: Flow[];
  routines: Routine[];
  /** Task ids finished today (local calendar day). */
  completedTaskIds: string[];
  /** Per-flow order of skipped task ids for today (back of queue). */
  skippedByFlow: Record<string, string[]>;
  /** YYYY-MM-DD for daily reset */
  dayKey: string;
  /** When no routine matches, use this flow */
  defaultFlowId: string;
  /** User-picked flow for Today; cleared when switching back to automatic. */
  overrideFlowId: string | null;
};
