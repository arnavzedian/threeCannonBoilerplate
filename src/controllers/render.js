export default function render() {
  // if (this.roundActive === true) {
  //   checkForMatchCompletion();
  // }

  this.handleCamera();
  //camera.lookAt( busArray[0].frame.position );
  this.camera.updateProjectionMatrix();
  this.renderer.render(this.scene, this.camera);
  requestAnimationFrame(this.render);
  this.controls.update();
  this.physicsUpdate();
}
