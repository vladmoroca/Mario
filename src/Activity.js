'use strict';

class Activity {
  constructor({ x, y }, BasicSize, context, name = 'Activity') {
    this.name = name;
    this.position = {
      x,
      y
    };
    this.velocity = {
      x: -BasicSize / 5,
      y: 0
    };
    this.wigth = BasicSize / 3;
    this.height = BasicSize / 3;
    this.context = context;
    this.skin = document.createElement('img');
    this.skin.src = './assets/misc.png';
  }
  draw() {
    this.context.drawImage(this.skin,
      0,
      0,
      25,
      20,
      this.position.x,
      this.position.y,
      this.wigth,
      this.height);
  }
  Update() {
    this.position.y += this.velocity.y;
    this.position.x -= this.velocity.x;
    this.draw();
  }
}

export const ActivityClasses = {
  FireBall: class extends Activity {
    constructor({ x, y }, BasicSize, context) {
      super({ x, y }, BasicSize, context, 'FireBall');
    }
    draw() {
      this.context.drawImage(this.skin,
        115,
        82,
        10,
        10,
        this.position.x,
        this.position.y,
        this.wigth,
        this.height);
    }
  }
};
