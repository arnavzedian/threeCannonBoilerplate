export default function handleKeyUp(keyEvent) {
  let car = this.player;

  console.log("keyup");
  switch (keyEvent.keyCode) {
    // BUS 1
    //sets front wheels straight again
    case 65:
    case 68:
    case 37:
    case 39:
      car.wheel_fr_constraint.configureAngularMotor(1, 0, 0, 10, 200);
      car.wheel_fr_constraint.enableAngularMotor(1);
      car.wheel_fl_constraint.configureAngularMotor(1, 0, 0, 10, 200);
      car.wheel_fl_constraint.enableAngularMotor(1);
      break;
    //stops back wheel rotation
    case 87:
    case 83:
    case 38:
    case 40:
      car.wheel_bl_constraint.configureAngularMotor(2, 0, 0, 0, 2000);
      car.wheel_bl_constraint.enableAngularMotor(2);
      car.wheel_br_constraint.configureAngularMotor(2, 0, 0, 0, 2000);
      car.wheel_br_constraint.enableAngularMotor(2);
      break;
    // BUS 2
    //sets front wheels straight again
  }
}
