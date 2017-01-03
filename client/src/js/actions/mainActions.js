import Immutable from 'seamless-immutable';
import * as types from '../constants/ActionTypes';
import { purgeCache } from './asyncActions';

export function changeMode(mode) {
  return {
    type: types.CHANGE_MODE,
    mode,
  };
}

function randomNumber(scopeLength) {
  return Math.floor(Math.random() * scopeLength);
}

export function generateTest(characters, maxSteps) {
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

export function goPrevStep() {
  return (dispatch, getState) => {
    const main = getState().main;

    if (main.activeStep !== 1) {
      dispatch({ type: types.GO_PREV_STEP });
    }
  };
}

export function goNextStep() {
  return (dispatch, getState) => {
    const main = getState().main;

    if (main.activeStep <= main.passedSteps && main.activeStep < main.maxSteps) {
      dispatch({ type: types.GO_NEXT_STEP });
    }
  };
}

export function setStep(stepNumber) {
  return {
    type: types.SET_STEP,
    stepNumber,
  };
}

export function openResultsWindow() {
  return {
    type: types.OPEN_RESULTS_WINDOW,
  };
}

export function closeResultsWindow() {
  return {
    type: types.CLOSE_RESULTS_WINDOW,
  };
}

export function answerGiven(name) {
  return (dispatch, getState) => {
    const main = getState().main;
    const currentStep = main.steps[main.activeStep - 1];

    const newSteps = Immutable.flatMap(main.steps, (step, i) => {
      if (i === main.activeStep - 1) {
        return Immutable.merge(step, { passed: true, givenAnswer: name });
      }
      return step;
    });

    dispatch({
      type: types.ANSWER_GIVEN,
      newSteps,
    });

    setTimeout(() => {
      if (currentStep.step === main.maxSteps) {
        dispatch(openResultsWindow());
      } else {
        dispatch(goNextStep());
      }
    }, 850);
  };
}
