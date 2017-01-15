import Immutable from 'seamless-immutable';
import * as types from '../../constants/ActionTypes';

export default function errors(state = Immutable({ error: '' }), action) {
  switch (action.type) {
    case types.FETCH_FAIL:
      return Immutable.merge(state, { error: action.err.message });

    default: {
      return state;
    }
  }
}
