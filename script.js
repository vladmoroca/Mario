'use strict';

const ButtonRestart = document.querySelector('#RestartButton');
const ButtonCreateMod = document.querySelector('#CreatorButton');
const ButtonSave = document.querySelector('#SaveButton');
const ButtonImport = document.querySelector('#ImportButton');
const ButtonBlock = document.querySelector('#BlockButton');

const PlayerSpeed = BasicSize / 7;
const PlayerJump = BasicSize / 2.5;
const GameSpeed = 20; // more - slower
const AnimationSpeed = 100;
let distance = 0;
let CurrentLevel = 0;
let createMod = false;

let player;
let GameTimer;
let AnimationTimer;
let Enemys = [];
let Blocks = [];

const ButtonShow = () => {
  if (createMod) {
    ButtonSave.style.display = '';
    ButtonBlock.style.display = '';
  } else {
    ButtonSave.style.display = 'none';
    ButtonBlock.style.display = 'none';
  }
};

const keys = {
  87: { velocity: { x: 0, y: -PlayerJump } }, //w
  65: { velocity: { x: PlayerSpeed, y: 0 } }, //a
  68: { velocity: { x: -PlayerSpeed, y: 0 } }, //d
  37: { velocity: { x: PlayerSpeed, y: 0 } },
  38: { velocity: { x: 0, y: -PlayerJump } }, //Arrows
  39: { velocity: { x: -PlayerSpeed, y: 0 } },
  32: { velocity: { x: 0, y: -PlayerJump } }, //Space
};
const keyboardInput = coll => {
  onkeydown = el => {
    for (const key of Object.keys(coll)) {
      if (el.keyCode == key) {
        if (coll[key].velocity.x) {
          player.velocity.x = coll[key].velocity.x;
        }
        if ((coll[key].velocity.y) && player.velocity.y === 0) {
          player.velocity.y = coll[key].velocity.y;
        }
      }
    }
  };
  onkeyup = el => {
    for (const key of Object.keys(coll)) {
      if (el.keyCode == key) {
        if (coll[key].velocity.x) {
          player.velocity.x = 0;
        }
      }
    }
  };
};

const Update = () => {
  player.Update();
  if (player.position.y > innerHeight) {
    Restart(CurrentLevel);
  }
  distance -= player.velocity.x;
  Blocks.forEach(block => {
    if (block.position.x > 1900 || block.position.x < -100) {
      return;
    }
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
      if (block.position.x > enemy.position.x + 300 ||
         block.position.x < enemy.position.x - 300) {
        return;
      }
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
  keyboardInput(keys);
};


const Restart = level => {
  createMod = false;
  ButtonShow();
  distance = 0;
  Play();
  clearInterval(GameTimer);
  clearInterval(AnimationTimer);
  Enemys = [];
  Blocks = [];
  if (level === 0) {
    Enemys.push(new Goomba({ x: BasicSize * 30, y: BasicSize * 8 }));

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
  createMod = true;
  ButtonShow();
  Enemys.forEach(enemy => {
    enemy.velocity.x = 0;
  });
};



const Save = () => {
  const Level = {
    name: 'level1',
    Enemys,
    Blocks
  };
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

const CreateBlock = () => {
  if (createMod) {
    addEventListener('keydown', event => {
      addEventListener('mousedown', e => {
        if (createMod) {
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
        }
      });
    });
  }
};

ButtonShow();

