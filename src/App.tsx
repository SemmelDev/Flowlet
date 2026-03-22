import { useState } from "react";
import { AutomateView } from "./components/AutomateView";
import { FlowsView } from "./components/FlowsView";
import { TodayView } from "./components/TodayView";
import { useFlowletState } from "./useFlowletState";

type Tab = "today" | "flows" | "automate";

export function App() {
  const [tab, setTab] = useState<Tab>("today");
  const {
    state,
    completeTask,
    skipTask,
    setDefaultFlow,
    setOverrideFlow,
    addRoutine,
    removeRoutine,
    addTaskToFlow,
    resetToDefaults,
  } = useFlowletState();

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Flowlet</h1>
        <p className="app-tagline">
          A few small steps, in order — never a long list.
        </p>
      </header>

      <nav className="nav" aria-label="Primary">
        <button
          type="button"
          className={tab === "today" ? "active" : undefined}
          onClick={() => setTab("today")}
        >
          Today
        </button>
        <button
          type="button"
          className={tab === "flows" ? "active" : undefined}
          onClick={() => setTab("flows")}
        >
          Flows
        </button>
        <button
          type="button"
          className={tab === "automate" ? "active" : undefined}
          onClick={() => setTab("automate")}
        >
          Automate
        </button>
      </nav>

      <main>
        {tab === "today" ? (
          <TodayView
            state={state}
            onComplete={completeTask}
            onSkip={skipTask}
            onPickFlow={setOverrideFlow}
          />
        ) : null}
        {tab === "flows" ? (
          <FlowsView state={state} onAddTask={addTaskToFlow} />
        ) : null}
        {tab === "automate" ? (
          <AutomateView
            state={state}
            onSetDefaultFlow={setDefaultFlow}
            onAddRoutine={addRoutine}
            onRemoveRoutine={removeRoutine}
            onReset={resetToDefaults}
          />
        ) : null}
      </main>
    </div>
  );
}
