export default function handleKeyDown(keyEvent) {
  let car = this.player;

  switch (keyEvent.keyCode) {
    // BUS 1
    // pivots wheels for steering
    case 65:
    case 37: // "a" key or left arrow key (turn left)
      car.wheel_fr_constraint.configureAngularMotor(
        1,
        -Math.PI / 4,
        Math.PI / 4,
        10,
        200
      );
      car.wheel_fr_constraint.enableAngularMotor(1);
      car.wheel_fl_constraint.configureAngularMotor(
        1,
        -Math.PI / 4,
        Math.PI / 4,
        10,
        200
      );
      car.wheel_fl_constraint.enableAngularMotor(1);
      break;
    case 68:
    case 39: // "d" key  or right arrow key (turn right)
      car.wheel_fr_constraint.configureAngularMotor(
        1,
        -Math.PI / 4,
        Math.PI / 4,
        -10,
        200
      );
      car.wheel_fr_constraint.enableAngularMotor(1);
      car.wheel_fl_constraint.configureAngularMotor(
        1,
        -Math.PI / 4,
        Math.PI / 4,
        -10,
        200
      );
      car.wheel_fl_constraint.enableAngularMotor(1);
      break;
    // rotates wheels for propulsion
    case 87:
    case 38: // "w" key or up arrow key (forward)
      car.wheel_bl_constraint.configureAngularMotor(2, 1, 0, 30, 5000000);
      car.wheel_bl_constraint.enableAngularMotor(2);
      car.wheel_br_constraint.configureAngularMotor(2, 1, 0, 30, 5000000);
      car.wheel_br_constraint.enableAngularMotor(2);
      break;
    case 83:
    case 40: // "s" key or down arrow key (backward)
      car.wheel_bl_constraint.configureAngularMotor(2, 1, 0, -20, 3500);
      car.wheel_bl_constraint.enableAngularMotor(2);
      car.wheel_br_constraint.configureAngularMotor(2, 1, 0, -20, 3500);
      car.wheel_br_constraint.enableAngularMotor(2);
      break;
  }
}
