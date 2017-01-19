import Immutable from 'seamless-immutable';
import * as types from '../../constants/ActionTypes';

export default function main(state = Immutable({ mode: 'grid' }), action) {
  switch (action.type) {
    case types.CHANGE_MODE:
      return Immutable.merge(state, { mode: action.mode });

    default: {
      return state;
    }
  }
}