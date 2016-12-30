import * as testApi from '../api';
import * as types from '../constants/ActionTypes';

const maxSteps = 20;

const initialState = {
  inProgress: false,
};

export default function test(state = initialState, action) {
  switch (action.type) {
    case types.TEST_BEGIN: {
      const newSteps = testApi.generateNewTest(maxSteps);
      return {
        ...state,
        inProgress: true,
        steps: newSteps,
        activeStep: 1,
        modalIsOpen: false,
        maxSteps,
        passedSteps: 0,
      };
    }

    case types.TEST_END: {
      return {
        ...initialState,
      };
    }

    case types.GO_PREV_STEP: {
      return { ...state, activeStep: state.activeStep - 1 };
    }

    case types.GO_NEXT_STEP: {
      return { ...state, activeStep: state.activeStep + 1 };
    }

    case types.SET_STEP: {
      return { ...state, activeStep: action.stepNumber };
    }

    case types.OPEN_RESULTS_WINDOW: {
      return { ...state, modalIsOpen: true };
    }

    case types.CLOSE_RESULTS_WINDOW: {
      return { ...state, modalIsOpen: false };
    }

    case types.RESET_TEST: {
      const newSteps = testApi.generateNewTest(maxSteps);
      return {
        ...state,
        steps: newSteps,
        activeStep: 1,
        modalIsOpen: false,
        passedSteps: 0,
      };
    }

    case types.ANSWER_GIVEN: {
      return { ...state, steps: action.newSteps, passedSteps: state.passedSteps + 1 };
    }

    default: {
      return state;
    }
  }
}
