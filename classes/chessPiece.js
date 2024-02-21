class Piece {
  constructor(color, position) {
    this.color = color;
    this.position = position;
    this.gameObjet = null;
  }
}

class King extends Piece {
  constructor(color, position) {
    super(color, position);
    this.name = "King";
  }
}

class Queen extends Piece {
  constructor(color, position) {
    super(color, position);
    this.name = "Queen";
  }
}

class Knight extends Piece {
  constructor(color, position) {
    super(color, position);
    this.name = "Knight";
  }
}

class Bishop extends Piece {
  constructor(color, position) {
    super(color, position);
    this.name = "Bishop";
  }
}

class Rook extends Piece {
  constructor(color, position) {
    super(color, position);
    this.name = "Rook";
  }
}

class Pawn extends Piece {
  constructor(color, position) {
    super(color, position);
    this.name = "Pawn";
  }
}

export { Pawn, Rook, Knight, Bishop, Queen, King };