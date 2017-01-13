import Immutable from 'seamless-immutable';
import * as types from '../../constants/ActionTypes';

export default function main(state = Immutable({ mode: 'grid', error: '' }), action) {
  switch (action.type) {
    case types.CHANGE_MODE:
      return Immutable.merge(state, { mode: action.mode });

    case types.FETCH_FAIL:
      return Immutable.merge(state, { error: action.err.message });

    default: {
      return state;
    }
  }
}
