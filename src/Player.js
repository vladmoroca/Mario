'use strict';

class Player {
  constructor(BasicSize, canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.position = {
      x: BasicSize * 16,
      y: BasicSize * 8
    };
    this.velocity = {
      x: 0,
      y: 1
    };
    this.wigth = BasicSize;
    this.height = BasicSize;
    this.skin = document.createElement('img');
    this.skin.src = './assets/mario.png';
    this.frames = 0;
    this.condition = 0;
  }

  draw() {
    this.context.drawImage(this.skin,
      205 + (this.frames * 29),
      this.condition,
      25,
      16,
      this.position.x,
      this.position.y,
      this.wigth,
      this.height);
  }
  Update(gravity) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.position.y += this.velocity.y;
    this.velocity.y += gravity;
    this.draw();
  }
  Animation() {
    if (this.velocity.x < 0) {
      this.frames++;
      if (this.frames >= 4 || this.frames < 0) this.frames = 0;
    }
    if (this.velocity.x > 0) {
      this.frames--;
      if (this.frames <= -5 || this.frames > 0) this.frames = -1;
    }
    if (this.velocity.x === 0) {
      if (this.frames < 0) {
        this.frames = -1;
      } else this.frames = 0;
    }
    if (this.velocity.y !== 0) {
      if (this.frames >= 0) this.frames = 5;
      if (this.frames < 0) this.frames = -6;
    }
  }
}
