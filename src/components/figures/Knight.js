import bn from "../../assets/bn.png";
import wn from "../../assets/wn.png";
import { getRowColDiff } from "./helpers";

export class Knight {
  constructor(player) {
    this.player = player;
    this.highlight = false;
    this.icon = <img alt="fff" src={player === "w" ? wn : bn} />;
    this.ascii = player === "w" ? "N" : "n";
  }

  canMove(start, end) {
    const { rowDiff, colDiff } = getRowColDiff(start, end);

    const rowDiffAbs = Math.abs(rowDiff);
    const colDiffAbs = Math.abs(colDiff);
    if (rowDiffAbs === 1 && colDiffAbs === 2) {
      return true;
    }
    if (rowDiffAbs === 2 && colDiffAbs === 1) {
      return true;
    }
    return false;
  }
}
