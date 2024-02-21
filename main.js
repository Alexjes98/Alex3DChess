import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { Board } from './classes/chessBoard.js';
import { Spot } from './classes/chessSpot.js';


const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 5, 5);

const controls = new OrbitControls(camera, renderer.domElement);
//scene.add(controls);
const meshHelper = new THREE.GridHelper(100, 100);
scene.add(meshHelper);

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.z = 5;

const board = new Board(scene);

const loader = new OBJLoader();
loader.setPath('assets/models/');
const customMaterial = new THREE.MeshPhongMaterial({
    color: 0x555555,
    specular: 0xffffff,
    shininess: 50,
});

var fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(50, 50, 50);
scene.add(fillLight);

loader.load(
	// resource URL
	'King.obj',
	// onLoad callback
	function ( object ) {
		object.position.x = 0;
		object.position.y = 0;
		object.position.z = 0;
		object.scale.set(0.1, 0.1, 0.1);

		object.rotation.x = -Math.PI / 2;
		object.rotation.y = 0;
		object.rotation.z = 0;	
		
		const meshHelper = new THREE.BoxHelper( object, 0xffff00 );
		console.log(object.position)

	  scene.add( object , meshHelper);
	},
	// onProgress callback
	function ( xhr ) {
	  console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},
	// onError callback
	function ( error ) {
	  console.log( 'An error happened' + error);
	}
  );


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