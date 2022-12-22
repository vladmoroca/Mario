'use strict';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity = 0.7;

class Player {
  constructor() {
    this.position = {
      x: 800,
      y: 600
    };
    this.velocity = {
      x: 0,
      y: 1
    };
    this.wigth = 40;
    this.height = 50;
    this.skin = document.createElement('img');
    this.skin.src = './assets/mario.png';
  }

  draw() {
    context.drawImage(this.skin, this.position.x, this.position.y,
      this.wigth, this.height);
  }
  Update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.position.y += this.velocity.y;
    this.velocity.y += gravity;
    this.draw();
  }
}

class Enemy {
  constructor({ x, y }, src) {
    this.position = {
      x,
      y
    };
    this.velocity = {
      x: 5,
      y: 1
    };
    this.wigth = 40;
    this.height = 50;
    this.skin = document.createElement('img');
    this.skin.src = src;
  }

  draw() {
    context.drawImage(this.skin, this.position.x,
      this.position.y, this.wigth, this.height);
  }
  Update() {
    this.position.y += this.velocity.y;
    this.position.x -= this.velocity.x;
    this.velocity.y += gravity;
    this.draw();
  }
}



class Block {
  constructor({ x, y }, src) {
    this.position = {
      x,
      y
    };
    this.wigth = 50;
    this.height = 50;
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

  if ((obj.position.x + obj.wigth - 5 > obs.position.x) &&
      (obj.position.x + 5 < obs.position.x + obs.wigth)) {
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




