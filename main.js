import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var scene;
var camera;
var renderer;

function loadModel() {
    const loader = new GLTFLoader();
    loader.load('/models/Broccoli/broccoli_v3.gltf', function (gltf) {
        scene.add(gltf.scene);
    });
}

loadModel();

let settings = {
    sides: 5,
    radius: 4,
    depth: 2,
    speed: 0.75
}


const gui = new GUI();
gui.add(settings, 'sides', 3, 10, 1);
gui.add(settings, 'radius', 1, 10);
gui.add(settings, 'depth', 1, 10);
gui.add(settings, 'speed', 0, 5);


setScene();

let shapes = [];
let numGen = 0;

addLighting();

let controls = new OrbitControls( camera, renderer.domElement );

const clock = new THREE.Clock();

renderer.setAnimationLoop(UpdateScene);

function UpdateScene() {
    controls.update();
    const delta = clock.getDelta();
    for (var i = 0; i < shapes.length; i++) {
        animateObject(shapes[i], delta);
    }
    renderer.render(scene, camera);
}

function animateObject(object, delta) {
    object.rotateZ(delta*settings.speed);

}

function setScene() {
    scene = new THREE.Scene( );

    const ratio = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(30,ratio,0.1,1000);
    camera.position.set(0,7.5,-30);
    camera.lookAt(0,0,0);

    renderer = new THREE.WebGLRenderer( );
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement );
}



function setDepth(depth, shape) {
    const extrudeSettings = {
        depth: 1,
        bevelEnabled: true,
        bevelSize: 0,
        bevelOffset: 0,
        bevelThickness: depth,
    }


    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    var xTranslate = (Math.random()*20)-10;
    var yTranslate = (Math.random()*20)-10;
    var zTranslate = (Math.random()*20)-10;
    geometry.translate(xTranslate, yTranslate, zTranslate);

    
    
    return geometry;
}

function addLighting() {
    const rightcameraLight = new THREE.PointLight(new THREE.Color(1,1,1), 1000);
    rightcameraLight.position.set(15, 0, 5);
    // cameraLight.lookAt(0, 0, 0);
    scene.add(rightcameraLight);

    const leftcameraLight = new THREE.PointLight(new THREE.Color(1,1,1), 1000);
    leftcameraLight.position.set(-15, 0, -5);
    // cameraLight.lookAt(0, 0, 0);
    scene.add(leftcameraLight);

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

function AddShape(event) {
    if (event.keyCode == 32) {
        const shapePath = new THREE.Shape();
        var anglePer = 360/settings.sides;
        
        shapePath.moveTo(settings.radius, 0);
        for (let i = 1; i <= settings.sides; i++) {
            shapePath.lineTo( Math.cos(i*anglePer*(Math.PI/180))*settings.radius, Math.sin(i*anglePer*(Math.PI/180))*settings.radius );
        }
        
        
        // const points = shapePath.getPoints();
        var finalGeometry = setDepth(settings.depth, shapePath);

        var rColor = Math.random()*255;
        var gColor = Math.random()*255;
        var bColor = Math.random()*255;

        const shapeColor = new THREE.Color(Math.random(),Math.random(),Math.random());
        const material = {
            color: shapeColor,
            shininess: 100,
            transparent: true,
            opacity: 0.8,
        }

        const mesh = new THREE.Mesh(finalGeometry, new THREE.MeshPhongMaterial(material));
        shapes[numGen] = mesh.clone();
        scene.add(shapes[numGen]);
        numGen += 1;
    }
    
}

window.addEventListener('keydown', AddShape);