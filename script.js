'use strict';

const button = document.querySelector('input');
button.size = BasicSize;

const enemies = './assets/enemies.png';
const tube = './assets/tube.png';
const block = './assets/block.png';

const PlayerSpeed = BasicSize / 7;
const PlayerJump = BasicSize / 2.5;
const GameSpeed = 20; // more - slower
const AnimationSpeed = 200;

let player;
let GameTimer;
let AnimationTimer;
let Enemys = [];
let blocks = [];

const Update = () => {
  player.Update();
  if (player.position.y > innerHeight) {
    Restart();
  }

  blocks.forEach(block => {
    block.draw();
    const col = Colision(player, block);
    if (col === 'Right' || col === 'Left') {
      player.velocity.x = 0;
    }
    if (col === 'Up') {
      player.velocity.y = 1;
    }
    if (col === 'Down') {
      player.velocity.y = 0;
    }
  });

  blocks.forEach(block => {
    block.position.x += player.velocity.x;
  });

  Enemys.forEach((enemy, index) => {
    enemy.position.x += player.velocity.x;
    if (enemy.position.y > innerHeight) {
      Enemys.splice(index, 1);
    }
    enemy.Update();
    blocks.forEach(block => {
      block.draw();
      const col = Colision(enemy, block);
      if (col === 'Right' || col === 'Left') {
        enemy.velocity.x *= -1;
      }
      if (col === 'Up') {
        enemy.velocity.y = 1;
      }
      if (col === 'Down') {
        enemy.velocity.y = 0;
      }
    });

    const PCol = Colision(enemy, player);
    if (PCol === 'Right' || PCol === 'Left') {
      Restart();
    }
    if (Colision(player, enemy) === 'Down') {
      enemy.frames = 2;
      enemy.velocity.x = 0;
      enemy.position.y += 5;
      player.velocity.y = -PlayerJump;
      setTimeout(() => {
        Enemys.splice(index, 1);
      },
      1000);
    }
  });
};

const Animation = () => {
  player.Animation();
  Enemys.forEach(enemy => enemy.Animation());
};

const Restart = () => {
  clearInterval(GameTimer);
  clearInterval(AnimationTimer);
  Enemys = [];
  blocks = [];
  player = new Player();

  Enemys.push(new Enemy({ x: BasicSize * 30, y: BasicSize * 8 }, enemies));

  for (let i = -5; i <= 200; i++) {
    blocks.push(new Block({ x: i * BasicSize, y: BasicSize * 10 }, block));
  }

  GameTimer = setInterval(Update, GameSpeed);
  AnimationTimer = setInterval(Animation, AnimationSpeed);
};


addEventListener('keydown', event => {
  switch (event.key) {
  case 'w':
    if (player.velocity.y === 0) {
      player.velocity.y -= PlayerJump;
    }
    break;
  case ' ':         //space
    if (player.velocity.y === 0) {
      player.velocity.y -= PlayerJump;
    }
    break;
  case 'a':
    player.velocity.x = PlayerSpeed;
    break;
  case 'd':
    player.velocity.x = -PlayerSpeed;
    break;
  }
});

addEventListener('keyup', event => {
  switch (event.key) {
  case 'a':
    player.velocity.x = 0;
    break;
  case 'd':
    player.velocity.x = 0;
    break;

  }
});

addEventListener('dblclick', e => {
  const xs = e.offsetX - (e.offsetX % BasicSize);
  const ys = e.offsetY - (e.offsetY % BasicSize);
  blocks.push(new Block({ x: xs, y: ys }, block));
});

button.addEventListener('click', Restart);

Restart();
