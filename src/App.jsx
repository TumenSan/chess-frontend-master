import { Board } from "./components/Board";
import { Toolbar } from "./components/Toolbar";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Toolbar />
      <div className="boardWrapper">
        <Board />
      </div>
    </div>
  );
};

export default App;
