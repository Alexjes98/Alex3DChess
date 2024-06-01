import * as THREE from "three";
import { Spot } from "./chessSpot.js";

class Board {
  constructor(scene) {
    this.gameObjects = new THREE.Group();
    this.board = this.createBoard();
    scene.add(this.gameObjects);
  }
  createBoard() {
    const board = new Array(8);
    for (let i = -7; i < 1; i++) {
      board[i] = new Array(8);
      for (let j = -7; j < 1; j++) {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshPhysicalMaterial({
          color: (i + j) % 2 === 0 ? 0xffffff : 0x000000, name: `(${i}, ${j}) ${(i + j) % 2 === 0 ? 'white' : 'black'}`

        });
        const square = new THREE.Mesh(geometry, material);
        square.rotation.x = -Math.PI / 2;
        square.position.set(i + 3.5, 0, j + 3.5);
        square.name = `(${i}, ${j})`;
        const meshHelper = new THREE.BoxHelper(square, 0xffff00);
        this.gameObjects.add(square);
        board[i][j] = new Spot(i, j, square, null);
      }
    }
    return board;
  }

  placeWhitePieces(scene) {}

  placeBlackPieces() {}
  placePiece(piece, x, y) {
    const spot = this.board[x][y];
    spot.occupySpot(piece);
  }
  getBoard() {
    return this.board;
  }
  getSpot(x, y) {
    return this.board[x][y];
  }
  movePiece(startX, startY, endX, endY) {
    const startSpot = this.getSpot(startX, startY);
    const endSpot = this.getSpot(endX, endY);
    endSpot.occupySpot(startSpot.piece);
    startSpot.releaseSpot();
  }
}

export { Board };
