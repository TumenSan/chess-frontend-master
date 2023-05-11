import { observable } from 'mobx';

const GameState = observable({
    activePlayer: "",
    history: [],
    isAnalysis: "",
    tasksHistory: [],
    opponent: ""
});

export default GameState;