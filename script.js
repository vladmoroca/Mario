'use strict';

const goomba = './assets/goomba.png';
const tube = './assets/tube.png';
const block = './assets/block.png';

let player;
let GameTimer;
let Enemys = [];
let blocks = [];

const Restart = () => {
  clearInterval(GameTimer);
  Enemys = [];
  blocks = [];
  player = new Player();

  Enemys.push(new Enemy({ x: 900, y: 100 }, goomba));

  for (let i = 0; i <= 100; i++) {
    blocks.push(new Block({ x: i * 50, y: 700 }, block));
  }

  GameTimer = setInterval(() => {
    player.Update();
    blocks.forEach(block => {
      block.draw();
      const col = Colision(player, block);
      if (col === 'Right' || col === 'Left') {
        player.position.x += player.velocity.x;
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
        Enemys.splice(index, 1);
        player.velocity.y = -20;
      }
    });
  }, 20);
};


addEventListener('keydown', event => {
  switch (event.key) {
  case 'w':         //space
    if (player.velocity.y === 0) {
      player.velocity.y -= 20;
    }
    break;
  case ' ':         //space
    if (player.velocity.y === 0) {
      player.velocity.y -= 20;
    }
    break;
  case 'a':
    player.velocity.x = 7;
    break;
  case 'd':
    player.velocity.x = -7;
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
  const xs = e.offsetX - (e.offsetX % 50);
  const ys = e.offsetY - (e.offsetY % 50);
  blocks.push(new Block({ x: xs, y: ys }, block));
});

Restart();
