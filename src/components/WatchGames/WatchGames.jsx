import { Board } from "../Board";
import { Toolbar } from "../Toolbar";
import { ActionPanel } from "../ActionPanel";
import { AnalysisPanel } from "../AnalysisPanel";
import "./App.css";

export const WatchGames = () => {

  return (
    <div className="app">
        <Toolbar />
        <Board />
        <ActionPanel />
        <AnalysisPanel />
    </div>
  );
};
