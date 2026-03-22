import type { FlowletState } from "./types";
import { todayKey } from "./dateUtils";

const morningId = "flow-morning";
const focusId = "flow-focus";
const windDownId = "flow-wind";

export function defaultState(): FlowletState {
  const dayKey = todayKey();
  return {
    dayKey,
    defaultFlowId: morningId,
    overrideFlowId: null,
    completedTaskIds: [],
    skippedByFlow: {},
    flows: [
      {
        id: morningId,
        name: "Morning",
        contextLabel: "Start soft",
        tasks: [
          { id: "t1", title: "Glass of water", hint: "~30 sec" },
          { id: "t2", title: "Stretch for two minutes", hint: "~2 min" },
          { id: "t3", title: "Open the window or step outside", hint: "~1 min" },
        ],
      },
      {
        id: focusId,
        name: "Deep work",
        contextLabel: "Before screens",
        tasks: [
          { id: "t4", title: "Write one priority for the block", hint: "~1 min" },
          { id: "t5", title: "Close chat and email", hint: "~30 sec" },
        ],
      },
      {
        id: windDownId,
        name: "Wind down",
        contextLabel: "Evening",
        tasks: [
          { id: "t6", title: "Dim lights", hint: "~30 sec" },
          { id: "t7", title: "Lay out clothes for tomorrow", hint: "~2 min" },
        ],
      },
    ],
    routines: [
      {
        id: "r1",
        name: "Early day",
        flowId: morningId,
        startHour: 6,
        endHour: 10,
        days: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        id: "r2",
        name: "Work block",
        flowId: focusId,
        startHour: 10,
        endHour: 17,
        days: [1, 2, 3, 4, 5],
      },
      {
        id: "r3",
        name: "Evening",
        flowId: windDownId,
        startHour: 20,
        endHour: 24,
        days: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
  };
}
