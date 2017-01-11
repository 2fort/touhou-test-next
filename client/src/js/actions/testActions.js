import { normalize } from 'normalizr';
import { charactersEntity } from '../schemas/characters';
import checkResponseStatus from './asyncHelpers';
import * as types from '../constants/ActionTypes';

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

export function fetchCharsAndBeginTest(component, maxSteps) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    fetch('/api/characters')
      .then((response) => {
        checkResponseStatus(response);
        return response.json();
      })
      .then((characters) => {
        const data = normalize(characters, [charactersEntity]);

        const steps = generateTest(characters, maxSteps);

        dispatch({
          type: types.TEST_BEGIN,
          steps,
          maxSteps,
        });

        dispatch({
          type: types.FETCH_SUCCESS,
          component,
          entities: data.entities,
          visible: data.result,
          fetchedAt: Date.now(),
        });
      })
      .catch((err) => {
        dispatch({
          type: types.FETCH_FAIL,
          component,
          err,
        });
      });
  };
}

export function resetTest() {
  return (dispatch) => {
    dispatch(fetchCharsAndBeginTest('Test', 20));
  };
}

export function setStep(stepNumber) {
  clearTimeout(window.__stepTimer);
  return {
    type: types.TEST_SET_STEP,
    stepNumber,
  };
}

export function goPrevStep() {
  return (dispatch, getState) => {
    const test = getState().domain.test;

    if (test.activeStep !== 1) {
      dispatch(setStep(test.activeStep - 1));
    }
  };
}

export function goNextStep() {
  return (dispatch, getState) => {
    const test = getState().domain.test;

    if (test.activeStep <= test.passedSteps && test.activeStep < test.maxSteps) {
      dispatch(setStep(test.activeStep + 1));
    }
  };
}

export function openResultsWindow() {
  return {
    type: types.TEST_OPEN_RESULTS_WINDOW,
  };
}

export function closeResultsWindow() {
  return {
    type: types.TEST_CLOSE_RESULTS_WINDOW,
  };
}

export function answerGiven(name) {
  return {
    type: types.TEST_ANSWER_GIVEN,
    name,
  };
}
