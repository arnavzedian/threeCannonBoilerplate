import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";

import addCar from "./controllers/addCar";
import handleCamera from "./controllers/handleCamera";
import handleKeyDown from "./controllers/handleKeyDown";
import handleKeyUp from "./controllers/handleKeyUp";
import render from "./controllers/render";
import setupCity from "./controllers/setupCity";
import setupScene from "./controllers/setupScene";
import addVisualToCannonBody from "./controllers/addVisualToCannonBody";
import cannonShapeToThreeMesh from "./controllers/cannonShapeToThreeMesh";

class Game {
  constructor() {
    this.scene = null;
    this.environment = null;
    this.camera = null;
    // this.enableDebugger = true;

    this.setupScene = setupScene.bind(this);
    this.setupCity = setupCity.bind(this);
    this.render = render.bind(this);
    this.addCar = addCar.bind(this);
    this.handleKeyDown = handleKeyDown.bind(this);
    this.handleKeyUp = handleKeyUp.bind(this);

    this.addVisualToCannonBody = addVisualToCannonBody.bind(this);
    this.cannonShapeToThreeMesh = cannonShapeToThreeMesh.bind(this);

    document.onkeydown = this.handleKeyDown;
    document.onkeyup = this.handleKeyUp;

    this.handleCamera = handleCamera.bind(this);

    this.setupScene();

    this.setupCity();
    this.player = this.addCar();
    this.render();
    this.addBody = this.addBody.bind(this);

    window.addBody = this.addBody;
  }

  addBody(type = "box") {
    let typeVsShape = {
      sphere: new CANNON.Sphere(0.5),
      box: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    };

    let shape = typeVsShape[type];

    const material = new CANNON.Material();
    const body = new CANNON.Body({ mass: 5, material: material });

    body.addShape(shape);

    const x = Math.random() * 0.3 + 1;
    body.position.set(x, 5, 0);
    body.linearDamping = this.damping;
    this.physicsWorld.addBody(body);

    this.addVisualToCannonBody(body, type, true, false);

    const material_ground = new CANNON.ContactMaterial(
      this.groundMaterial,
      material,
      { friction: 0.0, restitution: 0.5 }
    );

    this.physicsWorld.addContactMaterial(material_ground);
  }
}

new Game();
