import { useState } from "react";
import type { FlowletState } from "../types";

type Props = {
  state: FlowletState;
  onAddTask: (flowId: string, title: string) => void;
};

export function FlowsView({ state, onAddTask }: Props) {
  const [openId, setOpenId] = useState<string | null>(state.flows[0]?.id ?? null);
  const [draft, setDraft] = useState("");

  return (
    <div>
      <h2 className="section-title">Flows</h2>
      <p className="section-lead">
        Flows group tiny habits. Only a few surface at once on Today.
      </p>
      {state.flows.map((f) => {
        const open = openId === f.id;
        return (
          <div key={f.id} className="list-card">
            <button
              type="button"
              className="flow-toggle"
              onClick={() => setOpenId(open ? null : f.id)}
            >
              <h3>{f.name}</h3>
              <p>
                {f.contextLabel} · {f.tasks.length} steps
              </p>
            </button>
            {open ? (
              <div style={{ marginTop: "14px" }}>
                <ul
                  style={{
                    margin: "0 0 12px",
                    paddingLeft: "18px",
                    color: "var(--muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  {f.tasks.map((t) => (
                    <li key={t.id}>{t.title}</li>
                  ))}
                </ul>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onAddTask(f.id, draft);
                    setDraft("");
                  }}
                >
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label htmlFor={`add-${f.id}`}>Add a small step</label>
                    <input
                      id={`add-${f.id}`}
                      placeholder="e.g. Tidy desk for one minute"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginTop: "10px" }}
                  >
                    Add to flow
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
