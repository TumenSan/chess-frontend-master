import { BoardWatchGame } from "../BoardWatchGame";
import { Toolbar } from "../Toolbar";
import { ActionPanelWatchGame } from "../ActionPanelWatchGame";
import { AnalysisPanel } from "../AnalysisPanel";
import { observer } from 'mobx-react-lite';
import "./App.css";
import { Route, Routes } from 'react-router-dom';

export const WatchGames = observer(() => {

  return (
    <div className="app">
        <Toolbar />
        <BoardWatchGame />
        <ActionPanelWatchGame />
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
