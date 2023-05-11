import { useState } from "react";
import { Board } from "./components/Board";
import { BoardTasks } from "./components/BoardTasks";
import { UsefulMaterials } from "./components/UsefulMaterials";
import { WatchGames } from "./components/WatchGames";
import { Toolbar } from "./components/Toolbar";
import { Chat } from "./components/Chat";
import { ActionPanel } from "./components/ActionPanel";
import { observable } from 'mobx';
import {BrowserRouter,
    Route, Routes
} from 'react-router-dom';
import "./App.css";

const App = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="app">
      <BrowserRouter>
        <Toolbar setShowChat={setShowChat} />
            <Routes>
                <Route path="/*" element={<>
                    <Board />
                    <ActionPanel />
                </>}></Route>
                <Route path="/tasks/tactics/*" element={<>
                    <BoardTasks />
                    <h1>Тактика</h1>
                </>}></Route>
                <Route path="/tasks/opening/*" element={<>
                    <BoardTasks />
                    <h1>Дебют</h1>
                </>}></Route>
                <Route path="/tasks/endgame/*" element={<>
                    <BoardTasks />
                    <h1>Эндшпиль</h1>
                </>}></Route>
                <Route path="/watchgames/*" element={<WatchGames/>}></Route>
                <Route path="/usefulmaterials/*" element={<UsefulMaterials />}></Route>
                <Route path="*" element={(<h1>Ошибка</h1>)}></Route>
            </Routes>
        </BrowserRouter>
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<Chat visible={showChat} close={() => setShowChat(false)} />}></Route>
                <Route path="*" element={(<h1>Ошибка</h1>)}></Route>
            </Routes>
        </BrowserRouter>
    </div>
  );
};

export default App;
