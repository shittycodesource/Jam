// Define variables
let camera, scene, renderer, controls;

// Initialize the scene
init();

function init() {
    // Create a new camera object
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 1000);

    // Set the camera position
    camera.position.set(0, 0, 0.1);

    // Create a new scene object
    scene = new THREE.Scene();

    // Load the panorama image
    const loader = new THREE.TextureLoader();
    const texture = loader.load('bruh.png');

    // Remove antialising filter
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    // Set the texture wrapping and flipping options
    texture.wrapS = THREE.RepeatWrapping;

    // Create a new sphere geometry to hold the panorama image
    const geometry = new THREE.SphereGeometry(500, 60, 40);

    // Flip the geometry inside out so that the image is displayed on the inside of the sphere
    geometry.scale(-1, 1, 1);

    // Create a new material with the loaded texture
    const material = new THREE.MeshBasicMaterial({
        map: texture
    });

    // Create a new mesh with the geometry and material
    const mesh = new THREE.Mesh(geometry, material);

    // Add the mesh to the scene
    scene.add(mesh);

    window.addEventListener('resize', onWindowResize);
}

// Create a new WebGL renderer object
renderer = new THREE.WebGLRenderer();

// Set the renderer size to the window size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the renderer to the document body
document.getElementById("panorama-container").appendChild(renderer.domElement);

// Create a new OrbitControls object to enable mouse drag controls
controls = new THREE.OrbitControls(camera, renderer.domElement);

// Disable vertical movement of the camera
controls.enableZoom = true;
controls.enablePan = true;

// Set the controls to rotate around the panorama image
controls.rotateSpeed = -0.25;

// Set the render loop
renderer.setAnimationLoop(() => {
    // Update the OrbitControls
    controls.update();

    // Render the scene with the camera and renderer
    renderer.render(scene, camera);
});

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}