'use strict';

export default class Control {
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
    const create = e => this.game.createMod ? this.game.CreateObject(e, obj): {};
    const del = e => {
      if (this.game.createMod) {
        this.game.Delete(e, this.game.Enemys);
        this.game.Delete(e, this.game.Blocks);
      }
    };

    onkeydown = el => {
      if (!el.repeat) {
        if (this.keys[el.keyCode]) {
          if (this.keys[el.keyCode].velocity.x) {
            this.game.player.velocity.x = this.keys[el.keyCode].velocity.x;
          } else if (this.game.player.velocity.y === 0) {
            this.game.player.velocity.y = this.keys[el.keyCode].velocity.y;
          }
        }
        el.key === 'f' ? this.game.Shot():{};
        el.key === 'e' ? addEventListener('click', create):{};
        el.key === 'r' ? addEventListener('click', del):{};
      }
    };
    onkeyup = el => {
      if (this.keys[el.keyCode]) {
        this.keys[el.keyCode].velocity.x ? this.game.player.velocity.x = 0:{};
        }
      el.key === 'e' ? removeEventListener('click', create):{};
      el.key === 'r' ? removeEventListener('click', del):{};
    };
  }
}
