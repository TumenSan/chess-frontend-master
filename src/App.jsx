import { useState, useEffect } from "react";
import { Board } from "./components/Board";
import { UsefulMaterials } from "./components/UsefulMaterials";
import { WatchGames } from "./components/WatchGames";
import { Toolbar } from "./components/Toolbar";
import { Chat } from "./components/Chat";
import {BrowserRouter as Router,
    Route, Routes
} from 'react-router-dom';
import "./App.css";
import {ActionPanel} from "./components/ActionPanel";

const App = () => {
  const [showChat, setShowChat] = useState(false);
  const [history, setHistory] = useState([]);
  const [activePlayer, setActivePlayer] = useState("w");

    function handleStateChangeHistory(newState) {
        setHistory(newState);
        console.log("handleStateChangeHistory", history)
    }
    function handleStateChangeActivePlayer(newState) {
        setActivePlayer(newState);
        console.log("handleStateChangeActivePlayer", activePlayer)
    }

    useEffect(() => {
        // обновляем отображаемый текст при изменении пропса text
        //setDisplayText(text);
    }, [history]);

  return (
    <div className="app">
      <Toolbar setShowChat={setShowChat} />
        <Router>
            <Routes>
                <Route path="/*" element={
                    <>
                        <Board onStateChangeHistory={handleStateChangeHistory}
                               onStateChangeActivePlayer={handleStateChangeActivePlayer}/>
                        <ActionPanel
                            text={`Ход ${activePlayer === "b" ? "черных" : "белых"}`}
                            history={history}
                        />
                    </>
                }></Route>
                <Route path="/tasks/tactics/*" element={(<h1>Тактика</h1>)}></Route>
                <Route path="/tasks/opening/*" element={(<h1>Дебют</h1>)}></Route>
                <Route path="/tasks/endgame/*" element={(<h1>Эндшпиль</h1>)}></Route>
                <Route path="/watchgames/*" element={<WatchGames/>}></Route>
                <Route path="/usefulmaterials/*" element={<UsefulMaterials />}></Route>
                <Route path="*" element={(<h1>Ошибка</h1>)}></Route>
            </Routes>
        </Router>
        <Router>
            <Routes>
                <Route path="/*" element={<Chat visible={showChat} close={() => setShowChat(false)} />}></Route>
                <Route path="*" element={(<h1>Ошибка</h1>)}></Route>
            </Routes>
        </Router>
    </div>
  );
};

export default App;
