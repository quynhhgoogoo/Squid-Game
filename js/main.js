const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Change back ground's color and the opacity of the color
renderer.setClearColor(0xb7c3f3, 1);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// Global variables
const start_position = 3;
const end_position = -start_position;

function createCube(size, positionX, rotY = 0, color = 0xfbc851) {
    // Pass height, width and depth to geometry object
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.x = positionX;
    cube.rotation.y = rotY;
    scene.add(cube);

    return cube;
}

camera.position.z = 5;
const loader = new THREE.GLTFLoader();

class Doll {
    constructor() {
        loader.load("../models/scene.gltf", (gltf) => {
            scene.add(gltf.scene);
            // Scale down the doll in all four dimension
            gltf.scene.scale.set(.4, .4, .4);
            // Move doll's at position (x,y,z)
            gltf.scene.position.set(0, -1.5, 0);
            this.doll = gltf.scene;
        })
    }

    // Make the doll looks at to the back side
    lookBackward() {
        //this.doll.rotation.y = -3.25;
        gsap.to(this.doll.rotation, { y: -3.15, duration: 1 })
    }

    // Make the doll looks forward
    lookForward() {
        //this.doll.rotation.y = 0;
        gsap.to(this.doll.rotation, { y: 0, duration: 1 })
    }
}

function createTrack() {
    // Add a cube between two initialized cube with an expansion from first to second cube 
    createCube({ w: start_position * 2, h: 1.5, d: 1 }, 0, 0, 0xe5a716).position.z = -0.8;
    createCube({ w: 0.2, h: 1.5, d: 1 }, start_position, -0.35);
    createCube({ w: 0.2, h: 1.5, d: 1 }, end_position, 0.35);
}

createTrack();

let doll = new Doll()
setTimeout(() => {
    doll.lookBackward()
}, 1000);

function animate() {
    // Render the scence and object to web interface
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    // Specify the rotation speed of object and the axis where object rotates
    //cube.rotation.x += 0.01;
}
animate();

// Make canvas resizable on window
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}