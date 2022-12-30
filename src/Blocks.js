'use strict';

class Block {
  constructor({ x, y }, BasicSize, context, src = './assets/block.jpg') {
    this.position = {
      x,
      y
    };
    this.velocity = {
      x: 0,
      y: 0
    };
    this.wigth = BasicSize;
    this.height = BasicSize;
    this.context = context;
    this.skin = document.createElement('img');
    this.skin.src = src;
    this.skin.animatea;
  }
  draw() {
    this.context.drawImage(this.skin,
      this.position.x,
      this.position.y,
      this.wigth,
      this.height);
  }
}

const BlockClasses = {
  Floor: class extends Block {
    constructor({ x, y }, BasicSize, context) {
      super({ x, y }, BasicSize, context, './assets/block.jpg');
    }
  }
};
