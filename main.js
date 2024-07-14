import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
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
controls.autoRotate = true;
scene.add(controls);
//const meshHelper = new THREE.GridHelper(100, 100);
//scene.add(meshHelper);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;


for (let i = -7; i < 1; i++) {
  
  for (let j = -7; j < 1; j++) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshPhysicalMaterial({
      color: (i + j) % 2 === 0 ? 0xffffff : 0x000000, name: `(${i}, ${j}) ${(i + j) % 2 === 0 ? 'white' : 'black'}`
    });
    const square = new THREE.Mesh(geometry, material);
    square.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.gameObject = new Spot(i, j);
      }
    });
    square.rotation.x = -Math.PI / 2;
    square.position.set(i + 3.5, 0, j + 3.5);
    square.name = `(${i}, ${j})`;
    scene.add(square);
    const meshHelper = new THREE.BoxHelper(square, 0xffff00);
    
  }
}

const loader = new OBJLoader();
loader.setPath("/assets/models/");
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

var fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(50, 50, 50);
scene.add(fillLight);

var backLight = new THREE.DirectionalLight(0xffffff, 0.4);
backLight.position.set(-50, 50, -50);
scene.add(backLight);
// white pieces

var gamePieces = [];

function createPiece(pieceId, position, color, player) {
  // const objectHelper = new THREE.BoxHelper(gameObject, 0xffff00);
  try {
    switch (pieceId) {
      case "King":
        return new King(color, position, player);
      case "Queen":
        return new Queen(color, position, player);
      case "Bishop":
        return new Bishop(color, position, player);
      case "Rook":
        return new Rook(color, position, player);
      case "Knight":
        return new Knight(color, position, player);
      case "Pawn":
        return new Pawn(color, position, player);
      default:
        throw new Error("Invalid piece id");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error creating piece");
  }
}
function loadPiece(id, name, position, color, player, zRotation = 0) {
  return new Promise((resolve, reject) => {
    loader.load(
      name,
      function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.name = id + player;
            child.material = color;
            child.scale.set(0.5, 0.5, 0.5);
            child.position.set(0, 0, 0);
            child.rotation.x = -Math.PI / 2;
            child.rotation.z = zRotation;
            child.helper = new THREE.BoxHelper(object, 0xffff00);       
            child.gameObject = createPiece(id, position, color, player);
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
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let INTERSECTED;
let selectedObject;

window.addEventListener(
  "mousemove",
  (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  },
  false
);

function checkIntersections() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    if (INTERSECTED != intersects[0].object) {
      // Restore previous intersected object material
      if (INTERSECTED){
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
    }
    // Remove previous intersection object reference
    // By setting current intersection object to "nothing"
    INTERSECTED = null;
  }
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    selectedObject = intersects[0].object;
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

Promise.all([
  //white pieces
  loadPiece("Rook", "WoodRook.obj", [-5.2, -1.9], whiteMaterial(), "1"),
  loadPiece("Rook", "WoodRook.obj", [1.9, -1.9], whiteMaterial(), "1"),
  loadPiece("Bishop", "WoodBishop.obj", [-3.2, -1.9], whiteMaterial(), "1"),
  loadPiece("Bishop", "WoodBishop.obj", [1.8, -1.9], whiteMaterial(), "1"),
  loadPiece("Knight", "WoodKnight.obj", [-2.6, -1.9], whiteMaterial(), "1"),
  loadPiece("Knight", "WoodKnight.obj", [0.3, -1.9], whiteMaterial(), "1"),
  loadPiece("Queen", "WoodQueen.obj", [0.75, -1.9], whiteMaterial(), "1"),
  loadPiece("King", "WoodKing.obj", [-0.7, -1.9], whiteMaterial(), "1"),

  loadPiece("Pawn", "WoodPawn.obj", [-5.1, -1.3], whiteMaterial(), "1"),
  loadPiece("Pawn", "WoodPawn.obj", [-4.1, -1.3], whiteMaterial(), "1"),
  loadPiece("Pawn", "WoodPawn.obj", [-3.1, -1.3], whiteMaterial(), "1"),
  loadPiece("Pawn", "WoodPawn.obj", [-2.1, -1.3], whiteMaterial(), "1"),
  loadPiece("Pawn", "WoodPawn.obj", [-1.1, -1.3], whiteMaterial(), "1"),
  loadPiece("Pawn", "WoodPawn.obj", [-0.1, -1.3], whiteMaterial(), "1"),
  loadPiece("Pawn", "WoodPawn.obj", [0.9, -1.3], whiteMaterial(), "1"),
  loadPiece("Pawn", "WoodPawn.obj", [1.9, -1.3], whiteMaterial(), "1"),

  //black pieces
  loadPiece("Rook", "WoodRook.obj", [-5.2, 5.15], blackMaterial(), "2"),
  loadPiece("Rook", "WoodRook.obj", [1.9, 5.15], blackMaterial(), "2"),
  loadPiece("Bishop", "WoodBishop.obj", [-3.2, 5.15], blackMaterial(), "2"),
  loadPiece("Bishop", "WoodBishop.obj", [1.8, 5.15], blackMaterial(), "2"),
  loadPiece(
    "Knight",
    "WoodKnight.obj",
    [-0.3, 1.9],
    blackMaterial(),
    "2",
    Math.PI
  ),
  loadPiece(
    "Knight",
    "WoodKnight.obj",
    [2.7, 1.9],
    blackMaterial(),
    "2",
    Math.PI
  ),
  loadPiece("Queen", "WoodQueen.obj", [0.75, 5.15], blackMaterial(), "2"),
  loadPiece("King", "WoodKing.obj", [-0.7, 5.15], blackMaterial(), "2"),

  loadPiece("Pawn", "WoodPawn.obj", [-5.1, 3.6], blackMaterial(), "2"),
  loadPiece("Pawn", "WoodPawn.obj", [-4.1, 3.6], blackMaterial(), "2"),
  loadPiece("Pawn", "WoodPawn.obj", [-3.1, 3.6], blackMaterial(), "2"),
  loadPiece("Pawn", "WoodPawn.obj", [-2.1, 3.6], blackMaterial(), "2"),
  loadPiece("Pawn", "WoodPawn.obj", [-1.1, 3.6], blackMaterial(), "2"),
  loadPiece("Pawn", "WoodPawn.obj", [-0.1, 3.6], blackMaterial(), "2"),
  loadPiece("Pawn", "WoodPawn.obj", [0.9, 3.6], blackMaterial(), "2"),
  loadPiece("Pawn", "WoodPawn.obj", [1.9, 3.6], blackMaterial(), "2"),
])
  .catch((error) => {
    console.error(error, "ERROR");
    document.body.removeChild(loadingElement);
  })
  .then(() => {
    gamePieces.forEach((piece) => {
      scene.add(piece);      
    });
    document.body.removeChild(loadingElement);
    document.body.removeChild(infoElement);
    document.body.removeChild(titleElement);
    animate();
  });
