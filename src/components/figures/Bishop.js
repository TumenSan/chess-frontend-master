import bb from "../../assets/bb.png";
import wb from "../../assets/wb.png";
import { getRowColDiff } from "./helpers";

export class Bishop {
  constructor(player) {
    this.player = player;
    this.highlight = false;
    this.icon = <img alt="fff" src={player === "w" ? wb : bb} />;
    this.ascii = player === "w" ? "B" : "b";
  }

  canMove(start, end) {
    const { rowDiff, colDiff } = getRowColDiff(start, end);

    if (rowDiff === colDiff) {
      return true;
    } else if (rowDiff === -colDiff) {
      return true;
    }
    return false;
  }
}
