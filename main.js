import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { randInt } from 'three/src/math/MathUtils.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/Addons.js';

var scene;
var camera;
var renderer;
let holding = false;
let loaded = false;
let objective = randInt(0,4);
let objectiveReached = false;

const loader = new FontLoader();
let textmesh = new THREE.Mesh();
loader.load('/fonts/helvetiker_regular.typeface.json', function(font) {
const geometry = new TextGeometry("Objective\nCompleted", {
    font: font,
    size: 2,
    depth: 0.1,
    });
    textmesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: new THREE.Color(0,0,0)}));
    textmesh.name = "button";
    textmesh.position.x = 200;
    textmesh.position.y = 200;
    textmesh.position.z = -15;
    scene.add(textmesh);
});

let createtextmesh = new THREE.Mesh();
loader.load('/fonts/helvetiker_regular.typeface.json', function(font) {
const geometry = new TextGeometry("Create:", {
    font: font,
    size: 1,
    depth: 0.1,
    });
    createtextmesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: new THREE.Color(0,0,0)}));
    createtextmesh.position.x = -12;
    createtextmesh.position.y = 17;
    createtextmesh.position.z = -15;
    scene.add(createtextmesh);
});

const mouse = new THREE.Vector2();

/* ORDER
0 - broccoli
1 - banana
2 - watermelon
3 - strawberry
4 - pumpkin
*/

let fruits = [];

let fruitPos = [];
fruitPos[0] = new THREE.Vector3(-5.7, 8.3, 0);
fruitPos[1] = new THREE.Vector3(-4.3,8.3,0);
fruitPos[2] = new THREE.Vector3(-2,8.8,0);
fruitPos[3] = new THREE.Vector3(2.5,9.4,0);
fruitPos[4] = new THREE.Vector3(4.5,9,0);

let fruitNames = [];
fruitNames[0] = "broccoli";
fruitNames[1] = "Banana";
fruitNames[2] = "mesh_0"; // watermelon
fruitNames[3] = "Sphere"; // strawberry
fruitNames[4] = "pumpkin";

let colours = {};
colours["clear"] = new THREE.Color(99/255, 159/255, 255/255); // nothing
colours["red"] = new THREE.Color(219/255, 55/255, 55/255); // watermelon DONE
colours["green"] = new THREE.Color(85/255, 145/255, 60/255); // broccoli DONE
colours["pink"] = new THREE.Color(222/255, 129/255, 180/255); // strawberry DONE
colours["orange"] = new THREE.Color(222/255, 123/255, 47/255); // pumpkin DONE
colours["yellow"] = new THREE.Color(227/255, 212/255, 45/255); // banana DONE

const water_geometry = new THREE.CylinderGeometry(1.75,0.9,2.5,);
const water_material = new THREE.MeshPhongMaterial({
    wireframe: false,
    side: THREE.DoubleSide,
    color: colours["clear"],
});
const water = new THREE.Mesh(water_geometry, water_material);
water.name = "water";

const objective_geometry = new THREE.BoxGeometry(2,2,0.1);
const objective_material = new THREE.MeshPhongMaterial({
    wireframe: false,
    side: THREE.DoubleSide,
    color: colours["red"],
});
const objectiveDisplay = new THREE.Mesh(objective_geometry, objective_material);
objectiveDisplay.position.x = -6;
objectiveDisplay.position.y = 17.5;
objectiveDisplay.position.z = -15;
objectiveDisplay.name = "objDisplay";

function resetFunction() {
    let i = 0;
    textmesh.position.x = 200;
    textmesh.position.y = 200;
    fruits.forEach(function() {
        fruits[i].scene.visible = true;
        fruits[i].scene.position.x = fruitPos[i].x;
        fruits[i].scene.position.y = fruitPos[i].y;
        i++;
    })
    water.material.color = colours["clear"];
    objective = randInt(0,4);
    switch (objective) {
        case 0:
            objectiveDisplay.material.color = colours["green"];
            break;
        case 1:
            objectiveDisplay.material.color = colours["yellow"];
            break;
        case 2:
            objectiveDisplay.material.color = colours["red"];
            break;
        case 3:
            objectiveDisplay.material.color = colours["pink"];
            break;
        case 4:
            objectiveDisplay.material.color = colours["orange"];
            break;
    }
}

