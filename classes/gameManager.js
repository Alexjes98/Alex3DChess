class GameManager {
  constructor(selectedObject, boardMap, gamePieces) {
    this.selectedObject = selectedObject;
    this.gamePieces = gamePieces || [];
    this.boardMap = boardMap || [];
  }
  showBoard() {
    console.log(this.boardMap);
  }

  calculatePossibleMoves(positionId, pieceObject) {
    console.log(
      "Calculating possible moves for " +
        pieceObject.name +
        " at position " +
        positionId
    );
    this.showBoard();
    let possibleMoves = [];
    let pieceRange = pieceObject.gameObject.range;
    let movementPattern = pieceObject.gameObject.movementPattern;

    for (let i = 0; i < 8; i++) {
      this.checkPosition(i, 0);
    }
    for (let i = 0; i < 8; i++) {
      this.checkPosition(0, i);
    }
    for (let i = 7; i >= 0; i--) {
      this.checkPosition(i, 0);
    }
    for (let i = 7; i >= 0; i--) {
      this.checkPosition(i, 0);
    }
  }

  checkPosition(i, j) {
    console.log(this.boardMap[i][j].positionId);
    if (!this.boardMap[i][j].occupied) {
      this.boardMap[i][j].tdObject.material.emissive.setHex(0x91d994);
    }
    return this.boardMap[i][j].occupied;
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
