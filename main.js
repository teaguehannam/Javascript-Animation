let scene, camera, renderer, cube;
let width = window.innerWidth; 
let height = window.innerHeight;
let aspectRatio = width / height;

function init() {
	scene = new THREE.Scene()

	// typeOfCamera(FOV, Aspect Ratio, Near Plane, Far Plane)
	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	camera.position.z = 5; // Move camera back
	
	// WebGL supported by modern browsers
	renderer = new THREE.WebGLRenderer( {antialias: true} ); 
	renderer.setSize(width, height);

	document.body.appendChild(renderer.domElement); // Add canvas to DOM

	const geometry = new THREE.BoxGeometry(2,2,2); // vertices and faces

	// Texture material
	// const texture = new THREE.TextureLoader().load('crate.gif');
	// const material = new THREE.MeshBasicMaterial( {map:texture} );

	// Color material
	const material = new THREE.MeshBasicMaterial( {color: 0x0000ff} ); 
	cube = new THREE.Mesh( geometry, material ); // Create Object
	scene.add(cube); // Add to scene
}

// Runs Animation
function animate() {
	requestAnimationFrame(animate); // Recursively run animation

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera);
}

// Dynamic Sizing
function onWindowResize() {
	// Update Values
	width = window.innerWidth; 
	height = window.innerHeight;
	aspectRatio = width / height;
	// Set Values
	camera.aspect = aspectRatio;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();
