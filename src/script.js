'use strict';

const Score = document.getElementById('Score');

import {Buttons} from "./Buttons.js";
import {createButtons} from "./Buttons.js";
import Game from "./Game.js";
import Control from "./Control.js"

const game = new Game();
const control = new Control(game);

const ButtonShow = (display) => {
  for (const button of createButtons) {
    button[0].style.display = display;
  }
};

const Play = () => {
  ButtonShow('none');
  game.Start();
  control.keyboardInput();
};

const Create = () => {
  Play();
  game.CreateMod();
  ButtonShow('');
};

for(const button of createButtons){
  button[0].addEventListener('click', () => {
    control.keyboardInput(button[1])
  })
}
Buttons.ButtonSave.onclick = game.Save;
Buttons.ButtonImport.onclick = game.Import;
Buttons.ButtonRestart.onclick = Play;
Buttons.ButtonCreateMod.onclick = Create;
ButtonShow('none');
