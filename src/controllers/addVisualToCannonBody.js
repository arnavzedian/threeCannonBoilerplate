import * as THREE from "three";
import * as CANNON from "cannon-es";

export default function addVisualToCannonBody(
  body,
  name,
  castShadow = true,
  receiveShadow = true
) {
  body.name = name;
  if (this.currentMaterial === undefined)
    this.currentMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
  if (this.settings === undefined) {
    this.settings = {
      stepFrequency: 60,
      quatNormalizeSkip: 2,
      quatNormalizeFast: true,
      gx: 0,
      gy: 0,
      gz: 0,
      iterations: 3,
      tolerance: 0.0001,
      k: 1e6,
      d: 3,
      scene: 0,
      paused: false,
      rendermode: "solid",
      constraints: false,
      contacts: false, // Contact points
      cm2contact: false, // center of mass to contact points
      normals: false, // contact normals
      axes: false, // "local" frame axes
      particleSize: 0.1,
      shadows: false,
      aabbs: false,
      profiling: false,
      maxSubSteps: 3,
    };
    this.particleGeo = new THREE.SphereGeometry(1, 16, 8);
    this.particleMaterial = new THREE.MeshLambertMaterial({
      color: 0xff0000,
    });
  }
  // What geometry should be used?
  let mesh;
  if (body instanceof CANNON.Body)
    mesh = this.cannonShapeToThreeMesh(body, castShadow, receiveShadow);

  if (mesh) {
    // Add body
    body.threeMesh = mesh;
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    this.scene.add(mesh);
  }
}
