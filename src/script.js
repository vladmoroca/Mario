'use strict';

const ButtonRestart = document.querySelector('#RestartButton');
const ButtonCreateMod = document.querySelector('#CreatorButton');
const ButtonSave = document.querySelector('#SaveButton');
const ButtonImport = document.querySelector('#ImportButton');
const ButtonBlock = document.querySelector('#BlockButton');
const ButtonSurprise = document.querySelector('#SurpriseButton');
const ButtonGoomba = document.querySelector('#GoombaButton');
const ButtonTurtle = document.querySelector('#TurtleButton');
const Score = document.getElementById('Score');
const createButtons = [ButtonSave, ButtonGoomba, ButtonBlock,
  ButtonTurtle, ButtonSurprise];

const game = new Game();
const control = new Control(game);

const ButtonShow = () => {
  if (game.createMod) {
    for (const but of createButtons) {
      but.style.display = '';
    }
  } else {
    for (const but of createButtons) {
      but.style.display = 'none';
    }
  }
};

const Play = () => {
  ButtonShow();
  game.Start();
  control.keyboardInput();
};

const Create = () => {
  Play();
  game.CreateMod();
  ButtonShow();
};

const Save = () => {
  const Level = {
    name: 'level1',
    Enemys: game.Enemys,
    Blocks: game.Blocks
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
      game.CurrentLevel = content;
      Create();
    };
  };
  input.click();
};

ButtonShow();
