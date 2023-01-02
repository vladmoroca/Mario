'use strict';

class Bonus {
  constructor({ x, y }, BasicSize, context, name = 'Bonus') {
    this.name = name;
    this.position = {
      x,
      y
    };
    this.velocity = {
      x: -BasicSize / 10,
      y: 0
    };
    this.wigth = BasicSize;
    this.height = BasicSize;
    this.context = context;
    this.skin = document.createElement('img');
    this.skin.src = './assets/misc.png';
  }
  draw() {
    this.context.drawImage(this.skin,
      0,
      0,
      16,
      16,
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
  award(game) {
    game.Scores += 500;
  }
}

const BonusClasses = {
  Mushroom: class extends Bonus {
    constructor({ x, y }, BasicSize, context) {
      super({ x, y }, BasicSize, context, 'Mushroom');
    }
    draw() {
      this.context.drawImage(this.skin,
        0,
        0,
        16,
        16,
        this.position.x,
        this.position.y,
        this.wigth,
        this.height);
    }
    award(game) {
      game.player.size = 2;
      game.Scores += 500;
      game.player.condition = 3;
    }
  },

  Flower: class extends Bonus {
    constructor({ x, y }, BasicSize, context) {
      super({ x, y }, BasicSize, context, 'Flower');
    }
    draw() {
      this.context.drawImage(this.skin,
        0,
        16,
        16,
        16,
        this.position.x,
        this.position.y,
        this.wigth,
        this.height);
    }
    award(game) {
      game.Scores += 500;
      game.player.condition = 7;
      game.player.size = 2;
      game.player.animationNum = 27;
    }
  },

  Coin: class extends Bonus {
    constructor({ x, y }, BasicSize, context) {
      super({ x, y }, BasicSize, context, 'Coin');
      this.velocity.x = 0;
    }
    draw() {
      this.context.drawImage(this.skin,
        0,
        65,
        16,
        16,
        this.position.x,
        this.position.y,
        this.wigth,
        this.height);
    }
    award(game) {
      game.Scores += 1000;
    }
  }
};
