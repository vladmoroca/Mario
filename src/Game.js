'use strict';

class Game {
  constructor(level = 0) {
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = innerWidth;
    this.canvas.height = innerWidth / 2;

    this.BasicSize = innerWidth / 30;
    this.gravity = this.BasicSize / 60;
    this.player = new Player(this.BasicSize, this.canvas);
    this.PlayerSpeed = this.BasicSize / 7;
    this.PlayerJump = this.BasicSize / 2.5;
    this.GameSpeed = 20; // more - slower
    this.AnimationSpeed = 100;
    this.CurrentLevel = 0;
    this.createMod = false;
    this.creating = 0;
    this.GameTimer;
    this.AnimationTimer;
    this.Enemys = [];
    this.Blocks = [];
    this.Bonuses = [];
    this.Activity = [];
    this.Scores = 0;
    this.Score = document.getElementById('Score');
  }

  Colision(obj, obs) {
    if ((obj.position.x + obj.wigth >= obs.position.x) &&
     (obj.position.x + obj.wigth + obj.velocity.x <=
      obs.position.x + obs.velocity.x) &&
     (obj.position.y <= obs.position.y + obs.height) &&
     (obj.position.y + obj.height >= obs.position.y)) {
      return 'Left';
    }

    if ((obj.position.x <= obs.position.x + obs.wigth) &&
     (obj.position.x + obj.velocity.x >=
      obs.position.x + obs.wigth + obs.velocity.x) &&
     (obj.position.y <= obs.position.y + obs.height) &&
     (obj.position.y + obj.height >= obs.position.y)) {
      return 'Right';
    }

    if ((obj.position.x + obj.wigth - 2 > obs.position.x) &&
        (obj.position.x + 2 < obs.position.x + obs.wigth)) {
      if ((obj.position.y + obj.height <= obs.position.y) &&
       (obj.position.y + obj.height + obj.velocity.y >= obs.position.y)) {
        return 'Down';
      }

      if ((obj.position.y >= obs.position.y + obs.height) &&
       (obj.position.y + obj.velocity.y <= obs.position.y + obs.height)) {
        return 'Up';
      }
    }
  }
  Update() {
    this.Score.textContent = 'Scores:' + this.Scores;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.Update(this.gravity);
    if (this.player.position.y > innerHeight) {
      this.Start(this.CurrentLevel);
    }

    this.Check(this.Blocks, 0, 0, (block, index) => {
      const col = this.Colision(this.player, block);
      if (col === 'Right' || col === 'Left') {
        this.player.velocity.x = 0;
      }
      if (col === 'Up') {
        if (block.name === 'Floor' && this.player.condition > 0) {
          this.Blocks.splice(index, 1);
        }
        if (block.Surprise) {
          this.BonusSpawn(block.Surprise(), block);
        }
        this.player.velocity.y = 1;
      }
      if (col === 'Down') {
        this.player.velocity.y = 0;
      }
    });

    this.Check(this.Bonuses, this.Blocks, (col, bonus) => {
      if (col === 'Right' || col === 'Left') {
        bonus.velocity.x *= -1;
      }
      if (col === 'Down') {
        bonus.velocity.y = 0;
      }
    }, (bonus, index) => {
      if (this.Colision(bonus, this.player)) {
        bonus.award(this);
        this.Bonuses.splice(index, 1);
      }
    });

    this.Check(this.Activity, this.Blocks, (col, activity, index) => {
      if (col) {
        this.Activity.splice(index, 1);
      }
    });
    this.Check(this.Activity, this.Enemys, (col, act, index, enemy, index2) => {
      if (col) {
        this.Enemys.splice(index2, 1);
        this.Activity.splice(index, 1);
      }
    });

    this.Check(this.Enemys, this.Blocks, (col, enemy) => {
      if (col === 'Right' || col === 'Left') {
        enemy.velocity.x *= -1;
      }
      if (col === 'Down') {
        enemy.velocity.y = 0;
      }
    }, (enemy, index) => {
      const PCol = this.Colision(this.player, enemy);
      if (PCol === 'Right' || PCol === 'Left') {
        if (this.player.condition > 0) {
          this.player.condition = 0;
          this.player.size = 1;
          this.player.animationNum = 29;
        } else this.Start(this.CurrentLevel);
      }
      if (PCol === 'Down') {
        enemy.velocity.x = 0;
        this.player.velocity.y = -this.PlayerJump;
        if (enemy.name === 'Turtle') {
          if (enemy.frames === 5) {
            enemy.velocity.x = this.BasicSize / 10;
          } else enemy.frames = 5;
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
    });
  }

  Animation() {
    this.player.Animation();
    this.Enemys.forEach(enemy => enemy.Animation());
  }

  Start() {
    this.creating = 0;
    this.createMod = false;
    clearInterval(this.GameTimer);
    clearInterval(this.AnimationTimer);
    this.Enemys = [];
    this.Blocks = [];
    this.Bonuses = [];
    this.Activity = [];
    if (this.CurrentLevel === 0) {
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
        this.Blocks.push(new Block(block.position,
          this.BasicSize, this.context));
      });
      this.CurrentLevel.Enemys.forEach(enemy => {
        this.Enemys.push(new EnemysClasses[enemy.name](enemy.position,
          this.BasicSize, this.context));
      });
    }
    this.player = new Player(this.BasicSize, this.canvas);
    this.GameTimer = setInterval(() => {
      this.Update();
    }, this.GameSpeed);
    this.AnimationTimer = setInterval(() => {
      this.Animation();
    }, this.AnimationSpeed);
  }

  CreateMod() {
    this.Start(this.CurrentLevel);
    this.createMod = true;
    this.Enemys.forEach(enemy => {
      enemy.velocity.x = 0;
    });
  }

  CreateObject(e, obj) {
    this.creating = obj;
    if (this.createMod) {
      const xs = e.offsetX - (e.offsetX % this.BasicSize);
      const ys = e.offsetY - (e.offsetY % this.BasicSize);
      const f = (colection, arr) => {
        for (const key of Object.keys(colection)) {
          if (this.creating === key) {
            arr.push(new colection[this.creating]({ x: xs, y: ys },
              this.BasicSize, this.context));
          }
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
    let bonusName;
    if (int >= 3) bonusName = 'Coin';
    if (int >= 6) bonusName = 'Mushroom';
    if (int >= 9) bonusName = 'Flower';
    if (bonusName) {
      this.Bonuses.push(new BonusClasses[bonusName]({ x: block.position.x,
        y: block.position.y - this.BasicSize },
      this.BasicSize, this.context));
    }
  }

  Shot() {
    if (this.player.charge > 0) {
      this.player.charge--;
      this.Activity.push(new ActivityClasses['FireBall'](
        { x: this.player.position.x, y: this.player.position.y },
        this.BasicSize, this.context));
    }
  }

  Check(arr, arr2, instruction, instruction2) {
    arr.forEach((el, index) => {
      if (el.position.y > innerHeight) {
        arr.splice(index, 1);
      }
      el.position.x += this.player.velocity.x;
      if (el.position.x > 1900 || el.position.x < -100) return;

      if (el.Update) {
        el.Update(this.gravity);
      } else el.draw();

      if (arr2) {
        arr2.forEach((el2, index2) => {
          if (el2.position.x > el.position.x + 300 ||
          el2.position.x < el.position.x - 300) {
            return;
          }
          instruction(this.Colision(el, el2), el, index, el2, index2);
        });
      }
      if (instruction2) {
        instruction2(el, index);
      }
    });
  }
}







