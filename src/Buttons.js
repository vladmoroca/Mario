'use strict';

  
export const Buttons = {
  ButtonRestart: document.querySelector('#RestartButton'),
  ButtonCreateMod: document.querySelector('#CreatorButton'),
  ButtonSave: document.querySelector('#SaveButton'),
  ButtonImport: document.querySelector('#ImportButton'),
  ButtonBlock: document.querySelector('#BlockButton'),
  ButtonSurprise: document.querySelector('#SurpriseButton'),
  ButtonGoomba: document.querySelector('#GoombaButton'),
  ButtonTurtle: document.querySelector('#TurtleButton'),
  ButtonTubeUp: document.querySelector('#TubeUpButton'),
  ButtonTube: document.querySelector('#TubeButton'),
}

export const createButtons = [
  [Buttons.ButtonTubeUp, 'TubeUp'],
  [Buttons.ButtonTube, 'Tube'],
  [Buttons.ButtonGoomba, 'Goomba'],
  [Buttons.ButtonBlock, 'Floor'],
  [Buttons.ButtonTurtle, 'Turtle'],
  [Buttons.ButtonSurprise, 'Surprise'],
]