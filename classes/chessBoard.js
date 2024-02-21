import * as THREE from 'three';
import { Spot } from './chessSpot.js';


class Board {
  constructor(scene) {
    this.gameObjects = new THREE.Group();
    this.board = this.createBoard();
    scene.add(this.gameObjects);
    }
    createBoard() {
      const board = new Array(8);
      for (let i = 0; i < 8; i++) {
        board[i] = new Array(8);
        for (let j = 0; j < 8; j++) {
          const geometry = new THREE.PlaneGeometry(1, 1);
          const material = new THREE.MeshBasicMaterial({ color: (i + j) % 2 === 0 ? 0xFFFFFF : 0x000000 });
          const square = new THREE.Mesh(geometry, material);
          square.rotation.x = -Math.PI / 2;
          square.position.set(i - 3.5, 0, j - 3.5);
          this.gameObjects.add(square);
          board[i][j] = new Spot(i, j, square, null);
        }
      }
      return board;
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