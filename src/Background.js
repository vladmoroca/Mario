'use strict';

export default class Background {
  constructor(context) {
    this.position = {
      x: -800,
      y: 0
    };
    this.context = context;
    this.skin = document.createElement('img');
    this.skin.src = "../assets/Background.png";
  }
  draw() {
    this.context.drawImage(this.skin,
      this.position.x,
      this.position.y,
      innerWidth * 5,
      innerWidth / 3);
  }
}