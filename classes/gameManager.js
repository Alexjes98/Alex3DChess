class GameManager {
  constructor(selectedObject, boardMap, gamePieces) {
    this.selectedObject = selectedObject;
    this.gamePieces = gamePieces || [];
    this.boardMap = boardMap || [];
  }
  showBoard() {
    console.log(this.boardMap);
  }

  unmarkAll() {    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {        
        this.boardMap[i][j].tdObject.material.emissive.setHex(0x000000);
      }
    }
  }

  calculatePossibleMoves() {
    const column = this.selectedObject.col;
    const row = this.selectedObject.row;
    const range = this.selectedObject.gameObject.range;
    const moves = this.selectedObject.gameObject.movementPattern.map(
      (pattern) => {
        console.log(pattern);
        return this.checkPattern(pattern, column, row, range, 1);
      }
    );
    console.log(moves.flat());
  }

  checkPattern(pattern, column, row, range) {
    const moves = [];
    let iterations = 0;
    if (pattern === "foward") {
      for (let j = row + 1; j < 8; j++) {        
        iterations++;
        const { occupied, position } = this.checkPosition(column, j);        
        if (position) moves.push(position);
        if (occupied || iterations === range) break;
      }
    } else if (pattern === "back") {
      for (let j = row - 1; j > -1; j--) {
        iterations++;
        const { occupied, position } = this.checkPosition(column, j);
        if (position) moves.push(position);
        if (occupied || iterations === range) break;
      }
    } else if (pattern === "left") {
      for (let i = column + 1; i < 8; i++) {
        iterations++;
        const { occupied, position } = this.checkPosition(i, row);
        if (position) moves.push(position);
        if (occupied || iterations === range) break;
      }
    } else if (pattern === "right") {
      for (let i = column - 1; i > -1; i--) {
        iterations++;
        const { occupied, position } = this.checkPosition(i, row);
        if (position) moves.push(position);
        if (occupied || iterations === range) break;
      }
    } else if (pattern === "foward-right") {
      for (let i = column + 1, j = row + 1; i < 8 && j < 8; i++, j++) {
        iterations++;
        const { occupied, position } = this.checkPosition(i, j);
        if (position) moves.push(position);
        if (occupied || iterations === range) break;
      }
    } else if (pattern === "foward-left") {
      for (let i = column - 1, j = row + 1; i > -1 && j < 8; i--, j++) {
        iterations++;
        const { occupied, position } = this.checkPosition(i, j);
        if (position) moves.push(position);
        if (occupied || iterations === range) break;
      }
    } else if (pattern === "back-left") {
      for (let i = column - 1, j = row - 1; i > -1 && j > -1; i--, j--) {
        iterations++;
        const { occupied, position } = this.checkPosition(i, j);
        if (position) moves.push(position);
        if (occupied || iterations === range) break;
      }
    } else if (pattern === "back-right") {
      for (let i = column + 1, j = row - 1; i < 8 && j > -1; i++, j--) {
        iterations++;
        const { occupied, position } = this.checkPosition(i, j);
        if (position) moves.push(position);
        if (occupied || iterations === range) break;
      }
    } else if (pattern === "knight") {
      console.log("knight");
    }
     else {
      throw new Error("Invalid pattern");
    }
    return moves;
  }

  checkPosition(i, j) {    
    const isOccupied = this.boardMap[i][j].occupied;
    const isAlliedPiece = this.boardMap[i][j].piece?.children[0].gameObject.player ===
    this.selectedObject.gameObject.player;
    const isEnemyPiece =
      isOccupied && !isAlliedPiece;
      
    if (!isOccupied) {
      this.boardMap[i][j].tdObject.material.emissive.setHex(0x91d994);
      return {
        occupied: this.boardMap[i][j].occupied,
        position: this.boardMap[i][j].positionId,
      };
    } else if (isEnemyPiece) {
      console.log("enemy");
      this.boardMap[i][j].tdObject.material.emissive.setHex(0xff0000);
      return {
        occupied: this.boardMap[i][j].occupied,
        position: this.boardMap[i][j].positionId,
      };
    }
    return { occupied: true, position: null };
  }

  addBoardRow(positionsArray) {
    let row = [];
    for (let i = 0; i < positionsArray.length; i++) {
      let spot = new Spot(
        positionsArray[i].id,
        positionsArray[i].row,
        positionsArray[i].col,
        positionsArray[i].occupied,
        positionsArray[i].tdObject,
        positionsArray[i].piece
      );
      row.push(spot);
    }
    this.boardMap.push(row);
  }
}

class Spot {
  constructor(positionId, row, col, occupied, tdObject, piece) {
    this.col = col;
    this.row = row;
    this.positionId = positionId;
    this.occupied = occupied;
    this.tdObject = tdObject;
    this.piece = piece;
  }
}

export default GameManager;
