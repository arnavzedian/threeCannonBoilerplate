Physijs.scripts.worker = "/js/physijs_worker.js";
Physijs.scripts.ammo = "/js/ammo.js";

/////---Settings---/////

var bwf = 3.5; //bus wheel friction
var bwr = 0; //bus wheel restitution
var pf = 4.2; //platform friction
var pr = 0; //platform restitution
var backgroundColor = 0xcdd3d6;

/////---Initiation---/////

var scene, environment, camera;
var busArray = [];
var Player1 = { name: "gretchen", score: 0 };
var Player2 = { name: "bertha", score: 0 };
var roundActive = false;
var loadingAnimation = document.getElementById("loading_animation_page"); // "visibility:hidden" in css

///Renderer
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", onWindowResize, false);

function Environment() {
  ///physi.js scene
  scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -50, 0));

  ///background
  renderer.setClearColor(backgroundColor, 1);

  ///camera
  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 300, 600);
  camera.zoom = 3;
  scene.add(camera);

  ///lighting & shadows
  var lightA1 = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(lightA1);
  var lightD1 = new THREE.DirectionalLight(0xffffff, 0.3);
  lightD1.position.set(-20, 100, 20);
  lightD1.castShadow = true;
  lightD1.shadow.camera.left = -100;
  lightD1.shadow.camera.top = -100;
  lightD1.shadow.camera.right = 100;
  lightD1.shadow.camera.bottom = 100;
  lightD1.shadow.camera.near = 1;
  lightD1.shadow.camera.far = 130;
  lightD1.shadow.mapSize.height = lightD1.shadow.mapSize.width = 1000;
  scene.add(lightD1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  ///fog
  scene.fog = new THREE.Fog(
    backgroundColor,
    camera.position.z + 5,
    camera.position.z + 200
  );

  ///platform
  var platform;
  var platformDiameter = 170;
  var platformRadiusTop = platformDiameter * 0.5;
  var platformRadiusBottom = platformDiameter * 0.5 + 0.2;
  var platformHeight = 1;
  var platformSegments = 85;

  var platformGeometry = new THREE.CylinderGeometry(
    platformRadiusTop,
    platformRadiusBottom,
    platformHeight,
    platformSegments
  );

  //physi.js platform (invisible; provides structure) (separating three.js & physi.js improves peformance)
  var physiPlatformMaterial = Physijs.createMaterial(
    new THREE.MeshLambertMaterial(),
    pf,
    pr
  );
  var physiPlatform = new Physijs.CylinderMesh(
    platformGeometry,
    physiPlatformMaterial,
    0
  );
  physiPlatform.name = "physicalPlatform";
  physiPlatform.position.set(0, -0.5, 0);
  physiPlatform.visible = false;
  scene.add(physiPlatform);

  //three.js platform (visible; provides image) (separating three.js & physi.js improves peformance)
  var platformMaterialsArray = [];
  var platformMaterialColor = new THREE.MeshLambertMaterial({
    color: 0x606060,
  });
  platformMaterialsArray.push(platformMaterialColor); //(materialindex = 0)
  var platformImage = "./images/asphalt_texture.jpg";
  var platformTextureLoader = new THREE.TextureLoader();
  ptr = 4.5; //platform texture repeat
  platformTextureLoader.load(platformImage, function (texture) {
    //shrinks & repeats the image for the designate number of times
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(ptr, ptr);
    //sets textue
    var platformMaterialImage = new THREE.MeshLambertMaterial({ map: texture });
    platformMaterialsArray.push(platformMaterialImage); //(materials index = 1)
  });
  var faceCount = platformGeometry.faces.length;
  for (i = 0; i < faceCount; i++) {
    if (i < platformSegments * 2) {
      //(cylinder side)
      platformGeometry.faces[i].materialIndex = 0;
    } else if (i < platformSegments * 3) {
      //(cylinder top)
      platformGeometry.faces[i].materialIndex = 1;
    } else {
      //(cylinder bottom)
      platformGeometry.faces[i].materialIndex = 0;
    }
  }
  var visiblePlatform = new THREE.Mesh(
    platformGeometry,
    platformMaterialsArray
  );
  visiblePlatform.name = "visiblePlatform";
  visiblePlatform.position.set(0, -0.5, 0);
  visiblePlatform.rotation.y = 0.4;
  visiblePlatform.receiveShadow = true;
  scene.add(visiblePlatform);
}

initializeMatch();
//playLoadingAnimationIfDocumentNotReady();

function render() {
  scene.simulate();
  camera.lookAt(0, 1, 0);
  //camera.lookAt( busArray[0].frame.position );
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

function initializeMatch() {
  environment = new Environment();
  busArray = [];
  roundActive = true;
}

function onWindowResize() {
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}
