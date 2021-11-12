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
const text = document.querySelector(".text");
const TIME_LIMIT = 10;
let gameStat = "loading";
let isLookingBackward = true;

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


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
        gsap.to(this.doll.rotation, { y: -3.15, duration: 0.3 })
        setTimeout(() => isLookingBackward = true, 450)
    }

    // Make the doll looks forward
    lookForward() {
        //this.doll.rotation.y = 0;
        gsap.to(this.doll.rotation, { y: 0, duration: 0.3 })
        setTimeout(() => isLookingBackward = false, 150)
    }

    async start() {
        this.lookBackward()
        await delay((Math.random() * 1000) + 1000)
        this.lookForward()
        await delay((Math.random() * 1000) + 1000)
        this.start()
    }
}

function createTrack() {
    // Add a cube between two initialized cube with an expansion from first to second cube 
    createCube({ w: start_position * 2, h: 1.5, d: 1 }, 0, 0, 0xe5a716).position.z = -0.8;
    createCube({ w: 0.2, h: 1.5, d: 1 }, start_position, -0.35);
    createCube({ w: 0.2, h: 1.5, d: 1 }, end_position, 0.35);
}

createTrack();


class Player {
    constructor() {
        const geometry = new THREE.SphereGeometry(0.2, 30, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.z = 1;
        sphere.position.x = start_position;
        scene.add(sphere);

        this.player = sphere;
        this.playerInfo = {
            positionX: start_position,
            velocity: 0
        }
    }

    run() {
        this.playerInfo.velocity = 0.03
    }

    update() {
        this.check()
        this.playerInfo.positionX -= this.playerInfo.velocity
        this.player.position.x = this.playerInfo.positionX
    }

    stop() {
        //this.playerInfo.velocity = 0
        // Make player move for a while after releasing the key
        gsap.to(this.playerInfo, { velocity: 0, duration: 0.5 })
    }

    // Check if player is moving when doll is looking forward
    check() {
        if (this.playerInfo.velocity > 0 && !isLookingBackward) {
            alert("You lose !")
        }

        if (this.playerInfo.positionX < end_position + 0.5) {
            alert("You win !")
        }
    }
}

const player = new Player()
let doll = new Doll()


async function init() {
    await delay(500)
    text.innerText = "Starting in 3"
    await delay(500)
    text.innerText = "Starting in 2"
    await delay(500)
    text.innerText = "Starting in 1"
    await delay(500)
    text.innerText = "Go!"
    startGame()
}

function startGame() {
    gameStat = "started"
    let progressbar = createCube({ w: 5, h: 1, d: 1 }, 0)
    progressbar.position.y = 3.35
    gsap.to(progressbar.scale, { x: 0, duration: TIME_LIMIT, ease: "none" })
    doll.start()
}

init()

setTimeout(() => {
    doll.start()
}, 1000);

function animate() {
    // Render the scence and object to web interface
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    player.update();
}
animate();

// Make canvas resizable on window
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
}


// Make event when down arrow is pressed
window.addEventListener('keydown', (e) => {
    if (gameStat != "started") return
    if (e.key == "ArrowUp") {
        player.run()
    }
})

// Make event when down arrow is released
window.addEventListener('keyup', (e) => {
    if (e.key == "ArrowUp") {
        player.stop()
    }
})