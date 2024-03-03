class Piece {
  constructor(color, position) {
    this.color = color;
    this.position = position || [0, 0];
    this.gameObjet = null;
    this.player = null;
    this.helper = null;
  }
}

class King extends Piece {
  constructor(color, position, gameObjet, player, helper) {
    super(color, position, gameObjet, player, helper);
    this.name = "King";
  }
}

class Queen extends Piece {
  constructor(color, position, gameObjet, player, helper) {
    super(color, position, gameObjet, player, helper);
    this.name = "Queen";
  }
}

class Knight extends Piece {
  constructor(color, position, gameObjet, player, helper) {
    super(color, position, gameObjet, player, helper);
    this.name = "Knight";
  }
}

class Bishop extends Piece {
  constructor(color, position, gameObjet, player, helper) {
    super(color, position,
      gameObjet, player, helper
      );
    this.name = "Bishop";
  }
}

class Rook extends Piece {
  constructor(color, position,
    gameObjet, player, helper
    ) {
    super(color, position, gameObjet, player, helper);
    this.name = "Rook";
  }
}

class Pawn extends Piece {
  constructor(color, position,
    gameObjet, player, helper) {
    super(color, position, gameObjet, player, helper);
    this.name = "Pawn";
  }
}

export { Pawn, Rook, Knight, Bishop, Queen, King };