import Immutable from 'seamless-immutable';
import * as types from '../constants/ActionTypes';

const initialState = Immutable({
  mode: 'grid',
});

export default function main(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_MODE: {
      return Immutable.merge(state, { mode: action.mode });
    }

    case types.TEST_BEGIN: {
      return Immutable.merge(state, {
        steps: action.steps,
        activeStep: 1,
        modalIsOpen: false,
        maxSteps: action.maxSteps,
        passedSteps: 0,
      });
    }

    case types.GO_PREV_STEP: {
      return Immutable.merge(state, { activeStep: state.activeStep - 1 });
    }

    case types.GO_NEXT_STEP: {
      return Immutable.merge(state, { activeStep: state.activeStep + 1 });
    }

    case types.SET_STEP: {
      return Immutable.merge(state, { activeStep: action.stepNumber });
    }

    case types.OPEN_RESULTS_WINDOW: {
      return Immutable.merge(state, { modalIsOpen: true });
    }

    case types.CLOSE_RESULTS_WINDOW: {
      return Immutable.merge(state, { modalIsOpen: false });
    }

    case types.ANSWER_GIVEN: {
      return Immutable.merge(state, {
        steps: action.newSteps,
        passedSteps: state.passedSteps + 1,
      });
    }

    default: {
      return state;
    }
  }
}
