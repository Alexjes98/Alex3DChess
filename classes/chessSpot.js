class Spot {
  constructor(x, z, piece, gameObjet) {
    this.x = x;
    this.z = z;
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