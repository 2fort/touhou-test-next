import Immutable from 'seamless-immutable';
import { combineReducers } from 'redux';
import DomainSlice, { defaultDomainState } from '../utils/DomainSlice';
import * as types from '../../constants/ActionTypes';

const domainStore = new DomainSlice();

domainStore.addComponent('GamesList');
domainStore.addComponent('CharactersList');
domainStore.addComponent('SingleCharacter');

const testState = Immutable.merge(defaultDomainState, {
  steps: [],
  activeStep: 0,
  modalIsOpen: false,
  maxSteps: 0,
  passedSteps: 0,
});

function test(state = null, action) {
  switch (action.type) {
    case types.TEST_BEGIN: {
      return Immutable.merge(state, {
        steps: action.steps,
        activeStep: 1,
        maxSteps: action.maxSteps,
        passedSteps: 0,
      });
    }

    case types.TEST_SET_STEP: {
      return Immutable.merge(state, { activeStep: action.stepNumber });
    }

    case types.TEST_OPEN_RESULTS_WINDOW: {
      return Immutable.merge(state, { modalIsOpen: true });
    }

    case types.TEST_CLOSE_RESULTS_WINDOW: {
      return Immutable.merge(state, { modalIsOpen: false });
    }

    case types.TEST_ANSWER_GIVEN: {
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

domainStore.addComponent('Test', test, testState);

export default combineReducers({
  gamesList: (state, action) => domainStore.getComponent(state, action, 'GamesList'),
  charactersList: (state, action) => domainStore.getComponent(state, action, 'CharactersList'),
  singleCharacter: (state, action) => domainStore.getComponent(state, action, 'SingleCharacter'),
  test: (state, action) => domainStore.getComponent(state, action, 'Test'),
});
