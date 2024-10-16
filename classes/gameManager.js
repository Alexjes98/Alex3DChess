import { replacePiece, removePiece } from "../main.js";
class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(func) {
    this.observers.push(func);
  }

  unsubscribe(func) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

class GameManager {
  constructor(selectedObject, boardMap, gamePieces) {
    this.selectedObject = selectedObject;
    this.gamePieces = gamePieces || [];
    this.boardMap = boardMap || [];
    this.possibleMoves = [];
    this.kingsPositions = {};
    this.maxBoardSize = 7;
    this.checkThreat = false;
    this.observable = new Observable();
    this.observable.subscribe(this.pawnFirstMove.bind(this));
    this.observable.subscribe(this.pawnPromotion.bind(this));
    this.observable.subscribe(this.kingsCheck.bind(this));
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

  unmarkSpot(i, j) {
    this.boardMap[i][j].tdObject.material.emissive.setHex(0x000000);
  }

  markSpot(i, j) {
    this.boardMap[i][j].tdObject.material.emissive.setHex(0xff0000);
  }

  //observable events

  pawnFirstMove({ col, row }) {
    if (this.boardMap[col][row].piece) {
      if (
        this.boardMap[col][row].piece.children[0].gameObject.name === "Pawn"
      ) {
        if (this.boardMap[col][row].piece.children[0].gameObject.range === 2) {
          this.boardMap[col][row].piece.children[0].gameObject.range = 1;
        }
      }
    }
  }

  pieceRemoved({ col, row }) {
    console.log("Piece removed at", col, row);
  }

  async pawnPromotion({ col, row }) {
    if (this.boardMap[col][row].piece) {
      if (
        this.boardMap[col][row].piece.children[0].gameObject.name === "Pawn"
      ) {
        if (row === 0 || row === 7) {
          const newPiece = await replacePiece(
            {
              name: "Queen", // "Knight", "Bishop", "Rook"
              file: "WoodQueen.obj", // "WoodKnight.obj", "WoodBishop.obj", "WoodRook.obj"
              position: [
                this.boardMap[col][row].piece.position.x,
                this.boardMap[col][row].piece.position.z,
              ],
              positionId: this.boardMap[col][row].positionId,
              col,
              row,
              material: this.boardMap[col][row].piece.children[0].material,
              player:
                this.boardMap[col][row].piece.children[0].gameObject.player,
            },
            col,
            row
          );
          this.boardMap[col][row].piece = newPiece;
        }
      }
    }
  }

  kingsCheck() {
    //white king
    //left
    for (
      let i = this.kingsPositions.white[0] + 1;
      i <= this.maxBoardSize;
      i++
    ) {
      //this.markSpot(i, this.kingsPositions.white[1]);
      if (!this.boardMap[i][this.kingsPositions.white[1]].occupied) {
        continue;
      }
      const piece =
        this.boardMap[i][this.kingsPositions.white[1]].piece.children[0]
          .gameObject;
      console.log(piece);
      if (piece.player === "white") {
        break;
      }
      if (piece.name === "Queen" || piece.name === "Rook") {
        this.checkThreat = true;
        break;
      }
    }
    //right
    for (let i = this.kingsPositions.white[0] - 1; i >= 0; i--) {
      //this.markSpot(i, this.kingsPositions.white[1]);
      if (!this.boardMap[i][this.kingsPositions.white[1]].occupied) {
        continue;
      }
      const piece =
        this.boardMap[i][this.kingsPositions.white[1]].piece.children[0]
          .gameObject;
      console.log(piece);
      if (piece.player === "white") {
        break;
      }
      if (piece.name === "Queen" || piece.name === "Rook") {
        this.checkThreat = true;
        break;
      }
    }
    //foward
    for (
      let j = this.kingsPositions.white[1] + 1;
      j <= this.maxBoardSize;
      j++
    ) {
      //this.markSpot(this.kingsPositions.white[0], j);
      if (!this.boardMap[this.kingsPositions.white[0]][j].occupied) {
        continue;
      }
      const piece =
        this.boardMap[this.kingsPositions.white[0]][j].piece.children[0]
          .gameObject;
      console.log(piece);
      if (piece.player === "white") {
        break;
      }
      if (piece.name === "Queen" || piece.name === "Rook") {
        this.checkThreat = true;
        break;
      }
    }
    // left-foward
    for (
      let i = this.kingsPositions.white[0] + 1,
        j = this.kingsPositions.white[1] + 1;
      i <= this.maxBoardSize && j <= this.maxBoardSize;
      i++, j++
    ) {
      //this.markSpot(i, j);
      if (!this.boardMap[i][j].occupied) {
        continue;
      }
      const piece = this.boardMap[i][j].piece.children[0].gameObject;
      if (piece.player === "white") {
        break;
      }
      if (piece.name === "Queen" || piece.name === "Bishop") {
        this.checkThreat = true;
        break;
      } else if (
        piece.name === "Pawn" &&
        i - this.kingsPositions.white[0] === 1 &&
        j - this.kingsPositions.white[1] === 1
      ) {
        this.checkThreat = true;
      }
    }
    // right-foward
    for (
      let i = this.kingsPositions.white[0] - 1,
        j = this.kingsPositions.white[1] + 1;
      i >= 0 && j <= this.maxBoardSize;
      i--, j++
    ) {
      //this.markSpot(i, j);
      if (!this.boardMap[i][j].occupied) {
        continue;
      }
      const piece = this.boardMap[i][j].piece.children[0].gameObject;
      if (piece.player === "white") {
        break;
      }
      if (piece.name === "Queen" || piece.name === "Bishop") {
        this.checkThreat = true;
        break;
      } else if (
        piece.name === "Pawn" &&
        this.kingsPositions.white[0] - i === 1 &&
        j - this.kingsPositions.white[1] === 1
      ) {
        this.checkThreat = true;
      }
    }
    //back
    for (let j = this.kingsPositions.white[1] - 1; j >= 0; j--) {
      //this.markSpot(this.kingsPositions.white[0], j);

      if (!this.boardMap[this.kingsPositions.white[0]][j].occupied) {
        continue;
      }
      const piece =
        this.boardMap[this.kingsPositions.white[0]][j].piece.children[0]
          .gameObject;
      console.log(piece);
      if (piece.player === "white") {
        break;
      }
      if (piece.name === "Queen" || piece.name === "Rook") {
        this.checkThreat = true;
        break;
      }
    }
    // left-back
    for (
      let i = this.kingsPositions.white[0] + 1,
        j = this.kingsPositions.white[1] - 1;
      i <= this.maxBoardSize && j >= 0;
      i++, j--
    ) {
      //this.markSpot(i, j);
      if (!this.boardMap[i][j].occupied) {
        continue;
      }
      const piece = this.boardMap[i][j].piece.children[0].gameObject;
      if (piece.player === "white") {
        break;
      }
      if (piece.name === "Queen" || piece.name === "Bishop") {
        thread = true;
        break;
      }
    }
    // right-back
    for (
      let i = this.kingsPositions.white[0] - 1,
        j = this.kingsPositions.white[1] - 1;
      i >= 0 && j >= 0;
      i--, j--
    ) {
      //this.markSpot(i, j);
      if (!this.boardMap[i][j].occupied) {
        continue;
      }
      const piece = this.boardMap[i][j].piece.children[0].gameObject;
      if (piece.player === "white") {
        break;
      }
      if (piece.name === "Queen" || piece.name === "Bishop") {
        thread = true;
        break;
      }
    }

    const {
      check: whiteCheck,
      i: wi,
      j: wj,
    } = this.knightChecks(
      this.kingsPositions.white[0],
      this.kingsPositions.white[1]
    );
    if (whiteCheck) {
      //this.markSpot(this.kingsPositions.white[0], this.kingsPositions.white[1]);
      console.log(
        "Knight Check for White at",
        this.kingsPositions.white[0],
        this.kingsPositions.white[1],
        "FROM",
        wi,
        wj
      );
    }
    const {
      check: blackCkeck,
      i: bi,
      j: bj,
    } = this.knightChecks(
      this.kingsPositions.black[0],
      this.kingsPositions.black[1]
    );
    if (blackCkeck) {
      //this.markSpot(this.kingsPositions.black[0], this.kingsPositions.black[1]);
      console.log(
        "Knight Check for Black at",
        this.kingsPositions.black[0],
        this.kingsPositions.black[1],
        "FROM",
        bi,
        bj
      );
    }
    if (this.checkThreat) {
      console.log(
        "Check for white at",
        this.kingsPositions.white[0],
        this.kingsPositions.white[1]
      );
    }
  }

  //end observable events

  knightChecks(col, row) {
    const kingPlayer =
      this.boardMap[col][row].piece.children[0].gameObject.player;
    if (this.isEnemyKnight(col + 2, row + 1, kingPlayer)) {
      return { check: true, i: col + 2, j: row + 1 };
    }
    if (this.isEnemyKnight(col + 2, row - 1, kingPlayer)) {
      return { check: true, i: col + 2, j: row - 1 };
    }
    if (this.isEnemyKnight(col - 2, row + 1, kingPlayer)) {
      return { check: true, i: col - 2, j: row + 1 };
    }
    if (this.isEnemyKnight(col - 2, row - 1, kingPlayer)) {
      return { check: true, i: col - 2, j: row - 1 };
    }
    if (this.isEnemyKnight(col + 1, row + 2, kingPlayer)) {
      return { check: true, i: col + 1, j: row + 2 };
    }
    if (this.isEnemyKnight(col + 1, row - 2, kingPlayer)) {
      return { check: true, i: col + 1, j: row - 2 };
    }
    if (this.isEnemyKnight(col - 1, row + 2, kingPlayer)) {
      return { check: true, i: col - 1, j: row + 2 };
    }
    if (this.isEnemyKnight(col - 1, row - 2, kingPlayer)) {
      return { check: true, i: col - 1, j: row - 2 };
    }
    return { check: false, i: null, j: null };
  }

  isEnemyKnight(col, row, player) {
    if (
      col < this.maxBoardSize &&
      row < this.maxBoardSize &&
      col > 0 &&
      row > 0
    ) {
      return (
        this.boardMap[col][row].occupied &&
        this.boardMap[col][row].piece.children[0].gameObject.name ===
          "Knight" &&
        this.boardMap[col][row].piece.children[0].gameObject.player !== player
      );
    }
    return false;
  }

  movePiece(selectedPosition) {
    const toMove = selectedPosition;
    const position = toMove.position;

    const { col, row } = this.selectedObject;
    if (
      this.possibleMoves.indexOf(
        this.boardMap[toMove.col][toMove.row].positionId
      ) === -1
    ) {
      this.selectedObject = null;
      this.unmarkAll();
      return;
    }
    if (this.boardMap[toMove.col][toMove.row].occupied) {
      if (
        this.boardMap[toMove.col][toMove.row].piece.children[0].gameObject
          .player !== this.selectedObject.gameObject.player
      ) {
        removePiece(toMove.col, toMove.row);
        this.observable.notify({ col: toMove.col, row: toMove.row });
      }
    }

    this.boardMap[toMove.col][toMove.row].occupied = true;
    this.selectedObject.col = toMove.col;
    this.selectedObject.row = toMove.row;
    this.boardMap[toMove.col][toMove.row].piece = this.boardMap[col][row].piece;
    this.boardMap[col][row].occupied = false;
    this.boardMap[col][row].piece = null;

    this.selectedObject.parent.position.set(position.x, position.y, position.z);
    // console.log("moving to", toMove);
    this.unmarkAll();
    const name =
      this.boardMap[toMove.col][toMove.row].piece.children[0].gameObject.name;
    const player =
      this.boardMap[toMove.col][toMove.row].piece.children[0].gameObject.player;

    if (name === "King") {
      this.kingsPositions[player] = [toMove.col, toMove.row];
    }
    this.observable.notify({ col: toMove.col, row: toMove.row });

    setTimeout(() => {
      this.unmarkSpot(toMove.col, toMove.row);
    }, 300);
  }

  calculatePossibleMoves() {
    const column = this.selectedObject.col;
    const row = this.selectedObject.row;
    const range = this.selectedObject.gameObject.range;
    const moves = this.selectedObject.gameObject.movementPattern.map(
      (pattern) => {
        return this.checkPattern(pattern, column, row, range);
      }
    );
    this.possibleMoves = moves.flat();
  }

  checkPattern(pattern, column, row, range) {
    /**
     * Check the possible moves for a given pattern from a specified column and row within a certain range.
     *
     * @param {string} pattern - The movement pattern to check (e.g., "forward", "left", "knight").
     * @param {number} column - The column index on the board.
     * @param {number} row - The row index on the board.
     * @param {number} range - The maximum number of squares to check in the specified direction.
     * @returns {Array} An array of positions representing the valid moves based on the pattern.
     */
    const moves = [];
    let iterations = 0;
    switch (pattern) {
      case "foward":
        for (let j = row + 1; j < 8; j++) {
          iterations++;
          const { occupied, position } = this.checkPosition(column, j);
          if (position) moves.push(position);
          if (occupied || iterations === range) break;
        }
        break;
      case "back":
        for (let j = row - 1; j > -1; j--) {
          iterations++;
          const { occupied, position } = this.checkPosition(column, j);
          if (position) moves.push(position);
          if (occupied || iterations === range) break;
        }
        break;
      case "left":
        for (let i = column + 1; i < 8; i++) {
          iterations++;
          const { occupied, position } = this.checkPosition(i, row);
          if (position) moves.push(position);
          if (occupied || iterations === range) break;
        }
        break;
      case "right":
        for (let i = column - 1; i > -1; i--) {
          iterations++;
          const { occupied, position } = this.checkPosition(i, row);
          if (position) moves.push(position);
          if (occupied || iterations === range) break;
        }
        break;
      case "foward-right":
        for (let i = column + 1, j = row + 1; i < 8 && j < 8; i++, j++) {
          iterations++;
          const { occupied, position } = this.checkPosition(i, j);
          if (position) moves.push(position);
          if (occupied || iterations === range) break;
        }
        break;
      case "foward-left":
        for (let i = column - 1, j = row + 1; i > -1 && j < 8; i--, j++) {
          iterations++;
          const { occupied, position } = this.checkPosition(i, j);
          if (position) moves.push(position);
          if (occupied || iterations === range) break;
        }
        break;
      case "back-left":
        for (let i = column - 1, j = row - 1; i > -1 && j > -1; i--, j--) {
          iterations++;
          const { occupied, position } = this.checkPosition(i, j);
          if (position) moves.push(position);
          if (occupied || iterations === range) break;
        }
        break;
      case "back-right":
        for (let i = column + 1, j = row - 1; i < 8 && j > -1; i++, j--) {
          iterations++;
          const { occupied, position } = this.checkPosition(i, j);
          if (position) moves.push(position);
          if (occupied || iterations === range) break;
        }
        break;
      case "knight":
        const knightMoves = [
          { i: column + 2, j: row + 1 },
          { i: column + 2, j: row - 1 },
          { i: column - 2, j: row + 1 },
          { i: column - 2, j: row - 1 },
          { i: column + 1, j: row + 2 },
          { i: column + 1, j: row - 2 },
          { i: column - 1, j: row + 2 },
          { i: column - 1, j: row - 2 },
        ];
        knightMoves.forEach((move) => {
          if (move.i < 0 || move.i > 7 || move.j < 0 || move.j > 7) return;
          const { position } = this.checkPosition(move.i, move.j);
          if (position) moves.push(position);
        });
        break;
      case "white-pawn":
        for (let j = row + 1; j < 8; j++) {
          iterations++;
          const { occupied, position } = this.checkPawnPosition(
            column,
            j,
            false
          );
          if (position) moves.push(position);
          if (occupied || iterations === range) break;
        }
        if (column < 7) {
          let leftWhite = this.checkPawnPosition(column + 1, row + 1, true);
          if (leftWhite.occupied) {
            moves.push(leftWhite.position);
          }
        }
        if (column > 0) {
          let rightWhite = this.checkPawnPosition(column - 1, row + 1, true);
          if (rightWhite.occupied) {
            moves.push(rightWhite.position);
          }
        }

        break;
      case "black-pawn":
        for (let j = row - 1; j > -1; j--) {
          iterations++;
          const { occupied, position } = this.checkPawnPosition(
            column,
            j,
            false
          );
          if (position) moves.push(position);
          if (occupied || iterations === range) break;
        }
        if (column > 0) {
          let leftBlack = this.checkPawnPosition(column - 1, row - 1, true);
          if (leftBlack.occupied) {
            moves.push(leftBlack.position);
          }
        }
        if (column < 7) {
          let rightBlack = this.checkPawnPosition(column + 1, row - 1, true);
          if (rightBlack.occupied) {
            moves.push(rightBlack.position);
          }
        }

        break;
      default:
        throw new Error("Invalid pattern");
    }
    return moves;
  }

  checkPawnPosition(i, j, isAtackPosition) {
    const isOccupied = this.boardMap[i][j].occupied;
    const isAlliedPiece =
      this.boardMap[i][j].piece?.children[0].gameObject.player ===
      this.selectedObject.gameObject.player;
    const isEnemyPiece = isOccupied && !isAlliedPiece;
    if (!isOccupied) {
      if (!isAtackPosition) {
        this.boardMap[i][j].tdObject.material.emissive.setHex(0x91d994);
        return {
          occupied: this.boardMap[i][j].occupied,
          position: this.boardMap[i][j].positionId,
        };
      }
    } else if (isEnemyPiece) {
      if (isAtackPosition) {
        this.boardMap[i][j].tdObject.material.emissive.setHex(0xff0000);
        return {
          occupied: this.boardMap[i][j].occupied,
          position: this.boardMap[i][j].positionId,
        };
      }
    }
    return { occupied: true, position: null };
  }

  checkPosition(i, j) {
    const isOccupied = this.boardMap[i][j].occupied;
    const isAlliedPiece =
      this.boardMap[i][j].piece?.children[0].gameObject.player ===
      this.selectedObject.gameObject.player;
    const isEnemyPiece = isOccupied && !isAlliedPiece;

    if (!isOccupied) {
      this.boardMap[i][j].tdObject.material.emissive.setHex(0x91d994);
      return {
        occupied: this.boardMap[i][j].occupied,
        position: this.boardMap[i][j].positionId,
      };
    } else if (isEnemyPiece) {
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
