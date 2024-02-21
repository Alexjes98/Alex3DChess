import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Board } from './classes/chessBoard.js';
import { Spot } from './classes/chessSpot.js';
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 10, 10);

const controls = new OrbitControls(camera, renderer.domElement);
scene.add(controls);
const meshHelper = new THREE.GridHelper(100, 100);
scene.add(meshHelper);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.z = 5;

const board = new Board(scene);


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onWindowResize, false);
animate();

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