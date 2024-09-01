class Piece {
  constructor(color, positionId, player, range, movementPattern) {
    this.color = color;
    this.player = player;

    this.range = range || 1;
    this.movementPattern = movementPattern; // add-subtract to i/j

    this.positionId = positionId;
    this.possibleMoves = [];
  }
}

class King extends Piece {
  constructor(color, positionId, player) {
    super(color, positionId, player);
    this.name = "King";
  }
}

class Queen extends Piece {
  constructor(color, positionId, player) {
    super(color, positionId, player);
    this.name = "Queen";
  }
}

class Knight extends Piece {
  constructor(color, positionId, player) {
    super(color, positionId, player);
    this.name = "Knight";
  }
}

class Bishop extends Piece {
  constructor(color, positionId, player) {
    super(color, positionId, player);
    this.name = "Bishop";
  }
}

class Rook extends Piece {
  constructor(color, positionId, player, range, movementPattern) {
    super(color, positionId, player, range, movementPattern);
    this.name = "Rook";
  }
}

class Pawn extends Piece {
  constructor(color, positionId, player) {
    super(color, positionId, player);
    this.name = "Pawn";
  }
}

export { Pawn, Rook, Knight, Bishop, Queen, King };
