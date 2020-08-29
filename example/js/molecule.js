import * as THREE from '../../js/resources/three.module.js';

import { TrackballControls } from '../../js/resources/TrackballControls.js';
import { PDBLoader } from '../../js/resources/PDBLoader.js';
import { CSS2DRenderer, CSS2DObject } from '../../js/resources/CSS2DRenderer.js';

var camera, scene, renderer, labelRenderer;
var controls;

var root;

var ESSENTIAL = {
	0: { "Histidine": "./aminos/essential/histidine.pdb" },
	1: { "Isoleucine": "./aminos/essential/isoleucine.pdb" },
	2: { "Leucine": "./aminos/essential/leucine.pdb" },
	3: { "Lysine": "./aminos/essential/lysine.pdb" },
	4: { "Methionine": "./aminos/essential/methionine.pdb" },
	5: { "Phenylalanine": "./aminos/essential/phenylalanine.pdb" },
	6: { "Threonine": "./aminos/essential/threonine.pdb" },
	7: { "Tryptophan": "./aminos/essential/tryptophan.pdb" },
	8: { "Valine": "./aminos/essential/valine.pdb" }
};

var NONESSENTIAL = {
	0: { "Alanine": "./aminos/non-essential/alanine.pdb" },
	1: { "Arginine": "./aminos/non-essential/arginine.pdb" },
	2: { "Asparagine": "./aminos/non-essential/asparagine.pdb" },
	3: { "Aspartic Acid": "./aminos/non-essential/aspartic_acid.pdb" },
	4: { "Glutamic Acid": "./aminos/non-essential/glutamic_acid.pdb" },
	5: { "Taurine": "./aminos/non-essential/taurine.pdb" },
	6: { "Tyrosine": "./aminos/non-essential/tyrosine.pdb" }
};

var CONDITIONAL = {
	0: { "Arginine*": "./aminos/non-essential/arginine.pdb" },
	1: { "Cysteine": "./aminos/conditional/cysteine.pdb" },
	2: { "Glutamine": "./aminos/conditional/glutamine.pdb" },
	3: { "Glycine": "./aminos/conditional/glycine.pdb" },
	4: { "Ornithine": "./aminos/conditional/ornithine.pdb" },
	5: { "Proline": "./aminos/conditional/proline.pdb" },
	6: { "Serine": "./aminos/conditional/serine.pdb" },
	7: { "Tyrosine*": "./aminos/non-essential/tyrosine.pdb" }
};

var VITAMINS = {
	0: { "Biotin": "./vitamins/biotin.pdb" },
	1: { "Choline": "./vitamins/choline.pdb" },
	2: { "Elatin": "./vitamins/elatin.pdb" },
	3: { "Folic Acid": "./vitamins/folic acid.pdb" },
	4: { "Inositol": "./vitamins/inositol.pdb" },
	5: { "Vitamin A": "./vitamins/vitamin a.pdb" },
	6: { "Vitamin B1": "./vitamins/vitamin b1.pdb" },
	7: { "Vitamin B2": "./vitamins/vitamin b2.pdb" },
	8: { "Vitamin B3 (Niacinamide)": "./vitamins/vitamin b3 niacinamide.pdb" },
	9: { "Vitamin B3 (Nicotinic Acid)": "./vitamins/vitamin b3 nicotinic acid.pdb" },
	10: { "Vitamin B5": "./vitamins/vitamin b5.pdb" },
	11: { "Vitamin B6": "./vitamins/vitamin b6.pdb" },
	// "Vitamin B12": "./vitamins/vitamin b12.pdb",
	12: { "Vitamin C": "./vitamins/vitamin c.pdb" },
	13: { "Vitamin D": "./vitamins/vitamin d.pdb" },
	14: { "Vitamin E": "./vitamins/vitamin e.pdb" },
	15: { "Vitamin K": "./vitamins/vitamin k.pdb" }
};

var MOLECULES = [ESSENTIAL, NONESSENTIAL, CONDITIONAL, VITAMINS];

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

	for( var i = 0; i < Object.keys(MOLECULES).length; i++ ) {

		var tempRow = document.createElement('div');
		tempRow.className = "menuRow";

		for ( var e = 0; e < Object.keys(MOLECULES[i]).length; e++ ) {

			var button = document.createElement( 'button' );
			button.innerHTML = Object.keys(MOLECULES[i][e]);
			tempRow.appendChild( button );

			var url = '../models/pdb/' + Object.values(MOLECULES[i][e]);

			button.addEventListener( 'click', generateButtonCallback( url ), false );

		}
		menu.appendChild( tempRow );
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