import {
  activeFlowId,
  activeRoutine,
  flowById,
  progressLine,
  resolveActiveFlowId,
  visibleTasks,
} from "../logic";
import type { FlowletState } from "../types";

type Props = {
  state: FlowletState;
  onComplete: (flowId: string, taskId: string) => void;
  onSkip: (flowId: string, taskId: string) => void;
  onPickFlow: (flowId: string | null) => void;
};

export function TodayView({
  state,
  onComplete,
  onSkip,
  onPickFlow,
}: Props) {
  const flowId = activeFlowId(state);
  const flow = flowById(state, flowId);
  const scheduled = activeRoutine(state.routines);
  const autoId = resolveActiveFlowId(state);
  const tasks = visibleTasks(state, flowId);
  const progress = progressLine(state, flowId);

  if (!flow) {
    return (
      <div className="empty-panel">
        Add a flow in Flows to get started.
      </div>
    );
  }

  const scheduleNote = state.overrideFlowId
    ? "You're steering this flow yourself."
    : scheduled
      ? `Routine: ${scheduled.name}`
      : "No routine matches now — using your default flow.";

  return (
    <div>
      <div className="flow-hero">
        <div className="flow-kicker">Now</div>
        <h2 className="flow-name">{flow.name}</h2>
        <p className="flow-context">{flow.contextLabel}</p>
        <div className="flow-meta">
          <span className="pill">{scheduleNote}</span>
        </div>
        <div className="flow-switcher">
          <label>Switch flow</label>
          {state.flows.map((f) => (
            <button
              key={f.id}
              type="button"
              className={f.id === flowId ? "on" : undefined}
              onClick={() => onPickFlow(f.id === autoId ? null : f.id)}
            >
              {f.name}
            </button>
          ))}
          {state.overrideFlowId ? (
            <button type="button" onClick={() => onPickFlow(null)}>
              Follow schedule
            </button>
          ) : null}
        </div>
      </div>

      <p className="muted" style={{ marginBottom: "18px" }}>
        {progress}
      </p>

      {tasks.length === 0 ? (
        <div className="empty-panel">
          Nothing left in this flow for today. Check back tomorrow, or switch
          flows.
        </div>
      ) : (
        <div className="task-stack">
          {tasks.map((t) => (
            <article key={t.id} className="task-card">
              <h3 className="task-title">{t.title}</h3>
              {t.hint ? <p className="task-hint">{t.hint}</p> : null}
              <div className="task-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onComplete(flowId, t.id)}
                >
                  Done
                </button>
                <button
                  type="button"
                  className="btn btn-quiet"
                  onClick={() => onSkip(flowId, t.id)}
                >
                  Skip for now
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
