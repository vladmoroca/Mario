"use strict"

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
    context.drawImage(this.skin, this.position.x, this.position.y, this.wigth, this.height);
  }
  Update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else this.velocity.y = 0;
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
    context.drawImage(this.skin, this.position.x, this.position.y, this.wigth, this.height);
  }
  Update() {
    this.position.y += this.velocity.y;
    this.position.x -= this.velocity.x;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else this.velocity.y = 0;
    this.draw();
  }
}



class Block {
  constructor({ x, y }) {
    this.position = {
      x,
      y
    };
    this.wigth = 50;
    this.height = 50;
    this.skin = document.createElement('img');
    this.skin.src = './assets/block.png';
    this.skin.animatea;
  }
  draw() {
    context.drawImage(this.skin, this.position.x, this.position.y, this.wigth, this.height);
  }
}

Colision = (obj, obstacle) => {
  if ((obj.position.x + obj.wigth >= obstacle.position.x) &&
   (obj.position.x + obj.wigth + obj.velocity.x <= obstacle.position.x) &&
   (obj.position.y <= obstacle.position.y + obstacle.height) &&
   (obj.position.y + obj.height >= obstacle.position.y)) {
    return 'Left';
  }

  if ((obj.position.x <= obstacle.position.x + obstacle.wigth) &&
   (obj.position.x + obj.velocity.x >= obstacle.position.x + obstacle.wigth) &&
   (obj.position.y <= obstacle.position.y + obstacle.height) &&
   (obj.position.y + obj.height >= obstacle.position.y)) {
    return 'Right';
  }

  if ((player.position.x + player.wigth - 3 > obstacle.position.x) &&
      (player.position.x < obstacle.position.x + obstacle.wigth)) {
    if ((obj.position.y + obj.height <= obstacle.position.y) &&
     (obj.position.y + obj.height + obj.velocity.y >= obstacle.position.y)) {
      return 'Down';
    }

    if ((obj.position.y >= obstacle.position.y + obstacle.height) &&
     (obj.position.y + obj.velocity.y <= obstacle.position.y + obstacle.height)) {
      return 'Up';
    }
  }
};


function Restart() {
}

function SaveLevel(enemys, blocks) {
  const Level = {
    enemys,
    blocks,
  };
  //fs.writeFileSync('Level.txt', JSON.stringify(Level), 'utf-8');
}