let settings = {
    reset: resetFunction(),
}



// const gui = new GUI();




setScene();

function setupGUI() {
    // gui.add(settings, 'resetFunction').name("Reset and Change Objective");
    // gui.add(settings, 'x_size', 1, 20).onChange(value => {room.scene.scale.set(value, settings.y_size, settings.z_size)});
    // gui.add(settings, 'y_size', 1, 20).onChange(value => {room.scene.scale.set(settings.x_size, value, settings.z_size)});
    // gui.add(settings, 'z_size', 1, 20).onChange(value => {room.scene.scale.set(settings.x_size, settings.y_size, value)});
    // gui.add(settings, 'x_pos', -50, 50).onChange(value => {room.scene.position.set(value, settings.y_pos, settings.z_pos)});
    // gui.add(settings, 'y_pos', -50, 50).onChange(value => {room.scene.position.set(settings.x_pos, value, settings.z_pos)});
    // gui.add(settings, 'z_pos', -50, 50).onChange(value => {room.scene.position.set(settings.x_pos, settings.y_pos, value)});
}

setupGUI();
addLighting();

// let controls = new OrbitControls( camera, renderer.domElement );

renderer.setAnimationLoop(UpdateScene);

function UpdateScene() {
    // controls.update();
    for (let i = 0; i < fruits.length; i++) {
        updateFruits(i);
    }
    if (objectiveReached) {
        createButton();
        objectiveReached = false;
    }
    checkForReset();
    renderer.render(scene, camera);
}

function checkForReset() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (holding) {
        if (doesIntersect(intersects,"button")) {
            resetFunction();
        }
    }
}

function createButton() {
    textmesh.position.x = -6.5;
    textmesh.position.y = 13;
    textmesh.position.z = -15;
}

function doesIntersect(intersects, name) {
    for (const obj of intersects) {
        if (obj.object.name === name) {
            return true;
        }
    }
    return false;
}

