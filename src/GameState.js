import { observable } from 'mobx';

const GameState = observable({
    activePlayer: "",
    history: []
});

export default GameState;