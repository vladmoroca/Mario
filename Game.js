'use strict';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerWidth / 2;
const BasicSize = innerWidth / 30;
const gravity = BasicSize / 60;

class Player {
  constructor() {
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
    context.drawImage(this.skin,
      205 + (this.frames * 29),
      this.condition,
      25,
      16,
      this.position.x,
      this.position.y,
      this.wigth,
      this.height);
  }
  Update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
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

class Enemy {
  constructor({ x, y }, src) {
    this.position = {
      x,
      y
    };
    this.velocity = {
      x: BasicSize / 10,
      y: BasicSize / 50
    };
    this.wigth = BasicSize;
    this.height = BasicSize;
    this.skin = document.createElement('img');
    this.skin.src = src;
    this.frames = 0;
    this.condition = 0;
  }

  draw() {
    context.drawImage(this.skin,
      0 + (this.frames * 29),
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
    this.velocity.y += gravity;
    this.draw();
  }
  Animation() {
    if (this.frames === 1) {
      this.frames = 0;
    } else if (this.frames === 0) this.frames++;
  }
}



class Block {
  constructor({ x, y }, src) {
    this.position = {
      x,
      y
    };
    this.wigth = BasicSize;
    this.height = BasicSize;
    this.skin = document.createElement('img');
    this.skin.src = src;
    this.skin.animatea;
  }
  draw() {
    context.drawImage(this.skin, this.position.x,
      this.position.y, this.wigth, this.height);
  }
}

const Colision = (obj, obs) => {
  if ((obj.position.x + obj.wigth >= obs.position.x) &&
   (obj.position.x + obj.wigth + obj.velocity.x <= obs.position.x) &&
   (obj.position.y <= obs.position.y + obs.height) &&
   (obj.position.y + obj.height >= obs.position.y)) {
    return 'Left';
  }

  if ((obj.position.x <= obs.position.x + obs.wigth) &&
   (obj.position.x + obj.velocity.x >= obs.position.x + obs.wigth) &&
   (obj.position.y <= obs.position.y + obs.height) &&
   (obj.position.y + obj.height >= obs.position.y)) {
    return 'Right';
  }

  if ((obj.position.x + obj.wigth - 15 > obs.position.x) &&
      (obj.position.x + 15 < obs.position.x + obs.wigth)) {
    if ((obj.position.y + obj.height <= obs.position.y) &&
     (obj.position.y + obj.height + obj.velocity.y >= obs.position.y)) {
      return 'Down';
    }

    if ((obj.position.y >= obs.position.y + obs.height) &&
     (obj.position.y + obj.velocity.y <= obs.position.y + obs.height)) {
      return 'Up';
    }
  }
};




