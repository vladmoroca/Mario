'use strict';

const button = document.querySelector('#RestartButton');
const button2 = document.querySelector('#CreatorButton');
const button3 = document.querySelector('#SaveButton');
const button4 = document.querySelector('#ImportButton');

const PlayerSpeed = BasicSize / 7;
const PlayerJump = BasicSize / 2.5;
const GameSpeed = 20; // more - slower
const AnimationSpeed = 100;
let distance = 0;
let CurrentLevel = 0;

let player;
let GameTimer;
let AnimationTimer;
let Enemys = [];
let Blocks = [];

const Update = () => {
  player.Update();
  if (player.position.y > innerHeight) {
    Restart(CurrentLevel);
  }
  distance -= player.velocity.x;
  Blocks.forEach(block => {
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

  Blocks.forEach(block => {
    block.position.x += player.velocity.x;
  });

  Enemys.forEach((enemy, index) => {
    enemy.position.x += player.velocity.x;
    if (enemy.position.y > innerHeight) {
      Enemys.splice(index, 1);
    }
    enemy.Update();
    Blocks.forEach(block => {
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
      Restart(CurrentLevel);
    }
    if (Colision(player, enemy) === 'Down') {
      enemy.frames = 2;
      enemy.velocity.x = 0;
      enemy.position.y += 5;
      player.velocity.y = -PlayerJump;
      setTimeout(() => {
        Enemys.splice(index, 1);
      },
      2000);
    }
  });
};

const Animation = () => {
  player.Animation();
  Enemys.forEach(enemy => enemy.Animation());
};

const Play = () => {
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
};

const Restart = level => {
  distance = 0;
  Play();
  clearInterval(GameTimer);
  clearInterval(AnimationTimer);
  Enemys = [];
  Blocks = [];
  if (level === 0) {
    Enemys.push(new Enemy({ x: BasicSize * 30, y: BasicSize * 8 }));

    for (let i = -5; i <= 200; i++) {
      Blocks.push(new Block({ x: i * BasicSize, y: BasicSize * 10 }));
    }
  } else {
    level.Blocks.forEach(block => {
      Blocks.push(new Block(block.position));
    });
    level.Enemys.forEach(enemy => {
      Enemys.push(new Enemy(enemy.position));
    });
  }
  player = new Player();

  GameTimer = setInterval(Update, GameSpeed);
  AnimationTimer = setInterval(Animation, AnimationSpeed);
};

const CreateMod = () => {
  Restart(CurrentLevel);
  Enemys.forEach(enemy => {
    enemy.velocity.x = 0;
  });
  addEventListener('keydown', event => {
    addEventListener('mousedown', e => {
      if (event.key === 'e') {
        const xs = e.offsetX - (e.offsetX % BasicSize);
        const ys = e.offsetY - (e.offsetY % BasicSize);
        Blocks.push(new Block({ x: xs, y: ys }));
      }
      if (event.key === 'r') {
        Blocks.forEach((block, index) => {
          if (e.offsetX > block.position.x &&
             e.offsetX < block.position.x + block.wigth &&
             e.offsetY > block.position.y &&
             e.offsetY < block.position.y + block.height) {
            Blocks.splice(index, 1);
          }
        });
      }
    });
  });
};


button.addEventListener('mousedown', () => {
  button3.style.display = 'none';
  Restart(CurrentLevel);
});
button2.addEventListener('mousedown', () => {
  button3.style.display = '';
  CreateMod();
});


const Save = () => {
  const Level = {
    name: 'level1',
    Enemys,
    Blocks
  };
  console.log(Level.Blocks.length);
  const blob = new Blob([JSON.stringify(Level)], { type: 'text/javascript' });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', 'MyLevel.json');
  link.click();
};

const Import = () => {
  const input = document.createElement('input');
  input.type = 'file';
  let content;
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = readerEvent => {
      content = JSON.parse(readerEvent.target.result);
      CurrentLevel = content;
      CreateMod();
    };
  };
  input.click();
};

button3.addEventListener('mousedown', Save);
button4.addEventListener('mousedown', Import);
button3.style.display = 'none';

