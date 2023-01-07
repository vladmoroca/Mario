'use strict';

export class Player {
  constructor(BasicSize, canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.position = {
      x: BasicSize * 16,
      y: BasicSize * 7
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
    this.size = 1;
    this.animationNum = 29;
    this.charge = 0;
    this.turn = 0;
  }

  draw() {
    this.context.drawImage(this.skin,
      205 + (this.frames * this.animationNum),
      this.condition * 17,
      25,
      16 * this.size,
      this.position.x,
      this.position.y - this.height * (this.size - 1),
      this.wigth,
      this.height * this.size);
  }
  Update(gravity) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.position.y += this.velocity.y;
    this.velocity.y += gravity;
    this.draw();
  }
  Animation() {
    this.velocity.x > 0 ? this.turn = -1:
    this.velocity.x < 0 ? this.turn = 0:{};
    this.frames += 1 + 2 * this.turn;
    if (this.frames > 3 || this.frames < -4  || !this.velocity.x) {
      this.frames = this.turn;
    }
    if (this.velocity.y) {
      this.condition === 7 ? this.frames = 5.5 - 12 * this.turn: this.frames = 5 + 11 * this.turn;
    }
  }
}
