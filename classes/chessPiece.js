class Piece {
  constructor(color, position, gameObject, player, helper) {
    this.color = color;
    this.position = position || [0, 0];
    this.gameObject = gameObject;
    this.player = player;
    this.helper = helper;
  }

  getGameObject() {
    return this.gameObject;
  }
}

class King extends Piece {
  constructor(color, position, gameObject, player, helper) {
    super(color, position, gameObject, player, helper);
    this.name = "King";
  }
}

class Queen extends Piece {
  constructor(color, position, gameObject, player, helper) {
    super(color, position, gameObject, player, helper);
    this.name = "Queen";
  }
}

class Knight extends Piece {
  constructor(color, position, gameObject, player, helper) {
    super(color, position, gameObject, player, helper);
    this.name = "Knight";
  }
}

class Bishop extends Piece {
  constructor(color, position, gameObject, player, helper) {
    super(color, position,
      gameObject, player, helper
      );
    this.name = "Bishop";
  }
}

class Rook extends Piece {
  constructor(color, position,
    gameObject, player, helper
    ) {
    super(color, position, gameObject, player, helper);
    this.name = "Rook";
  }
}

class Pawn extends Piece {
  constructor(color, position,
    gameObject, player, helper) {
    super(color, position, gameObject, player, helper);
    this.name = "Pawn";
  }
}

export { Pawn, Rook, Knight, Bishop, Queen, King };