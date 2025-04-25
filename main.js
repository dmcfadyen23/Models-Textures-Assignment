import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';

var scene;
var camera;
var renderer;
let holding = false;
const mouse = new THREE.Vector2();

let room = null;
let fruits = [];
let settings = {
    x_size: 1,
    y_size: 1,
    z_size: 1,
    x_pos: 0,
    y_pos: 0,
    z_pos: 0
}


const gui = new GUI();




setScene();

function setupGUI() {
    // gui.add(settings, 'x_size', 1, 20).onChange(value => {room.scene.scale.set(value, settings.y_size, settings.z_size)});
    // gui.add(settings, 'y_size', 1, 20).onChange(value => {room.scene.scale.set(settings.x_size, value, settings.z_size)});
    // gui.add(settings, 'z_size', 1, 20).onChange(value => {room.scene.scale.set(settings.x_size, settings.y_size, value)});
    // gui.add(settings, 'x_pos', -50, 50).onChange(value => {room.scene.position.set(value, settings.y_pos, settings.z_pos)});
    // gui.add(settings, 'y_pos', -50, 50).onChange(value => {room.scene.position.set(settings.x_pos, value, settings.z_pos)});
    // gui.add(settings, 'z_pos', -50, 50).onChange(value => {room.scene.position.set(settings.x_pos, settings.y_pos, value)});
}

setupGUI();
addLighting();

let controls = new OrbitControls( camera, renderer.domElement );

renderer.setAnimationLoop(UpdateScene);

function UpdateScene() {
    controls.update();
    for (let i = 0; i < fruits.length; i++) {
        updateFruits(fruits[i]);
    }
    renderer.render(scene, camera);
}

function doesIntersect(intersects, name) {
    for (const obj of intersects) {
        if (obj.object.name === name) {
            return true;
        }
    }
    return false;
}

function updateFruits(fruit) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);

    // if (holding) {
    //     if (intersects.length > 0 && doesIntersect(intersects, fruit)) {
            
    //     }
    // }

}

function onMouseDown(event) {
    holding = true;
}
function onMouseMove(event) {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
}
function onMouseUp(event) {
    holding = false;
}

//Event Listeners
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousemove', onMouseMove);

function setScene() {
    scene = new THREE.Scene( );

    const ratio = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(30,ratio,0.1,1000);
    camera.position.set(0,0,0);
    camera.lookAt(0,5,0);

    renderer = new THREE.WebGLRenderer( );
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement );

    loadRoom('/models/Kitchen/kitchen_model.glb', "bench", new THREE.Vector3(4,4,4), new THREE.Vector3(20,-5,40));
    loadFruit('/models/Broccoli/broccoli_v3.gltf', "broccoli", new THREE.Vector3(1,1,1), new THREE.Vector3(0,0,0), 0);
}

function loadRoom(pathname, name, scale, position) {
    const loader = new GLTFLoader();
    loader.load(pathname, function (model) {
        model.scene.scale.set(scale);
        model.scene.position.set(position);
        model.name = name;
        room = model;
        scene.add(room.scene);
    });
    
}

function loadFruit(pathname, name, scale, position, index) {
    const loader = new GLTFLoader();
    loader.load(pathname, function (model) {
        model.scene.scale.set(scale);
        model.scene.position.set(position);
        model.name = name;
        fruits[index] = model;
        scene.add(model.scene);
    });
    
}

function addLighting() {
    const rightcameraLight = new THREE.SpotLight(new THREE.Color(1,1,1), 10);
    rightcameraLight.position.set(15, 0, 5);
    rightcameraLight.lookAt(0, 0, 0);
    scene.add(rightcameraLight);

    const rightCameraHelper = new THREE.SpotLightHelper(rightcameraLight);
    scene.add(rightCameraHelper);

    // const leftcameraLight = new THREE.SpotLight(new THREE.Color(1,1,1), 10);
    // leftcameraLight.position.set(-15, 0, -5);
    // leftcameraLight.lookAt(0, 0, 0);
    // scene.add(leftcameraLight);

    // const leftCameraHelper = new THREE.SpotLightHelper(leftcameraLight);
    // scene.add(leftCameraHelper);

    const ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 1);
    scene.add(ambientLight);
}

//Event Listeners
function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.render(scene,camera);
}
window.addEventListener('resize', resize);