function updateFruits(fruitindex) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (loaded) {
        if (holding) {
            // console.log(objective);
            // console.log(intersects);
            if (doesIntersect(intersects, fruitNames[fruitindex])) {
                // console.log(fruits[fruitindex].scene);
                fruits[fruitindex].scene.position.x = intersects[0].point.x;
                fruits[fruitindex].scene.position.y = intersects[0].point.y-0.12;
            }
        }
        else {
            
            if (doesIntersect(intersects, "glass") && doesIntersect(intersects, fruitNames[fruitindex])) {
                // console.log(fruits[fruitindex]);
                
                // console.log(fruitindex);
                if (objective == fruitindex) {
                    objectiveReached = true;
                }
                fruits[fruitindex].scene.visible = false;
                fruits[fruitindex].scene.position.x = 200;
                fruits[fruitindex].scene.position.y = 200;
                
                switch (fruitindex) {
                    case 0:
                        water.material.color = colours["green"];
                        break;
                    case 1:
                        water.material.color = colours["yellow"];
                        break;
                    case 2:
                        water.material.color = colours["red"];
                        break;
                    case 3:
                        water.material.color = colours["pink"];
                        break;
                    case 4:
                        water.material.color = colours["orange"];
                        break;
                }
            }
            else {
                if (!doesIntersect(intersects, "Desk") && doesIntersect(intersects, fruitNames[fruitindex])) {
                    // console.log(fruits[fruitindex].scene);
                    fruits[fruitindex].scene.position.x = fruitPos[fruitindex].x;
                    fruits[fruitindex].scene.position.y = fruitPos[fruitindex].y;
                }
            }
        }
    }
    

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
    camera = new THREE.PerspectiveCamera(40,ratio,0.1,1000);
    camera.position.set(0,15,20);
    camera.lookAt(0,10,0);

    renderer = new THREE.WebGLRenderer( );
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement );

    setWalls();
    loadModel('/models/Table/uploads_files_3912834_Table.glb', "table", 10,10,10, 0,0,0);
    loadModel('/models/Lights/uploads_files_3293341_DH.glb', "lamp", 8,8,8, -35,2,0);
    loadWaterGlass();

    loadFruit('/models/fruits/Broccoli/broccoli_v3.gltf', "broccoli", 0.05,0.05,0.05, -5.7,8.3,0, 0);
    loadFruit('/models/fruits/Banana/Banana.glb', "Banana", 15,15,15, -4.3,8.3,0, 1);
    loadFruit('/models/fruits/Watermelon/uploads_files_5929439_Half_of_a_watermelon_0218164538_refine.glb', "watermelon", 1,1,1, -2,8.8,0, 2); //watermelon
    loadFruit('/models/fruits/Strawberry/uploads_files_5834416_Strawberry.glb', "strawberry", 0.8,0.8,0.8, 2.5,9.4,0, 3); //strawberry
    loadFruit('/models/fruits/Pumpkin/uploads_files_4241762_pumpkin(1).glb', "pumpkin", 1,1,1, 4.5,9,0, 4);
    loaded = true;
    scene.add(objectiveDisplay);
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
        side: THREE.DoubleSide
    });
    const wallBack = new THREE.Mesh(wall_geometry, wall_material);
    wallBack.name = "room";
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

function loadWaterGlass() {
    const cup_geometry = new THREE.CylinderGeometry(2,1,3, 32, 1, true);
    const cup_material = new THREE.MeshPhongMaterial({
        wireframe: false,
        map: new THREE.TextureLoader().load("/textures/glass/Glass_Frosted_001_basecolor.jpg"),
        normalMap: new THREE.TextureLoader().load("/textures/glass/Glass_Frosted_001_normal.jpg"),
        aoMap: new THREE.TextureLoader().load("/textures/glass/Glass_Frosted_001_ambientOcclusion.jpg"),
        // displacementMap: new THREE.TextureLoader().load("/textures/glass/Glass_Frosted_001_height.png"),
        specularMap: new THREE.TextureLoader().load("/textures/glass/Glass_Frosted_001_roughness.jpg"),
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
    });
    const glass = new THREE.Mesh(cup_geometry, cup_material);
    glass.name = "glass";
    glass.position.set(0,9.8,0);

    
    water.position.set(0,9.8,0);

    scene.add(glass);
    scene.add(water);
}

function loadModel(pathname, name, scalex, scaley, scalez, posx, posy, posz) {
    const loader = new GLTFLoader();
    loader.load(pathname, function (model) {
        model.scene.scale.set(scalex, scaley, scalez);
        model.scene.position.set(posx, posy, posz);
        model.userData.name = name;
        scene.add(model.scene);
    });
    
}

function loadFruit(pathname, name, scalex, scaley, scalez, posx, posy, posz, index) {
    const loader = new GLTFLoader();
    loader.load(pathname, function (model) {
        model.scene.scale.set(scalex, scaley, scalez);
        model.scene.position.set(posx, posy, posz);
        model.userData.name = name;
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

    // const lampCameraHelper = new THREE.SpotLightHelper(lampCameraLight);
    // scene.add(lampCameraHelper);

    const ceilingcameraLight = new THREE.PointLight(new THREE.Color(1,0.7,0.2), 100);
    ceilingcameraLight.position.set(0, 25, 0);
    scene.add(ceilingcameraLight);

    // const ceilingCameraHelper = new THREE.PointLightHelper(ceilingcameraLight);
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
