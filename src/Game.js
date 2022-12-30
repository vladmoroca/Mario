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
    this.distance = 0;
    this.CurrentLevel = 0;
    this.createMod = false;
    this.creating = 0;
    this.GameTimer;
    this.AnimationTimer;
    this.Enemys = [];
    this.Blocks = [];
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
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.Update(this.gravity);
    if (this.player.position.y > innerHeight) {
      this.Start(this.CurrentLevel);
    }
    this.distance -= this.player.velocity.x;
    this.Blocks.forEach(block => {
      if (block.position.x > 1900 || block.position.x < -100) return;
      block.draw();
      const col = this.Colision(this.player, block);
      if (col === 'Right' || col === 'Left') {
        this.player.velocity.x = 0;
      }
      if (col === 'Up') {
        this.player.velocity.y = 1;
      }
      if (col === 'Down') {
        this.player.velocity.y = 0;
      }
    });
    this.Blocks.forEach(block => {
      block.position.x += this.player.velocity.x;
    });

    this.Enemys.forEach((enemy, index) => {
      enemy.position.x += this.player.velocity.x;
      if (enemy.position.y > innerHeight) {
        this.Enemys.splice(index, 1);
      }
      enemy.Update(this.gravity);
      this.Blocks.forEach(block => {
        if (block.position.x > enemy.position.x + 300 ||
           block.position.x < enemy.position.x - 300) {
          return;
        }
        block.draw();
        const col = this.Colision(enemy, block);
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

      const PCol = this.Colision(enemy, this.player);
      if (PCol === 'Right' || PCol === 'Left') {
        this.Start(this.CurrentLevel);
      }
      if (this.Colision(this.player, enemy) === 'Down') {
        enemy.frames = 2;
        enemy.velocity.x = 0;
        enemy.position.y += 5;
        this.player.velocity.y = -this.PlayerJump;
        setTimeout(() => {
          this.Enemys.splice(index, 1);
        },
        2000);
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
    this.distance = 0;
    clearInterval(this.GameTimer);
    clearInterval(this.AnimationTimer);
    this.Enemys = [];
    this.Blocks = [];
    if (this.CurrentLevel === 0) {
      this.Enemys.push(new EnemysClasses['Turtle']({ x: this.BasicSize * 30,
        y: this.BasicSize * 8 }, this.BasicSize, this.context));
      for (let i = -5; i <= 200; i++) {
        this.Blocks.push(new Block({ x: i * this.BasicSize,
          y: this.BasicSize * 10 },  this.BasicSize, this.context));
      }
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
      for (const key of Object.keys(EnemysClasses)) {
        if (this.creating === key) {
          this.Enemys.push(new EnemysClasses[this.creating]({ x: xs, y: ys },
            this.BasicSize, this.context));
        }
      }
      for (const key of Object.keys(BlockClasses)) {
        if (this.creating === key) {
          this.Blocks.push(new BlockClasses[this.creating]({ x: xs, y: ys },
            this.BasicSize, this.context));
        }
      }
    }
  }

  Delete(event, arr) {
    arr.forEach((el, index) => {
      if (event.offsetX > el.position.x &&
        event.offsetX < el.position.x + el.wigth &&
        event.offsetY > el.position.y &&
        event.offsetY < el.position.y + el.height) {
        arr.splice(index, 1);
      }
    });
  }
}







