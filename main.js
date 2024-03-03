import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { Board } from "./classes/chessBoard.js";
import { Spot } from "./classes/chessSpot.js";
import {
  King,
  Queen,
  Bishop,
  Rook,
  Knight,
  Pawn,
} from "./classes/chessPiece.js";

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 5);

const controls = new OrbitControls(camera, renderer.domElement);

scene.add(controls);
const meshHelper = new THREE.GridHelper(100, 100);
scene.add(meshHelper);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

const board = new Board(scene);

const loader = new OBJLoader();
loader.setPath("assets/models/");
const whiteMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  specular: 0xffffff,
  shininess: 50,
});

const blackMaterial = new THREE.MeshPhongMaterial({
  color: 0x000000,
  specular: 0xffffff,
  shininess: 50,
});

var fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(50, 50, 50);
scene.add(fillLight);

var backLight = new THREE.DirectionalLight(0xffffff, 0.4);
backLight.position.set(-50, 50, -50);
scene.add(backLight);
// white pieces

var gamePieces = [];
function loadPiece(name, position, color, player, zRotation = 0) {
  return new Promise((resolve, reject) => {
    loader.load(
      name,
      function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = color;
            child.scale.set(0.5, 0.5, 0.5);
            child.position.set(0, 0, 0);
            child.rotation.x = -Math.PI / 2;
			child.rotation.z = zRotation;
          }
        });
        object.scale.set(0.2, 0.2, 0.2);
        object.position.set(position[0], 0, position[1]);
        gamePieces.push(object);
        resolve(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log("An error happened");
        reject(error);
      }
    );
  });
}

// loader.load("WoodRook.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = whiteMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(-5.2, 0, -1.9);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   const rook = new Rook("white", [-5.2, -1.9], object, "1", objectHelper);
//   whitePieces.push(rook);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodRook.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = whiteMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(1.9, 0, -1.9);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   const rook = new Rook("white", [1.9, -1.9], object, "1", objectHelper);
//   whitePieces.push(rook);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodBishop.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = whiteMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(-3.2, 0, -1.9);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   const bishop = new Bishop("white", [-3.2, -1.9], object, "1", objectHelper);
//   whitePieces.push(bishop);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodBishop.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = whiteMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(1.8, 0, -1.9);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   const bishop = new Bishop("white", [1.8, -1.9], object, "1", objectHelper);
//   whitePieces.push(bishop);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodKnight.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = whiteMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(-2.6, 0, -1.9);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   const knight = new Knight("white", [-2.6, -1.9], object, "1", objectHelper);
//   whitePieces.push(knight);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodKnight.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = whiteMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(0.3, 0, -1.9);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   const knight = new Knight("white", [0.3, -1.9], object, "1", objectHelper);
//   whitePieces.push(knight);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodQueen.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = whiteMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(0.75, 0, -1.9);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   const queen = new Queen("white", [0.75, -1.9], object, "1", objectHelper);
//   whitePieces.push(queen);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodKing.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = whiteMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(-0.7, 0, -1.9);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   const king = new King("white", [-0.7, -1.9], object, "1", objectHelper);
//   whitePieces.push(king);
//   scene.add(object, objectHelper);
// });

// for (let i = -7; i < 1; i++) {
//   loader.load("WoodPawn.obj", function (object) {
//     object.traverse(function (child) {
//       if (child instanceof THREE.Mesh) {
//         child.material = whiteMaterial;
//         child.scale.set(0.5, 0.5, 0.5);
//         child.position.set(0, 0, 0);
//         child.rotation.x = -Math.PI / 2;
//       }
//     });
//     object.scale.set(0.2, 0.2, 0.2);
//     object.position.set(i + 1.9, 0, -1.3);
//     const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//     const pawn = new Pawn("white", [i + 1.9, -1.3], object, "1", objectHelper);
//     whitePieces.push(pawn);
//     scene.add(object, objectHelper);
//   });
// }

// black pieces

// loader.load("WoodRook.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = blackMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(-5.2, 0, 5.15);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodRook.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = blackMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(1.9, 0, 5.15);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodBishop.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = blackMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(-3.2, 0, 5.15);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodBishop.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = blackMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(1.8, 0, 5.15);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodKnight.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = blackMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//       child.rotation.z = Math.PI;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(-0.3, 0, 1.9);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodKnight.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = blackMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//       child.rotation.z = Math.PI;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(2.7, 0, 1.9);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodQueen.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = blackMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(0.75, 0, 5.15);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   scene.add(object, objectHelper);
// });

// loader.load("WoodKing.obj", function (object) {
//   object.traverse(function (child) {
//     if (child instanceof THREE.Mesh) {
//       child.material = blackMaterial;
//       child.scale.set(0.5, 0.5, 0.5);
//       child.position.set(0, 0, 0);
//       child.rotation.x = -Math.PI / 2;
//     }
//   });
//   object.scale.set(0.2, 0.2, 0.2);
//   object.position.set(-0.7, 0, 5.15);
//   const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//   scene.add(object, objectHelper);
// });

