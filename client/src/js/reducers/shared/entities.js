import Immutable from 'seamless-immutable';
import * as types from '../../constants/ActionTypes';

export default function entities(state = Immutable({ games: {}, characters: {} }), action) {
  switch (action.type) {
    case types.FETCH_SUCCESS:
      return Immutable.merge(state, action.entities, { deep: true });

    default: {
      return state;
    }
  }
}
