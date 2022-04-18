export class Empty {
  constructor(player) {
    this.player = player;
    this.highlight = false;
    this.icon = null;
    this.ascii = null;
  }

  canMove() {
    return false;
  }
}
