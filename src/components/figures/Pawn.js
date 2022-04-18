import bp from "../../assets/bp.png";
import wp from "../../assets/wp.png";
import { getRowColDiff } from "./helpers";

export class Pawn {
  constructor(player) {
    this.player = player;
    this.highlight = false;
    this.icon = <img alt="fff" src={player === "w" ? wp : bp} />;
    this.ascii = player === "w" ? "P" : "p";
  }

  canMove(start, end) {
    const { rowDiff, colDiff } = getRowColDiff(start, end);

    if (this.player === "w") {
      if (colDiff === 0) {
        if (rowDiff === 1 || rowDiff === 2) return true;
      } else if (colDiff === -1 || colDiff === 1) {
        if (rowDiff === 1) return true;
      }
    } else {
      if (colDiff === 0) {
        if (rowDiff === -2 || rowDiff === -1) return true;
      } else if (colDiff === -1 || colDiff === 1) {
        if (rowDiff === -1) return true;
      }
    }
    return false;
  }
}
