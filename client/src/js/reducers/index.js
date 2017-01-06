import Immutable from 'seamless-immutable';
import { combineReducers } from 'redux';

import domain from './domain';
import * as types from '../constants/ActionTypes';

const initialState = Immutable({
  mode: 'grid',
  error: '',
});

function main(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_MODE:
      return Immutable.merge(state, { mode: action.mode });

    case types.FETCH_FAIL:
      return Immutable.merge(state, { error: action.err });

    default: {
      return state;
    }
  }
}

function entities(state = Immutable({ games: {}, characters: {} }), action) {
  switch (action.type) {
    case types.FETCH_SUCCESS:
      return Immutable.merge(state, action.entities, { deep: true });

    default: {
      return state;
    }
  }
}

const rootReducer = combineReducers({
  main,
  entities,
  domain,
});

export default rootReducer;
