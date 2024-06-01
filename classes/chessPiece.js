class Piece {
  constructor(color, position, player) {
    this.color = color;
    this.position = position || [0, 0];
    this.player = player;
  }
}

class King extends Piece {
  constructor(color, position, player) {
    super(color, position, player);
    this.name = "King";
  }
}

class Queen extends Piece {
  constructor(color, position, player) {
    super(color, position, player);
    this.name = "Queen";
  }
}

class Knight extends Piece {
  constructor(color, position, player) {
    super(color, position, player);
    this.name = "Knight";
  }
}

class Bishop extends Piece {
  constructor(color, position, player) {
    super(color, position, player
      );
    this.name = "Bishop";
  }
}

class Rook extends Piece {
  constructor(color, position, player
    ) {
    super(color, position, player);
    this.name = "Rook";
  }
}

class Pawn extends Piece {
  constructor(color, position, player) {
    super(color, position, player);
    this.name = "Pawn";
  }
}

export { Pawn, Rook, Knight, Bishop, Queen, King };