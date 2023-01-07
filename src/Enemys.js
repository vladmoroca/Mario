'use strict';

class Enemy {
  constructor({ x, y }, BasicSize, context, name = 'Enemy') {
    this.name = name;
    this.position = {
      x,
      y
    };
    this.velocity = {
      x: BasicSize / 10,
      y: 0
    };
    this.wigth = BasicSize;
    this.height = BasicSize;
    this.context = context;
    this.skin = document.createElement('img');
    this.skin.src = './assets/enemies.png';
    this.frames = 0;
  }
  draw() {
    this.context.drawImage(this.skin,
      0 + (this.frames * 29),
      0,
      25,
      20,
      this.position.x,
      this.position.y,
      this.wigth,
      this.height);
  }
  Update(gravity) {
    this.position.y += this.velocity.y;
    this.position.x -= this.velocity.x;
    this.velocity.y += gravity;
    this.draw();
  }
  Animation() {
    this.frames ? this.frames = 0: this.frames++;
  }
}

export const EnemysClasses = {
  Goomba: class extends Enemy {
    constructor({ x, y }, BasicSize, context) {
      super({ x, y }, BasicSize, context, 'Goomba');
    }
    draw() {
      this.context.drawImage(this.skin,
        0 + (this.frames * 29),
        0,
        25,
        20,
        this.position.x,
        this.position.y,
        this.wigth,
        this.height);
    }
  },

  Turtle: class extends Enemy {
    constructor({ x, y }, BasicSize, context) {
      super({ x, y },  BasicSize, context, 'Turtle');
      this.condition = 0;
      this.wigth += 20;
      this.turn = 0;
    }
    draw() {
      this.context.drawImage(this.skin,
        198 + (this.frames * 30),
        0 + this.condition,
        30,
        23,
        this.position.x,
        this.position.y,
        this.wigth,
        this.height);
    }
    Animation() {
      if (this.frames === 5) {
        this.condition = -5;
      } else {
        this.velocity.x < 0 ? this.turn = 0: this.turn = -1;
        this.frames += 1 + 2 * this.turn;
        if (this.frames >= 2 || this.frames <= -3) this.frames = this.turn;
      }
    }
  }
};
