'use strict'

export default class ColisionChecker{
  constructor(game){
    this.game = game;
    this.BlockEnemyColision = {
      'Right': (block, index, enemy) => enemy.velocity.x *= -1,
      'Left': (block, index, enemy) => enemy.velocity.x *= -1,
      'Up': (block, index, enemy) => enemy.velocity.y = 0,
    };

    this.PlayerEnemyColision = {
      'Right': () => this.game.PlayerDamage(),
      'Left': () => this.PlayerEnemyColision['Right'](),
      'Up': (enemy, index, player) =>  this.game.EnemyDeath(enemy, index),
    };

    this.BlockPlayerColision = {
      'Right': (block, index, player) => player.velocity.x = 0,
      'Left': (block, index, player) => player.velocity.x = 0,
      'Up': (block, index, player) => player.velocity.y = 0,
      'Down': (block, index, player) => {
        if (block.name === 'Floor' && player.condition > 0) {
          this.game.Blocks.splice(index, 1);
        }
        block.Surprise ? this.game.BonusSpawn(block.Surprise(), block):{};
        player.velocity.y = 1;
      },
    };
    this.BonusPlayerColision = {
      'Right': (bonus, index) => {
        bonus.award(this.game);
        this.game.Bonuses.splice(index, 1);},
      'Left': (bonus, index) => this.BonusPlayerColision['Right'](bonus, index),
      'Up': (bonus, index) => this.BonusPlayerColision['Right'](bonus, index),
      'Down': (bonus, index) => this.BonusPlayerColision['Right'](bonus, index),
    }
    this.ActivityBlockColision = {
      'Right': (activity, index) => this.game.Activity.splice(index, 1),
      'Left': (activity, index) => this.game.Activity.splice(index, 1),
      'Up': (activity, index) => this.game.Activity.splice(index, 1),
      'Down': (activity, index) => this.game.Activity.splice(index, 1),
    }
    this.ActivityEnemyColision = {
      'Right': (activity, index, enemy, index2) => {
        this.game.EnemyDeath(enemy, index2),
        this.game.Activity.splice(index, 1)
      },
      'Left': (activity, index, enemy, index2) => {
        this.game.EnemyDeath(enemy, index2),
        this.game.Activity.splice(index, 1)
      },
    };
  }

  Colision(obj, obs) {
    const x = obj.position.x;
    const y = obj.position.y;
    const vx = obj.velocity.x;
    const vy = obj.velocity.y;
    const xs = obs.position.x;
    const ys = obs.position.y;
    const vxs = obs.velocity.x;
    const vys = obs.velocity.y;

    if ((x + obj.wigth >= xs) && (x + obj.wigth + vx <=  xs + vxs) &&
     (y <= ys + obs.height) && (y + obj.height >= ys)) {
      return 'Left';
    }

    if ((x <= xs + obs.wigth) && (x + vx >= xs + obs.wigth + vxs) &&
     (y <= ys + obs.height) && (y + obj.height >= ys)) {
      return 'Right';
    }

    if ((x + obj.wigth - 10 > xs) && (x + 10 < xs + obs.wigth)) {
      if ((y + obj.height <= ys) && (y + obj.height + vy >= ys + vys)) {
        return 'Down';
      }

      if ((y >= ys + obs.height) && (y + vy <= ys + obs.height + vys)) {
        return 'Up';
      }
    }
    return 0;
  }

  Check(arr, arr2, colection) {
    arr.forEach((el, index) => {
      !el.position.y ? arr.splice(index, 1):{};
      el.Update ? el.Update(this.game.gravity): el.draw();
      if (Array.isArray(arr2)) {
        arr2.forEach((el2, index2) => {
          const col = this.Colision(el, el2)
          colection[col] ? colection[col](el, index, el2, index2):{};
        });
      } else {
        const col = this.Colision(el, arr2)
        colection[col] ? colection[col](el, index, arr2):{};
      }
    });
  }
}