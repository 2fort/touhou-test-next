import _ from 'lodash';
import _characters from '../../json/characters.json';
import _games from '../../json/games.json';

function randomNumber(scopeLength) {
  return Math.floor(Math.random() * scopeLength);
}

export function generateNewTest(maxSteps) {
  const characters = _characters.map(char => ({ name: char.name, image: char.image }));

  const steps = [];

  for (let st = 1; st <= maxSteps; st++) {
    let rndCharacterPosition = randomNumber(characters.length);
    const rndCharacter = characters[rndCharacterPosition];
    const buttonsArray = characters.map(item => item.name);

    const oneStep = {
      step: st,
      image: rndCharacter.image,
      passed: false,
      buttons: [rndCharacter.name],
      rightAnswer: rndCharacter.name,
      givenAnswer: '',
    };

    characters.splice(rndCharacterPosition, 1);
    buttonsArray.splice(buttonsArray.indexOf(oneStep.rightAnswer), 1);

    for (let i = 1; i <= 4; i++) {
      rndCharacterPosition = randomNumber(buttonsArray.length);
      oneStep.buttons[i] = buttonsArray[rndCharacterPosition];
      buttonsArray.splice(rndCharacterPosition, 1);
    }

    for (let i = oneStep.buttons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = oneStep.buttons[i];
      oneStep.buttons[i] = oneStep.buttons[j];
      oneStep.buttons[j] = temp;
    }

    steps.push(oneStep);
  }

  return steps;
}

export function getSingleCharInfo(charName) {
  return _characters.filter(char => _.snakeCase(char.name) === charName)[0];
}

export function getAllCharsFromGame(gameTitle) {
  return _characters.filter(data => _.snakeCase(data.game) === gameTitle);
}

export function getProperGameTitle(gameTitle) {
  return _games.filter(game => _.snakeCase(game.title) === gameTitle)[0].title;
}

export function getProperCharName(charName) {
  return _characters.filter(char => _.snakeCase(char.name) === charName)[0].name;
}
