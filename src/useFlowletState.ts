import { useCallback, useEffect, useMemo, useState } from "react";
import { ensureDay } from "./logic";
import { loadState, saveState } from "./storage";
import type { FlowletState, Routine, Task } from "./types";

function uid(): string {
  return crypto.randomUUID();
}

export function useFlowletState() {
  const [state, setState] = useState<FlowletState>(() =>
    ensureDay(loadState())
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  /** Call when tab gains focus or periodically to roll the day */
  const refreshDay = useCallback(() => {
    setState((s) => ensureDay(s));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => refreshDay(), 60_000);
    const onVis = () => {
      if (document.visibilityState === "visible") refreshDay();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refreshDay]);

  const completeTask = useCallback((flowId: string, taskId: string) => {
    setState((s) => {
      const next = ensureDay(s);
      if (next.completedTaskIds.includes(taskId)) return next;
      const skips = next.skippedByFlow[flowId] ?? [];
      return {
        ...next,
        completedTaskIds: [...next.completedTaskIds, taskId],
        skippedByFlow: {
          ...next.skippedByFlow,
          [flowId]: skips.filter((id) => id !== taskId),
        },
      };
    });
  }, []);

  const skipTask = useCallback((flowId: string, taskId: string) => {
    setState((s) => {
      const next = ensureDay(s);
      const skips = [...(next.skippedByFlow[flowId] ?? [])];
      const filtered = skips.filter((id) => id !== taskId);
      filtered.push(taskId);
      return {
        ...next,
        skippedByFlow: { ...next.skippedByFlow, [flowId]: filtered },
      };
    });
  }, []);

  const setDefaultFlow = useCallback((flowId: string) => {
    setState((s) => ({ ...ensureDay(s), defaultFlowId: flowId }));
  }, []);

  const setOverrideFlow = useCallback((flowId: string | null) => {
    setState((s) => ({ ...ensureDay(s), overrideFlowId: flowId }));
  }, []);

  const addRoutine = useCallback(
    (partial: Omit<Routine, "id">) => {
      setState((s) => ({
        ...ensureDay(s),
        routines: [...s.routines, { ...partial, id: uid() }],
      }));
    },
    []
  );

  const removeRoutine = useCallback((routineId: string) => {
    setState((s) => ({
      ...ensureDay(s),
      routines: s.routines.filter((r) => r.id !== routineId),
    }));
  }, []);

  const addTaskToFlow = useCallback((flowId: string, title: string) => {
    const t: Task = { id: uid(), title: title.trim() || "Untitled" };
    setState((s) => ({
      ...ensureDay(s),
      flows: s.flows.map((f) =>
        f.id === flowId ? { ...f, tasks: [...f.tasks, t] } : f
      ),
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem("flowlet-state-v1");
    setState(ensureDay(loadState()));
  }, []);

  return useMemo(
    () => ({
      state,
      setState,
      completeTask,
      skipTask,
      setDefaultFlow,
      setOverrideFlow,
      addRoutine,
      removeRoutine,
      addTaskToFlow,
      resetToDefaults,
      refreshDay,
    }),
    [
      state,
      completeTask,
      skipTask,
      setDefaultFlow,
      setOverrideFlow,
      addRoutine,
      removeRoutine,
      addTaskToFlow,
      resetToDefaults,
      refreshDay,
    ]
  );
}
