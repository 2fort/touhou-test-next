import Immutable from 'seamless-immutable';
import { charactersEntity } from '../../schemas/appSchemas';

import { getData } from '../../actions/fetchAndSave';
import { generateComponent } from '../../ducks/domain';

const componentName = 'Test';
const component = generateComponent(componentName);

const TEST_BEGIN = `${componentName}/BEGIN`;
const TEST_SET_STEP = `${componentName}/SET_STEP`;
const TEST_OPEN_RESULTS_WINDOW = `${componentName}/OPEN_RESULTS_WINDOW`;
const TEST_CLOSE_RESULTS_WINDOW = `${componentName}/CLOSE_RESULTS_WINDOW`;
const TEST_ANSWER_GIVEN = `${componentName}/ANSWER_GIVEN`;

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

export function testBegin(steps, maxSteps) {
  return {
    type: TEST_BEGIN,
    steps,
    maxSteps,
  };
}

export function fetchCharsAndBeginTest(maxSteps) {
  return dispatch =>
    dispatch(getData('/api/characters'))
      .normalize([charactersEntity])
      .save()
      .asJson()
      .exec(component)
        .then((characters) => {
          const steps = generateTest(characters, maxSteps);
          dispatch(testBegin(steps, maxSteps));
        });
}

export const resetTest = fetchCharsAndBeginTest;

export function setStep(stepNumber) {
  clearTimeout(window.__stepTimer);
  return {
    type: TEST_SET_STEP,
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
    type: TEST_OPEN_RESULTS_WINDOW,
  };
}

export function closeResultsWindow() {
  return {
    type: TEST_CLOSE_RESULTS_WINDOW,
  };
}

export function answerGiven(name) {
  return {
    type: TEST_ANSWER_GIVEN,
    name,
  };
}


const defaultState = Immutable({
  steps: [],
  activeStep: 0,
  modalIsOpen: false,
  maxSteps: 0,
  passedSteps: 0,
});

function reducer(state = null, action) {
  switch (action.type) {
    case TEST_BEGIN: {
      return Immutable.merge(state, {
        steps: action.steps,
        activeStep: 1,
        maxSteps: action.maxSteps,
        passedSteps: 0,
      });
    }

    case TEST_SET_STEP: {
      return Immutable.merge(state, { activeStep: action.stepNumber });
    }

    case TEST_OPEN_RESULTS_WINDOW: {
      return Immutable.merge(state, { modalIsOpen: true });
    }

    case TEST_CLOSE_RESULTS_WINDOW: {
      return Immutable.merge(state, { modalIsOpen: false });
    }

    case TEST_ANSWER_GIVEN: {
      const newSteps = Immutable.flatMap(state.steps, (step, i) => {
        if (i === state.activeStep - 1) {
          return Immutable.merge(step, { passed: true, givenAnswer: action.name });
        }
        return step;
      });

      return Immutable.merge(state, {
        steps: newSteps,
        passedSteps: state.passedSteps + 1,
      });
    }

    default: {
      return state;
    }
  }
}

export default {
  defaultState,
  reducer,
};
