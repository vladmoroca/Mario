'use strict';

import {Player} from "./Player.js"
import {BlockClasses} from "./Blocks.js"
import {EnemysClasses} from "./Enemys.js"
import {BonusClasses} from "./Bonuses.js"
import {ActivityClasses} from "./Activity.js"
import ColisionChecker from "./Colision.js"
import Background from "./Background.js";

export default class Game {
  constructor(level = {}) {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.BasicSize = innerWidth / 30;
    this.gravity = this.BasicSize / 60;
    this.player = new Player(this.BasicSize, this.canvas);
    this.PlayerSpeed = this.BasicSize / 7;
    this.PlayerJump = this.BasicSize / 2.5;
    this.checker = new ColisionChecker(this);
    this.GameSpeed = 20; // more - slower
    this.AnimationSpeed = 100;
    this.CurrentLevel = 0;
    this.createMod = false;
    this.creating = 0;
    this.background = new Background(this.context);
    this.GameTimer;
    this.AnimationTimer;
    this.Enemys = [];
    this.Blocks = [];
    this.Bonuses = [];
    this.Activity = [];
    this.Scores = 0;
    this.Score = document.getElementById('Score');
  }

  Update() {
    this.Score.textContent = 'Scores:' + this.Scores;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.background.draw();
    this.background.position.x += this.player.velocity.x / 3;
    this.player.Update(this.gravity);
    if (this.player.position.y > innerHeight) {
      this.Start(this.CurrentLevel);
    }
    const checker = this.checker;
    checker.Check(this.Blocks, this.player, checker.BlockPlayerColision);
    checker.Check(this.Blocks, this.Enemys, checker.BlockEnemyColision);
    checker.Check(this.Blocks, this.Bonuses, checker.BlockEnemyColision);
    checker.Check(this.Bonuses, this.player, checker.BonusPlayerColision)
    checker.Check(this.Activity, this.Blocks, checker.ActivityBlockColision);
    checker.Check(this.Activity, this.Enemys, checker.ActivityEnemyColision);
    checker.Check(this.Enemys, this.player, checker.PlayerEnemyColision);
    this.UpdatePos(this.Blocks);
    this.UpdatePos(this.Enemys);
    this.UpdatePos(this.Activity);
    this.UpdatePos(this.Bonuses);
  }

  Animation() {
    this.player.Animation();
    this.Enemys.forEach(enemy => enemy.Animation());
  }

  Start() {
    this.canvas.width = innerWidth;
    this.canvas.height = innerWidth / 2;
    this.creating = 0;
    this.createMod = false;
    clearInterval(this.GameTimer);
    clearInterval(this.AnimationTimer);
    this.Enemys = [];
    this.Blocks = [];
    this.Bonuses = [];
    this.Activity = [];
    if(!this.CurrentLevel){
    this.Enemys.push(new EnemysClasses['Turtle']({ x: this.BasicSize * 30,
      y: this.BasicSize * 8 }, this.BasicSize, this.context));
    for (let i = -5; i <= 200; i++) {
      this.Blocks.push(new BlockClasses.Floor({ x: i * this.BasicSize,
        y: this.BasicSize * 10 },  this.BasicSize, this.context));
    }
    this.Blocks.push(new BlockClasses.Surprise({ x: this.BasicSize * 28,
      y: this.BasicSize * 7 }, this.BasicSize, this.context));
    } else {
    this.CurrentLevel.Blocks.forEach(block => {
      this.Blocks.push(new BlockClasses[block.name](block.position,
        this.BasicSize, this.context));
    });
     this.CurrentLevel.Enemys.forEach(enemy => {
      this.Enemys.push(new EnemysClasses[enemy.name](enemy.position,
        this.BasicSize, this.context));
      });
    }
    this.player = new Player(this.BasicSize, this.canvas);
    this.GameTimer = setInterval(() => this.Update(), this.GameSpeed);
    this.AnimationTimer = setInterval(() => this.Animation(), this.AnimationSpeed);
  }

  CreateMod() {
    this.Start(this.CurrentLevel);
    this.createMod = true;
    this.Enemys.forEach(enemy => enemy.velocity.x = 0);
  }

  CreateObject(e, obj) {
    this.creating = obj;
    if (this.createMod) {
      const xs = e.offsetX - (e.offsetX % this.BasicSize);
      const ys = e.offsetY - (e.offsetY % this.BasicSize);
      const f = (colection, arr) => {
        if (colection[this.creating]) {
          arr.push(new colection[this.creating]({ x: xs, y: ys },
            this.BasicSize, this.context));
          arr[arr.length -1].velocity.x = 0;
        }
      };
      f(EnemysClasses, this.Enemys);
      f(BlockClasses, this.Blocks);
    }
  }

  Delete(event, arr) {
    arr.forEach((el, index) => {
      const x = event.offsetX;
      const y = event.offsetY;
      const mouseHit = (x > el.position.x && x < el.position.x + el.wigth &&
        y > el.position.y && y < el.position.y + el.height);
      if (mouseHit) {
        arr.splice(index, 1);
      }
    });
  }

  BonusSpawn(int, block) {
    if(int){
      let bonusName = 'Coin';
      if (int >= 6) bonusName = 'Mushroom';
      if (int >= 9) bonusName = 'Flower';
      this.Bonuses.push(new BonusClasses[bonusName]({ x: block.position.x,
        y: block.position.y - this.BasicSize },
      this.BasicSize, this.context));
    }
  }

  Shot() {
    if (this.player.charge) {
      this.player.charge--;
      this.Activity.push(new ActivityClasses['FireBall'](
        { x: this.player.position.x, y: this.player.position.y },
        this.BasicSize, this.context));
    }
  }

  UpdatePos(arr) {
    arr.forEach( el => el.position.x += this.player.velocity.x)
  }

  PlayerDamage() {
      if (this.player.condition > 0) {
        this.player = new Player(this.BasicSize, this.canvas);
      } else this.Start(this.CurrentLevel);
  }

  EnemyDeath(enemy, index) {
    enemy.velocity.x = 0;
    this.player.velocity.y = -this.PlayerJump;
    if (enemy.name === 'Turtle') {
      enemy.frames === 5 ? enemy.velocity.x = this.BasicSize / 10 : enemy.frames = 5;
    } else {
      this.Scores += 100;
      enemy.frames = 2;
      enemy.position.y += 5;
      setTimeout(() => {
        this.Enemys.splice(index, 1);
      },
      2000);
    }
  }

  Save() {
    const Level = {
      Enemys: this.Enemys,
      Blocks: this.Blocks
    };
    const blob = new Blob([JSON.stringify(Level)], { type: 'text/javascript' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'MyLevel.json');
    link.click();
  }

  Import() {
    const input = document.createElement('input');
    input.type = 'file';
    let content;
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = readerEvent => {
        content = JSON.parse(readerEvent.target.result);
        this.CurrentLevel = content;
        this.Start();
      };
    };
    input.click();
  }
}







