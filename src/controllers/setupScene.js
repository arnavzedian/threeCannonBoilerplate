import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function setupScene() {
  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color(0, 0, 0);
  this.camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  this.camera.position.set(0, 2, 8);
  this.camera.lookAt(new THREE.Vector3(0, 1, 0));

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(this.renderer.domElement);

  this.controls = new OrbitControls(this.camera, this.renderer.domElement);

  if (this.enableDebugger) {
    const axesHelper = new THREE.AxesHelper(8);
    this.scene.add(axesHelper);
  }

  setupCannon.call(this);
  addLights.call(this);
}

function setupCannon() {
  this.physicsUpdate = physicsUpdate.bind(this);

  const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
  });

  this.physicsWorld = physicsWorld;
  this.fixedTimeStep = 1.0 / 60.0;
  this.damping = 0.01;

  physicsWorld.broadphase = new CANNON.NaiveBroadphase();

  const groundShape = new CANNON.Plane();
  const groundMaterial = new CANNON.Material();
  this.groundMaterial = groundMaterial;
  const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
  groundBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0),
    -Math.PI / 2
  );
  groundBody.addShape(groundShape);
  physicsWorld.addBody(groundBody);

  this.addVisualToCannonBody(groundBody, "ground", false, true);

  if (this.enableDebugger) {
    const cannonDebugger = new CannonDebugger(this.scene, physicsWorld);
    this.cannonDebugger = cannonDebugger;
  }
}

function physicsUpdate() {
  this.physicsWorld.fixedStep();

  this.physicsWorld.step(this.fixedTimeStep);

  updateBodies(this.physicsWorld);

  if (this.enableDebugger) {
    this.cannonDebugger.update();
  }
}

function updateBodies(world) {
  world.bodies.forEach(function (body) {
    if (body.threeMesh != undefined) {
      body.threeMesh.position.copy(body.position);
      body.threeMesh.quaternion.copy(body.quaternion);
    }
  });
}

function addLights() {
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  // LIGHTS
  const ambient = new THREE.AmbientLight(0x888888);
  this.scene.add(ambient);

  const light = new THREE.DirectionalLight(0xdddddd);
  light.position.set(3, 10, 4);
  light.target.position.set(0, 0, 0);

  light.castShadow = true;

  const lightSize = 10;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 50;
  light.shadow.camera.left = light.shadow.camera.bottom = -lightSize;
  light.shadow.camera.right = light.shadow.camera.top = lightSize;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  this.sun = light;
  this.scene.add(light);
}