// for (let i = -7; i < 1; i++) {
//   loader.load("WoodPawn.obj", function (object) {
//     object.traverse(function (child) {
//       if (child instanceof THREE.Mesh) {
//         child.material = blackMaterial;
//         child.scale.set(0.5, 0.5, 0.5);
//         child.position.set(0, 0, 0);
//         child.rotation.x = -Math.PI / 2;
//       }
//     });
//     object.scale.set(0.2, 0.2, 0.2);
//     object.position.set(i + 1.9, 0, 3.6);
//     const objectHelper = new THREE.BoxHelper(object, 0xffff00);
//     scene.add(object, objectHelper);
//   });
// }

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

Promise.all([
  //white pieces
  loadPiece("WoodRook.obj", [-5.2, -1.9], whiteMaterial, "1"),
  loadPiece("WoodRook.obj", [1.9, -1.9], whiteMaterial, "1"),
  loadPiece("WoodBishop.obj", [-3.2, -1.9], whiteMaterial, "1"),
  loadPiece("WoodBishop.obj", [1.8, -1.9], whiteMaterial, "1"),
  loadPiece("WoodKnight.obj", [-2.6, -1.9], whiteMaterial, "1"),
  loadPiece("WoodKnight.obj", [0.3, -1.9], whiteMaterial, "1"),
  loadPiece("WoodQueen.obj", [0.75, -1.9], whiteMaterial, "1"),
  loadPiece("WoodKing.obj", [-0.7, -1.9], whiteMaterial, "1"),

  loadPiece("WoodPawn.obj", [-5.1, -1.3], whiteMaterial, "1"),
  loadPiece("WoodPawn.obj", [-4.1, -1.3], whiteMaterial, "1"),
  loadPiece("WoodPawn.obj", [-3.1, -1.3], whiteMaterial, "1"),
  loadPiece("WoodPawn.obj", [-2.1, -1.3], whiteMaterial, "1"),
  loadPiece("WoodPawn.obj", [-1.1, -1.3], whiteMaterial, "1"),
  loadPiece("WoodPawn.obj", [-0.1, -1.3], whiteMaterial, "1"),
  loadPiece("WoodPawn.obj", [0.9, -1.3], whiteMaterial, "1"),
  loadPiece("WoodPawn.obj", [1.9, -1.3], whiteMaterial, "1"),

  //black pieces
  loadPiece("WoodRook.obj", [-5.2, 5.15], blackMaterial, "2"),
  loadPiece("WoodRook.obj", [1.9, 5.15], blackMaterial, "2"),
  loadPiece("WoodBishop.obj", [-3.2, 5.15], blackMaterial, "2"),
  loadPiece("WoodBishop.obj", [1.8, 5.15], blackMaterial, "2"),
  loadPiece("WoodKnight.obj", [-0.3, 1.9], blackMaterial, "2", Math.PI),
  loadPiece("WoodKnight.obj", [2.7, 1.9], blackMaterial, "2", Math.PI),
  loadPiece("WoodQueen.obj", [0.75, 5.15], blackMaterial, "2"),
  loadPiece("WoodKing.obj", [-0.7, 5.15], blackMaterial, "2"),

  loadPiece("WoodPawn.obj", [-5.1, 3.6], blackMaterial, "2"),
  loadPiece("WoodPawn.obj", [-4.1, 3.6], blackMaterial, "2"),
  loadPiece("WoodPawn.obj", [-3.1, 3.6], blackMaterial, "2"),
  loadPiece("WoodPawn.obj", [-2.1, 3.6], blackMaterial, "2"),
  loadPiece("WoodPawn.obj", [-1.1, 3.6], blackMaterial, "2"),
  loadPiece("WoodPawn.obj", [-0.1, 3.6], blackMaterial, "2"),
  loadPiece("WoodPawn.obj", [0.9, 3.6], blackMaterial, "2"),
  loadPiece("WoodPawn.obj", [1.9, 3.6], blackMaterial, "2"),

])
  .catch((error) => {
    console.error(error, "ERROR");
  })
  .then(() => {
    gamePieces.forEach((piece) => {
      scene.add(piece);
    });

    animate();
  });

//LIST OF TO DO'S FOR THE 3D CHESS GAME
// CREATE THE TABLE
// CREATE LIST OF SQUARES
// ADD HOVER EFFECT TO THE SQUARES
// CREATE THE CHESS PIECES
// ADD THE MODELS
// PLACE THE PIECES ON THE BOARD
// CREATE THE MOVEMENTS
// ADD THE MOVEMENTS FOR THE PIECES
// ADD THE CAPTURE MECHANISM

// CREATE THE RULES
// CREATE THE CHECK MECHANISM
// CREATE THE CHECKMATE MECHANISM
// CREATE THE STALEMATE MECHANISM
// CREATE THE EN PASSANT MECHANISM
// CREATE THE CASTLING MECHANISM
// CREATE THE PROMOTION MECHANISM

// CREATE THE WINNING CONDITIONS
// CREATE THE LOSING CONDITIONS
// CREATE THE DRAW CONDITIONS

// CREATE THE TURN SYSTEM
// CREATE THE TIMER
// CREATE THE SCORE
// CREATE THE UI FOR THE GAME
// ADD THE SOUND EFFECTS

// CREATE THE AI (OPTIONAL)
// MAKE THE AI DISPLAY INTERSTING MESSAGES (OPTIONAL)
