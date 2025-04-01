import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//three.js need three setup which are scene, camera and renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
//in sum it means create a camera that sees a 75° view, fits the screen size, and can see objects from 0.1 to 1000 units away.

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
}); //Creates a 3D renderer and draws on the canvas with ID bg
renderer.setPixelRatio(window.devicePixelRatio); //Sets pixel ratio for sharper 3D on high-res screens.
renderer.setSize(window.innerWidth, window.innerHeight); //Makes the 3D scene fill the whole browser window.
camera.position.setZ(30); //Moves the camera 30 units away from the scene.


//add light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // ambient light for overall brightness
scene.add(ambientLight)

const controls = new OrbitControls(camera, renderer.domElement);


//add object and its texture → now a lantern
const lanternTexture = new THREE.TextureLoader().load('image.png');

//store all lanterns
const lanterns = [];

function createLantern(x, y, z) {
  const lantern = new THREE.Mesh(
    new THREE.CylinderGeometry(2.5, 2.5, 6, 32), // shape like a lantern
    new THREE.MeshStandardMaterial({
      map: lanternTexture,
      transparent: true,
      opacity: 0.95,
      roughness: 0.6,
      metalness: 0.2
    })
  );
  lantern.position.set(x, y, z);
  scene.add(lantern);
  lanterns.push(lantern);

  // Add warm point light inside the lantern
  const glow = new THREE.PointLight(0xffa066, 1.5, 15);
  glow.position.set(x, y, z);
  scene.add(glow);
}

// create multiple floating lanterns
for (let i = 0; i < 6; i++) {
  const x = THREE.MathUtils.randFloatSpread(40);
  const y = THREE.MathUtils.randFloat(0, 20);
  const z = THREE.MathUtils.randFloatSpread(20);
  createLantern(x, y, z);
}


//add background image
const spaceTexture = new THREE.TextureLoader().load('bg.jpeg');
scene.background = spaceTexture;


//add rain
const rain = []; // store raindrops

function addRainDrop() {
  const geometry = new THREE.BoxGeometry(0.03, 0.5, 0.03); // thin white line
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const drop = new THREE.Mesh(geometry, material);
  drop.position.set(
    THREE.MathUtils.randFloatSpread(100),
    THREE.MathUtils.randFloat(20, 60),
    THREE.MathUtils.randFloatSpread(100)
  );
  scene.add(drop);
  rain.push(drop);
}

Array(300).fill().forEach(addRainDrop);


//to not call renderer over and over agian
function animate() {
  requestAnimationFrame(animate);

  // float lanterns gently
  lanterns.forEach((lantern, i) => {
    lantern.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
  });

  // flicker glow gently
  scene.traverse((obj) => {
    if (obj.isPointLight) {
      obj.intensity = 1.5 + Math.sin(Date.now() * 0.005 + obj.position.x) * 0.3;
    }
  });

  // move rain down
  rain.forEach(drop => {
    drop.position.y -= 0.4;
    if (drop.position.y < -10) {
      drop.position.y = THREE.MathUtils.randFloat(20, 60);
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

animate()
