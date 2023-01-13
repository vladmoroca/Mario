'use strict';

export default class Background {
  constructor(context) {
    this.position = {
      x: -800,
      y: 0
    };
    this.context = context;
    this.skin = document.createElement('img');
    this.skin.src = "./assets/background.png";
  }
  draw() {
    const BackgroundWidth = innerWidth * 5;
    const BackgroundHeight = innerWidth / 1.76;
    this.context.drawImage(this.skin,
      this.position.x,
      this.position.y,
      BackgroundWidth,
      BackgroundHeight);
  }
}