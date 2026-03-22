import { useMemo, useState } from "react";
import type { FlowletState, Routine } from "../types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  state: FlowletState;
  onSetDefaultFlow: (flowId: string) => void;
  onAddRoutine: (r: Omit<Routine, "id">) => void;
  onRemoveRoutine: (id: string) => void;
  onReset: () => void;
};

export function AutomateView({
  state,
  onSetDefaultFlow,
  onAddRoutine,
  onRemoveRoutine,
  onReset,
}: Props) {
  const [name, setName] = useState("");
  const [flowId, setFlowId] = useState(state.flows[0]?.id ?? "");
  const [start, setStart] = useState(9);
  const [end, setEnd] = useState(12);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const routineSummary = useMemo(() => {
    return state.routines.map((r) => {
      const flow = state.flows.find((f) => f.id === r.flowId);
      return { r, flowName: flow?.name ?? "Flow" };
    });
  }, [state.routines, state.flows]);

  function toggleDay(d: number) {
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()
    );
  }

  return (
    <div>
      <h2 className="section-title">Automate</h2>
      <p className="section-lead">
        Light routines pick the right flow for the time of day. You can still
        override on Today.
      </p>

      <div className="list-card">
        <h3 style={{ marginBottom: "10px" }}>Default flow</h3>
        <p className="muted" style={{ marginBottom: "12px" }}>
          Used when no routine matches the clock.
        </p>
        <select
          value={state.defaultFlowId}
          onChange={(e) => onSetDefaultFlow(e.target.value)}
        >
          {state.flows.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <h3
        className="section-title"
        style={{ fontSize: "1rem", marginTop: "28px" }}
      >
        Routines
      </h3>
      {routineSummary.map(({ r, flowName }) => (
        <div key={r.id} className="list-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h3>{r.name}</h3>
              <p>
                {flowName} · {formatHours(r.startHour, r.endHour)} ·{" "}
                {r.days.map((d) => DAYS[d]).join(", ")}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => onRemoveRoutine(r.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="list-card" style={{ marginTop: "16px" }}>
        <h3 style={{ marginBottom: "12px" }}>New routine</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!flowId || !name.trim() || days.length === 0) return;
            onAddRoutine({
              name: name.trim(),
              flowId,
              startHour: start,
              endHour: end,
              days,
            });
            setName("");
          }}
        >
          <div className="field">
            <label htmlFor="rn">Name</label>
            <input
              id="rn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Afternoon reset"
            />
          </div>
          <div className="field">
            <label htmlFor="rf">Flow</label>
            <select
              id="rf"
              value={flowId}
              onChange={(e) => setFlowId(e.target.value)}
            >
              {state.flows.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="row-2">
            <div className="field">
              <label htmlFor="rs">Start hour</label>
              <input
                id="rs"
                type="number"
                min={0}
                max={23}
                value={start}
                onChange={(e) => setStart(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label htmlFor="re">End hour</label>
              <input
                id="re"
                type="number"
                min={1}
                max={24}
                value={end}
                onChange={(e) => setEnd(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="field">
            <span
              style={{
                display: "block",
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--faint)",
                marginBottom: "8px",
              }}
            >
              Days
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {DAYS.map((label, d) => (
                <button
                  key={label}
                  type="button"
                  className={`btn btn-quiet ${days.includes(d) ? "on" : ""}`}
                  onClick={() => toggleDay(d)}
                  aria-pressed={days.includes(d)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Add routine
          </button>
        </form>
      </div>

      <div className="danger-zone">
        <button type="button" className="linkish" onClick={onReset}>
          Reset sample data
        </button>
      </div>
    </div>
  );
}

function formatHours(startHour: number, endHour: number): string {
  const a = formatHour(startHour);
  const b = endHour >= 24 ? "midnight" : formatHour(endHour);
  return `${a}–${b}`;
}

function formatHour(h: number): string {
  const am = h < 12 || h === 24;
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh} ${am ? "a.m." : "p.m."}`;
}
