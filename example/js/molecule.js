import * as THREE from '../../js/resources/three.module.js';

import { TrackballControls } from '../../js/resources/TrackballControls.js';
import { PDBLoader } from '../../js/resources/PDBLoader.js';
import { CSS2DRenderer, CSS2DObject } from '../../js/resources/CSS2DRenderer.js';

var camera, scene, renderer, labelRenderer;
var controls;

var root;

var MOLECULES = {
	// Essential
	"Histidine": "./aminos/essential/histidine.pdb",
	"Isoleucine": "./aminos/essential/isoleucine.pdb",
	"Leucine": "./aminos/essential/leucine.pdb",
	"Lysine": "./aminos/essential/lysine.pdb",
	"Methionine": "./aminos/essential/methionine.pdb",
	"Phenylalanine": "./aminos/essential/phenylalanine.pdb",
	"Threonine": "./aminos/essential/threonine.pdb",
	"Tryptophan": "./aminos/essential/tryptophan.pdb",
	"Valine": "./aminos/essential/valine.pdb",
	// Non-essential
	"Alanine": "./aminos/non-essential/alanine.pdb",
	"Arginine": "./aminos/non-essential/arginine.pdb",
	"Asparagine": "./aminos/non-essential/asparagine.pdb",
	"Aspartic Acid": "./aminos/non-essential/aspartic_acid.pdb",
	"Glutamic Acid": "./aminos/non-essential/glutamic_acid.pdb",
	"Taurine": "./aminos/non-essential/taurine.pdb",
	"Tyrosine": "./aminos/non-essential/tyrosine.pdb",
	// Conditional
	"Arginine*": "./aminos/non-essential/arginine.pdb",
	"Cysteine": "./aminos/conditional/cysteine.pdb",
	"Glutamine": "./aminos/conditional/glutamine.pdb",
	"Glycine": "./aminos/conditional/glycine.pdb",
	"Ornithine": "./aminos/conditional/ornithine.pdb",
	"Proline": "./aminos/conditional/proline.pdb",
	"Serine": "./aminos/conditional/serine.pdb",
	"Tyrosine*": "./aminos/non-essential/tyrosine.pdb",
	// Vitamins
	"Biotin": "./vitamins/biotin.pdb",
	"Choline": "./vitamins/choline.pdb",
	"Elatin": "./vitamins/elatin.pdb",
	"Folic Acid": "./vitamins/folic acid.pdb",
	"Inositol": "./vitamins/inositol.pdb",
	"Vitamin A": "./vitamins/vitamin a.pdb",
	"Vitamin B1": "./vitamins/vitamin b1.pdb",
	"Vitamin B2": "./vitamins/vitamin b2.pdb",
	"Vitamin B3 (Niacinamide)": "./vitamins/vitamin b3 niacinamide.pdb",
	"Vitamin B3 (Nicotinic Acid)": "./vitamins/vitamin b3 nicotinic acid.pdb",
	"Vitamin B5": "./vitamins/vitamin b5.pdb",
	"Vitamin B6": "./vitamins/vitamin b6.pdb",
	// "Vitamin B12": "./vitamins/vitamin b12.pdb",
	"Vitamin C": "./vitamins/vitamin c.pdb",
	"Vitamin D": "./vitamins/vitamin d.pdb",
	"Vitamin E": "./vitamins/vitamin e.pdb",
	"Vitamin K": "./vitamins/vitamin k.pdb",
};

var loader = new PDBLoader();
var offset = new THREE.Vector3();

var menu = document.getElementById( 'menu' );

init();
animate();

function init() {

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x050505 );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 1000;
	scene.add( camera );

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

	//

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize( window.innerWidth, window.innerHeight );
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
	labelRenderer.domElement.style.pointerEvents = 'none';
	document.getElementById( 'container' ).appendChild( labelRenderer.domElement );

	//

	controls = new TrackballControls( camera, renderer.domElement );
	controls.minDistance = 500;
	controls.maxDistance = 2000;

	//

	loadMolecule( '../models/pdb/aminos/essential/leucine.pdb' );
	createMenu();

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

//

function generateButtonCallback( url ) {

	return function () {

		loadMolecule( url );

	};

}

function createMenu() {

	for ( var m in MOLECULES ) {

		var button = document.createElement( 'button' );
		button.innerHTML = m;
		menu.appendChild( button );

		var url = '../models/pdb/' + MOLECULES[ m ];

		button.addEventListener( 'click', generateButtonCallback( url ), false );

	}

}

//

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

			var text = document.createElement( 'div' );
			text.className = 'label';
			text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
			text.textContent = atom[ 4 ];

			//var label = new CSS2DObject( text );
			//label.position.copy( object.position );
			//root.add( label );

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

//

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
	labelRenderer.render( scene, camera );

}