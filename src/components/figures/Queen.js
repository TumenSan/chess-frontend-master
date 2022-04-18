import bq from "../../assets/bq.png";
import wq from "../../assets/wq.png";
import { getRowColDiff } from "./helpers";

export class Queen {
  constructor(player) {
    this.player = player;
    this.highlight = false;
    this.icon = <img alt="fff" src={player === "w" ? wq : bq} />;
    this.ascii = player === "w" ? "Q" : "q";
  }

  canMove(start, end) {
    const { rowDiff, colDiff } = getRowColDiff(start, end);

    if (rowDiff > 0 && colDiff === 0) {
      return true;
    } else if (rowDiff === 0 && colDiff > 0) {
      return true;
    } else if (rowDiff < 0 && colDiff === 0) {
      return true;
    } else if (rowDiff === 0 && colDiff < 0) {
      return true;
    } else if (rowDiff === colDiff) {
      return true;
    } else if (rowDiff === -colDiff) {
      return true;
    }
    return false;
  }
}
