class Spot {
  constructor(x, y, piece, gameObjet) {
    this.x = x;
    this.y = y;
    this.piece = piece || null;
    this.gameObjet = gameObjet || null;
  }
  occupySpot(piece) {
    this.piece = piece;
  }
  releaseSpot() {
    this.piece = null;
  }
}

export { Spot };