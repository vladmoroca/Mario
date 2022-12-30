'use strict';

class Control {
  constructor(game) {
    this.game = game;
    this.keys = {
      87: { velocity: { x: 0, y: -game.PlayerJump } }, //w
      65: { velocity: { x: game.PlayerSpeed, y: 0 } }, //a
      68: { velocity: { x: -game.PlayerSpeed, y: 0 } }, //d
      37: { velocity: { x: game.PlayerSpeed, y: 0 } },
      38: { velocity: { x: 0, y: -game.PlayerJump } }, //Arrows
      39: { velocity: { x: -game.PlayerSpeed, y: 0 } },
      32: { velocity: { x: 0, y: -game.PlayerJump } }, //Space
    };
  }

  keyboardInput(obj = '') {
    const create = e => {
      if (this.game.createMod) {
        this.game.CreateObject(e, obj);
      }
    };
    const del = e => {
      if (this.game.createMod) {
        this.game.Delete(e, this.game.Enemys);
        this.game.Delete(e, this.game.Blocks);
      }
    };
    onkeydown = el => {
      for (const key of Object.keys(this.keys)) {
        if (el.keyCode == key) {
          if (this.keys[key].velocity.x) {
            this.game.player.velocity.x = this.keys[key].velocity.x;
          }
          if ((this.keys[key].velocity.y) &&
           this.game.player.velocity.y === 0) {
            this.game.player.velocity.y = this.keys[key].velocity.y;
          }
        }
      }
      if (!el.repeat) {
        if (el.key === 'e') {
          addEventListener('click', create);
        }
        if (el.key === 'r') {
          addEventListener('click', del);
        }
      }
    };
    onkeyup = el => {
      for (const key of Object.keys(this.keys)) {
        if (el.keyCode == key) {
          if (this.keys[key].velocity.x) {
            this.game.player.velocity.x = 0;
          }
        }
      }
      if (el.key === 'e') {
        removeEventListener('click', create);
      }
      if (el.key === 'r') {
        removeEventListener('click', del);
      }
    };
  }
}
