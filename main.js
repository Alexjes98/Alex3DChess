import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import {
  King,
  Queen,
  Bishop,
  Rook,
  Knight,
  Pawn,
} from "./classes/chessPiece.js";

import GameManager from "./classes/gameManager.js";
import boardData from "./public/board-data/boardData.json";

const whiteMaterial = () => {
  return new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 50,
  });
};

const blackMaterial = () => {
  return new THREE.MeshPhongMaterial({
    color: 0x000000,
    specular: 0xffffff,
    shininess: 50,
  });
};

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 5); // change this to 0 in x

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
// scene.add(controls);
const meshHelper = new THREE.GridHelper(100, 100);
//scene.add(meshHelper);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

const loader = new OBJLoader();
loader.setPath("/assets/models/");

var gameManager = new GameManager();

const boardMap = ["a", "b", "c", "d", "e", "f", "g", "h"];

async function loadGameComponents() {
  return new Promise(async (resolve, reject) => {
    //3D Object generation handling
    try {
      for (let i = -7; i < 1; i++) {
        // columns
        var row = [];
        for (let j = -7; j < 1; j++) {
          //rows
          const geometry = new THREE.PlaneGeometry(1, 1);
          const material = new THREE.MeshPhysicalMaterial({
            color: (i + j) % 2 === 0 ? 0xffffff : 0x000000,
            name: `(${i}, ${j}) ${(i + j) % 2 === 0 ? "white" : "black"}`,
          });
          const square = new THREE.Mesh(geometry, material);
          square.traverse(function (child) {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          square.rotation.x = -Math.PI / 2;
          square.position.set(i + 3.5, 0, j + 3.5);
          square.name = boardMap[i + 7] + (j + 8);
          square.type = "spot";
          square.col = i + 7;
          square.row = j + 7;
          var piece = null;
          const field = boardMap[i + 7];
          const pieceToLoad = boardData[field][j + 7];
          if (pieceToLoad != undefined) {
            piece = await loadPiece(
              pieceToLoad.name,
              pieceToLoad.file,
              [i + 3.5, j + 3.5],
              pieceToLoad.positionId,
              square.col,
              square.row,
              pieceToLoad.material === "white"
                ? whiteMaterial()
                : blackMaterial(),
              pieceToLoad.player,
              pieceToLoad.player === "black" ? -Math.PI : 0
            );
            scene.add(piece);
          }
          scene.add(square);
          row.push({
            id: square.name,
            col: i + 7,
            row: j + 7,
            tdObject: square,
            occupied: pieceToLoad != undefined,
            piece: piece,
          });
        }
        //add references to GameManager
        gameManager.addBoardRow(row);
      }
      resolve("FINISHED");
    } catch (error) {
      reject(error);
    }
  });
}

export async function replacePiece(pieceToLoad, i, j) {
  const piece = await loadPiece(
    pieceToLoad.name,
    pieceToLoad.file,
    pieceToLoad.position,
    pieceToLoad.positionId,
    i,
    j,
    pieceToLoad.material,
    pieceToLoad.player,
    pieceToLoad.player === "black" ? -Math.PI : 0
  );
  scene.add(piece);
  scene.remove(gameManager.boardMap[i][j].piece);
  return piece;
}

export async function removePiece(i, j) {
  console.log("removing piece",gameManager.boardMap[i][j].piece);  
  scene.remove(gameManager.boardMap[i][j].piece);
}

var fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(50, 50, 50);
scene.add(fillLight);

var backLight = new THREE.DirectionalLight(0xffffff, 0.4);
backLight.position.set(-50, 50, -50);
scene.add(backLight);
// white pieces

function createPiece(pieceId, positionId, color, player) {
  try {
    switch (pieceId) {
      case "King":
        return new King(color, positionId, player, 1, [
          "foward",
          "back",
          "left",
          "right",
          "foward-left",
          "foward-right",
          "back-left",
          "back-right",
        ]);
      case "Queen":
        return new Queen(color, positionId, player, 9, [
          "foward",
          "back",
          "left",
          "right",
          "foward-left",
          "foward-right",
          "back-left",
          "back-right",
        ]);
      case "Bishop":
        return new Bishop(color, positionId, player, 9, [
          "foward-left",
          "foward-right",
          "back-left",
          "back-right",
        ]);
      case "Rook":
        return new Rook(color, positionId, player, 9, [
          "foward",
          "back",
          "left",
          "right",
        ]);
      case "Knight":
        return new Knight(color, positionId, player, 1, ["knight"]);
      case "Pawn":
        return new Pawn(color, positionId, player, 2, [
          player === "white" ? "foward" : "back",
        ]);
      default:
        throw new Error("Invalid piece id");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error creating piece");
  }
}

function loadPiece(
  id,
  name,
  position,
  positionId,
  col,
  row,
  color,
  player,
  yRotation = 0
) {
  return new Promise((resolve, reject) => {
    loader.load(
      name,
      function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.name = id + player;
            child.material = color;
            child.type = "piece";
            child.col = col;
            child.row = row;
            child.helper = new THREE.BoxHelper(object, 0xffff00);
            child.gameObject = createPiece(id, positionId, color, player);
          }
        });
        object.position.set(position[0], 0, position[1]);
        object.rotation.y = yRotation;
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
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let INTERSECTED;

function checkIntersections() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      // Restore previous intersected object material
      if (INTERSECTED) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      }
      // Store reference to closest object as current intersection object
      INTERSECTED = intersects[0].object;
      // Store color of closest object (for later restoration)
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      // Set a new color for closest object
      INTERSECTED.material.emissive.setHex(0xffffff0);
    }
  } else {
    // Restore previous intersected object material
    if (INTERSECTED) {
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = null;
    }
    // Remove previous intersection object reference
    // By setting current intersection object to "nothing"
  }
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    let firstInterception = intersects[0].object;
    if (gameManager.selectedObject != null) {
      // second click
      if (firstInterception.type === "spot") {
        gameManager.movePiece(INTERSECTED);
      } else {
        return (gameManager.selectedObject = null);
      }
    }
    //first click
    firstInterception = intersects[0].object;
    if (firstInterception.type !== "spot") {
      console.log("selected", firstInterception.name, firstInterception.type);
      gameManager.selectedObject = firstInterception;
      gameManager.unmarkAll();
      gameManager.calculatePossibleMoves();
    } else if (firstInterception.type === "spot") {
      console.log(
        "position",
        gameManager.boardMap[firstInterception.col][firstInterception.row]
      );
    }
  } else {
    console.log("no object selected");
    gameManager.unmarkAll();
    return (gameManager.selectedObject = null);
  }
}

function animate() {
  requestAnimationFrame(animate);
  checkIntersections();
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);
window.addEventListener("click", onDocumentMouseDown, false);

window.addEventListener(
  "mousemove",
  (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  },
  false
);

const titleElement = document.createElement("h1");
titleElement.innerText = "Chess Board";
titleElement.style.position = "fixed";
titleElement.style.top = "10px";
titleElement.style.left = "10px";
document.body.appendChild(titleElement);
const infoElement = document.createElement("h4");
infoElement.innerText = "Loading 3D models...";
infoElement.style.position = "fixed";
infoElement.style.top = "200px";
infoElement.style.left = "10px";

document.body.appendChild(infoElement);

const loadingElement = document.createElement("span");
loadingElement.className = "loader";

document.body.appendChild(loadingElement);

Promise.all([loadGameComponents()])
  .catch((error) => {
    console.error(error, "ERROR");
    document.body.removeChild(loadingElement);
  })
  .then(() => {
    document.body.removeChild(loadingElement);
    document.body.removeChild(infoElement);
    document.body.removeChild(titleElement);
    animate();
  });
