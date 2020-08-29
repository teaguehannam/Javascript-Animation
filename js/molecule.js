import * as THREE from '../libraries/three.module.js';

import { TrackballControls } from '../libraries/TrackballControls.js';
import { PDBLoader } from '../libraries/PDBLoader.js';
import { CSS2DRenderer, CSS2DObject } from '../libraries/CSS2DRenderer.js';

import { MOLECULES } from './moleculeData.js'


var camera, scene, renderer, labelRenderer;
var controls;

var root;

var loader = new PDBLoader();
var offset = new THREE.Vector3();

var menu = document.getElementById( 'menu' );

// Setup & Run
init();
animate();


function init() {

	// Init Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x050505 );
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 1000;
	scene.add( camera );

	// Lighting
	var light = new THREE.DirectionalLight( 0xffffff, 0.4 );
	light.position.set( 1, 1, 1 );
	scene.add( light );
	var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
	light.position.set( - 1, - 1, 1 );
	scene.add( light );
	var light = new THREE.DirectionalLight( 0xffffff, 0.6 );
	light.position.set(  1, - 1, - 1 );
	scene.add( light );
	var light = new THREE.DirectionalLight( 0xffffff, 0.6 );
	light.position.set( - 1, 1, - 1 );
	scene.add( light );

	root = new THREE.Group();
	scene.add( root );

	// Init Renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	// Move on mouse/touch
	controls = new TrackballControls( camera, renderer.domElement );
	controls.minDistance = 500;
	controls.maxDistance = 2000;

	// Init on load
	loadMolecule( '../pdb/aminos/essential/leucine.pdb' );
	createMenu();
	window.addEventListener( 'resize', onWindowResize, false );

}


function generateButtonCallback( url ) {
	return function () {
		loadMolecule( url );
	};
}


function createMenu() {

	for( var i = 0; i < Object.keys(MOLECULES).length; i++ ) {

		var tempRow = document.createElement('div');
		tempRow.className = "menuRow"; 

		for ( var e = 0; e < Object.keys(MOLECULES[i]).length; e++ ) {

			var button = document.createElement( 'button' );
			button.innerHTML = Object.keys(MOLECULES[i][e]);
			tempRow.appendChild( button );

			var url = '../pdb/' + Object.values(MOLECULES[i][e]);

			button.addEventListener( 'click', generateButtonCallback( url ), false );

		}

		menu.appendChild( tempRow );

	}

}


function loadMolecule( url ) {

	while ( root.children.length > 0 ) {

		var object = root.children[ 0 ];
		object.parent.remove( object );

	}

	loader.load( url, function ( pdb ) {

		var geometryAtoms = pdb.geometryAtoms;
		var geometryBonds = pdb.geometryBonds;
		var json = pdb.json;

		var boxGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
		var sphereGeometry = new THREE.IcosahedronBufferGeometry( 1, 2 );

		geometryAtoms.computeBoundingBox();
		geometryAtoms.boundingBox.getCenter( offset ).negate();

		geometryAtoms.translate( offset.x, offset.y, offset.z );
		geometryBonds.translate( offset.x, offset.y, offset.z );

		var positions = geometryAtoms.getAttribute( 'position' );
		var colors = geometryAtoms.getAttribute( 'color' );

		var position = new THREE.Vector3();
		var color = new THREE.Color();

		for ( var i = 0; i < positions.count; i ++ ) {

			position.x = positions.getX( i );
			position.y = positions.getY( i );
			position.z = positions.getZ( i );

			color.r = colors.getX( i );
			color.g = colors.getY( i );
			color.b = colors.getZ( i );

			var material = new THREE.MeshPhongMaterial( { color: color } );

			var object = new THREE.Mesh( sphereGeometry, material );
			object.position.copy( position );
			object.position.multiplyScalar( 75 );
			object.scale.multiplyScalar( 25 );
			root.add( object );

			var atom = json.atoms[ i ];

		}

		positions = geometryBonds.getAttribute( 'position' );

		var start = new THREE.Vector3();
		var end = new THREE.Vector3();

		for ( var i = 0; i < positions.count; i += 2 ) {

			start.x = positions.getX( i );
			start.y = positions.getY( i );
			start.z = positions.getZ( i );

			end.x = positions.getX( i + 1 );
			end.y = positions.getY( i + 1 );
			end.z = positions.getZ( i + 1 );

			start.multiplyScalar( 75 );
			end.multiplyScalar( 75 );

			var object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
			object.position.copy( start );
			object.position.lerp( end, 0.5 );
			object.scale.set( 5, 5, start.distanceTo( end ) );
			object.lookAt( end );
			root.add( object );

		}

		render();

	} );

}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	labelRenderer.setSize( window.innerWidth, window.innerHeight );

	render();

}


function animate() {

	requestAnimationFrame( animate );
	controls.update();

	var time = Date.now() * 0.00015;

	root.rotation.x = time;
	root.rotation.y = time * 0.7;

	render();

}


function render() {

	renderer.render( scene, camera );


}

