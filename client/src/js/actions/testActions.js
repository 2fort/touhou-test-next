import update from 'immutability-helper';
import * as types from '../constants/ActionTypes';

export function beginTest() {
  return (dispatch, getState) => {
    const test = getState().test;
    if (!test.inProgress) {
      dispatch({
        type: types.TEST_BEGIN,
      });
    }
  };
}

export function endTest() {
  return {
    type: types.TEST_END,
  };
}

export function goPrevStep() {
  return (dispatch, getState) => {
    const test = getState().test;

    if (test.activeStep !== 1) {
      dispatch({ type: types.GO_PREV_STEP });
    }
  };
}

export function goNextStep() {
  return (dispatch, getState) => {
    const test = getState().test;

    if (test.activeStep <= test.passedSteps && test.activeStep < test.maxSteps) {
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

export function resetTest() {
  return {
    type: types.RESET_TEST,
  };
}

export function answerGiven(name) {
  return (dispatch, getState) => {
    const test = getState().test;
    const currentStep = test.steps[test.activeStep - 1];

    const newStep = update(currentStep, {
      passed: { $set: true },
      givenAnswer: { $set: name },
    });

    const newSteps = update(test.steps, {
      $splice: [[test.activeStep - 1, 1, newStep]],
    });

    dispatch({
      type: types.ANSWER_GIVEN,
      newSteps,
    });

    setTimeout(() => {
      if (currentStep.step === test.maxSteps) {
        dispatch(openResultsWindow());
      } else {
        dispatch(goNextStep());
      }
    }, 850);
  };
}
