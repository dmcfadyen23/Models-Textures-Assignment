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
    // controls.update();
    // for (let i = 0; i < fruits.length; i++) {
    //     updateFruits(fruits[i]);
    // }
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

// function onMouseDown(event) {
//     holding = true;
// }
// function onMouseMove(event) {
//     mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//     mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
// }
// function onMouseUp(event) {
//     holding = false;
// }

// //Event Listeners
// window.addEventListener('mousedown', onMouseDown);
// window.addEventListener('mouseup', onMouseUp);
// window.addEventListener('mousemove', onMouseMove);

function setScene() {
    scene = new THREE.Scene( );

    const ratio = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(30,ratio,0.1,1000);
    camera.position.set(0,15,20);
    camera.lookAt(0,10,0);

    renderer = new THREE.WebGLRenderer( );
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement );

    setWalls();
    loadModel('/models/Table/uploads_files_3912834_Table.glb', "table", 10,10,10, 0,0,0);
    loadModel('/models/Lights/uploads_files_3293341_DH.glb', "lamp", 8,8,8, -35,2,0);
    loadFruit('/models/Broccoli/broccoli_v3.gltf', "broccoli", 0.05,0.05,0.05, 0,0,0, 0);
}

function setWalls() {
    const wall_geometry = new THREE.PlaneGeometry(30,30);
    const wall_material = new THREE.MeshPhongMaterial({
        wireframe: false,
        map: new THREE.TextureLoader().load("/textures/wood/Wood_Floor_012_basecolor.jpg"),
        normalMap: new THREE.TextureLoader().load("/textures/wood/Wood_Floor_012_normal.jpg"),
        aoMap: new THREE.TextureLoader().load("/textures/wood/Wood_Floor_012_ambientOcclusion.jpg"),
        displacementMap: new THREE.TextureLoader().load("/textures/wood/Wood_Floor_012_height.png"),
        specularMap: new THREE.TextureLoader().load("/textures/wood/Wood_Floor_012_roughness.jpg"),
        side: THREE.DoubleSide,
    });
    const wallBack = new THREE.Mesh(wall_geometry, wall_material);
    const wallLeft = wallBack.clone();
    const wallRight = wallBack.clone();
    const floor = wallBack.clone();

    wallBack.position.set(0,14.5,-15.5);

    wallLeft.rotateY(Math.PI/2);
    wallLeft.position.set(-15.4, 14.5, 0);

    wallRight.rotateY(Math.PI/2);
    wallRight.position.set(14.4, 14.5, 0);

    floor.rotateX(Math.PI/2);
    floor.position.set(0,0.5,0);

    scene.add(wallBack);
    scene.add(wallLeft);
    scene.add(wallRight);
    scene.add(floor);
}

function loadModel(pathname, name, scalex, scaley, scalez, posx, posy, posz) {
    const loader = new GLTFLoader();
    loader.load(pathname, function (model) {
        model.scene.scale.set(scalex, scaley, scalez);
        model.scene.position.set(posx, posy, posz);
        model.name = name;
        scene.add(model.scene);
    });
    
}

function loadFruit(pathname, name, scalex, scaley, scalez, posx, posy, posz, index) {
    const loader = new GLTFLoader();
    loader.load(pathname, function (model) {
        model.scene.scale.set(scalex, scaley, scalez);
        model.scene.position.set(posx, posy, posz);
        model.name = name;
        fruits[index] = model;
        scene.add(model.scene);
    });
    
}

function addLighting() {
    const lampCameraLight = new THREE.SpotLight(new THREE.Color(1,1,1), 100, 0, Math.PI/4, 0.1);
    lampCameraLight.position.set(-5, 12.8, -1.4);
    lampCameraLight.target.position.set((lampCameraLight.position.x+5), (lampCameraLight.position.y-5), (lampCameraLight.position.z+2));
    lampCameraLight.castShadow = true;
    scene.add(lampCameraLight);
    scene.add(lampCameraLight.target);

    const lampCameraHelper = new THREE.SpotLightHelper(lampCameraLight);
    scene.add(lampCameraHelper);

    // const ceilingcameraLight = new THREE.SpotLight(new THREE.Color(1,1,1), 100);
    // ceilingcameraLight.position.set(0, 20, 0);
    // ceilingcameraLight.lookAt(0, 0, 0);
    // scene.add(ceilingcameraLight);

    // const ceilingCameraHelper = new THREE.SpotLightHelper(ceilingcameraLight, new THREE.Color(1,0,1));
    // scene.add(ceilingCameraHelper);

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
