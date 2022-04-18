import bk from "../../assets/bk.png";
import wk from "../../assets/wk.png";
import { getRowColDiff } from "./helpers";

export class King {
  constructor(player) {
    this.player = player;
    this.highlight = false;
    this.icon = <img alt="fff" src={player === "w" ? wk : bk} />;
    this.ascii = player === "w" ? "K" : "k";
  }

  canMove(start, end) {
    const { rowDiff, colDiff } = getRowColDiff(start, end);

    const rowDiffAbs = Math.abs(rowDiff);
    const colDiffAbs = Math.abs(colDiff);
    if (rowDiffAbs === 1 && colDiffAbs === 1) {
      return true;
    } else if (rowDiffAbs === 1 && colDiffAbs === 0) {
      return true;
    } else if (rowDiffAbs === 0 && colDiffAbs === 1) {
      return true;
    } else if (rowDiffAbs === 0 && colDiffAbs === 2) {
      return true;
    }
    return false;
  }
}
