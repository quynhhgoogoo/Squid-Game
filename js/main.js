const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

const loader = new THREE.GLTFLoader();

loader.load("../models/scene.gltf", function(gltf) {
    scene.add(gltf.scene);
})

function animate() {
    // Render the scence and object to web interface
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    // Specify the rotation speed of object and the axis where object rotates
    //cube.rotation.x += 0.01;
}
animate();