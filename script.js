'use strict';

const button = document.querySelector('input');
button.size = BasicSize;

const goomba = './assets/goomba.png';
const tube = './assets/tube.png';
const block = './assets/block.png';

const PlayerSpeed = BasicSize / 7;
const PlayerJump = BasicSize /2.5;

let player;
let GameTimer;
let Enemys = [];
let blocks = [];

const Restart = () => {
  clearInterval(GameTimer);
  Enemys = [];
  blocks = [];
  player = new Player();

  Enemys.push(new Enemy({ x: BasicSize * 20, y: BasicSize * 10 }, goomba));

  for (let i = 0; i <= 100; i++) {
    blocks.push(new Block({ x: i * BasicSize, y: BasicSize * 15 }, block));
  }

  GameTimer = setInterval(() => {
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
      console.log(PCol);
      if (PCol === 'Right' || PCol === 'Left') {
        Restart();
      }
      if (Colision(player, enemy) === 'Down') {
        Enemys.splice(index, 1);
        player.velocity.y = -PlayerJump;
      }
    });
  }, 20);
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
      console.log(PlayerJump);
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
