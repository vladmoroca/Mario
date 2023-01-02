'use strict';

class Block {
  constructor({ x, y }, BasicSize, context, src = './assets/block.jpg',
    name = 'Block') {
    this.name = name;
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
      super({ x, y }, BasicSize, context, './assets/block.jpg', 'Floor');
    }
  },

  Surprise: class extends Block {
    constructor({ x, y }, BasicSize, context) {
      super({ x, y }, BasicSize, context, './assets/blocks.gif', 'Surprise');
      this.surprise = false;
      this.condition = 0;
    }
    draw() {
      this.context.drawImage(this.skin,
        177 + this.condition * -32,
        27,
        16,
        16,
        this.position.x,
        this.position.y,
        this.wigth,
        this.height);
    }
    Surprise() {
      if (!this.surprise) {
        this.condition = 1;
        this.surprise = true;
        return Math.floor(Math.random() * 10);
      } else return 0;
    }
  }
};
