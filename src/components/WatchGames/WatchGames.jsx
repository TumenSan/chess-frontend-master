import { Board } from "../Board";
import { Toolbar } from "../Toolbar";
import { ActionPanel } from "../ActionPanel";
import { AnalysisPanel } from "../AnalysisPanel";
import { observer } from 'mobx-react-lite';
import "./App.css";
import { Route, Routes } from 'react-router-dom';
import GameState from "../../GameState";

export const WatchGames = observer(() => {

  return (
    <div className="app">
        <Toolbar />
        <Board />
        <ActionPanel />
        <Routes>
            <Route
                path="/"
                element={<AnalysisPanel />}
            />
            <Route
                path=":id"
                element={<AnalysisPanel />}
            />
        </Routes>
    </div>
  );
});
