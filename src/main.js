import './style.css'
import * as THREE from 'three'
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

//three.js need three setup which are scene, camera and renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight , 0.1, 1000)
//(feild of view(360degrees), aspect ratio,view frustum)
//in sum it means create a camera that sees a 75° view, fits the screen size, and can see objects from 0.1 to 1000 units away.

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
}); //Creates a 3D renderer and draws on the canvas with ID bg
renderer.setPixelRatio(window.devicePixelRatio); //Sets pixel ratio for sharper 3D on high-res screens.
renderer.setSize(window.innerWidth, window.innerHeight); //Makes the 3D scene fill the whole browser window.
camera.position.setZ(30); //Moves the camera 30 units away from the scene.


//to create object we need geometry,material and mesh
const geometry = new THREE.TorusGeometry(10,3,16,100)
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry,material);

scene.add(torus)

//add light
const pointLight = new THREE.PointLight(0xffffff,30)
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xffffff)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper,gridHelper,pointLight)

const controls = new OrbitControls(camera,renderer.domElement);

//to not call renderer over and over agian
function animate(){
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene,camera);
}

animate()