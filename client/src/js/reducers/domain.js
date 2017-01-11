import Immutable from 'seamless-immutable';
import { combineReducers } from 'redux';
import * as types from '../constants/ActionTypes';

class DomainClass {
  constructor() {
    this.components = {};
  }

  addComponent(component, reducer, defaultState) {
    this.components[component] = {
      reducer,
      defaultState,
    };
  }

  getComponent(state, action, component) {
    if (component === action.component) {
      switch (action.type) {
        case types.CONTAINER_MOUNT: {
          const returnState = (state) || this.components[component].defaultState;
          return Immutable.merge(returnState, { active: true });
        }

        case types.CONTAINER_UNMOUNT: {
          return Immutable.merge(state, { active: false });
        }

        case types.CONTAINER_DESTROY: {
          return null;
        }

        case types.FETCH_BEGIN: {
          return Immutable.merge(state, { pending: true });
        }

        case types.FETCH_SUCCESS:
          return Immutable.merge(state, {
            pending: false,
            visible: action.visible,
            fetchedAt: action.fetchedAt,
          });

        case types.FETCH_FAIL:
          return Immutable.merge(state, {
            pending: false,
          });

        default:
          return null;
          // console.log(`Reducer ${component} + can't find his component-specific action!`);
      }
    }
    return this.components[component].reducer(state, action);
  }
}

const domainStore = new DomainClass();

function gamesList(state = null, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function charactersList(state = null, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function singleCharacter(state = null, action) {
  switch (action.type) {
    default:
      return state;
  }
}

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

const sharedState = Immutable({
  active: false,
  pending: false,
  visible: [],
  fetchedAt: 0,
});

const testState = Immutable.merge({
  steps: [],
  activeStep: 0,
  modalIsOpen: false,
  maxSteps: 0,
  passedSteps: 0,
});

domainStore.addComponent('GamesList', gamesList, sharedState);
domainStore.addComponent('CharactersList', charactersList, sharedState);
domainStore.addComponent('SingleCharacter', singleCharacter, sharedState);
domainStore.addComponent('Test', test, testState);

export default combineReducers({
  test: (state, action) => domainStore.getComponent(state, action, 'Test'),
  gamesList: (state, action) => domainStore.getComponent(state, action, 'GamesList'),
  charactersList: (state, action) => domainStore.getComponent(state, action, 'CharactersList'),
  singleCharacter: (state, action) => domainStore.getComponent(state, action, 'SingleCharacter'),
});
