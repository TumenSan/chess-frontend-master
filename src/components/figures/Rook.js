import br from "../../assets/br.png";
import wr from "../../assets/wr.png";
import { getRowColDiff } from "./helpers";

export class Rook {
  constructor(player) {
    this.player = player;
    this.highlight = false;
    this.icon = <img alt="fff" src={player === "w" ? wr : br} />;
    this.ascii = player === "w" ? "R" : "r";
  }

  canMove(start, end) {
    const { rowDiff, colDiff } = getRowColDiff(start, end);

    if (rowDiff !== 0 && colDiff === 0) {
      return true;
    }
    if (rowDiff === 0 && colDiff !== 0) {
      return true;
    }
    return false;
  }
}
