import Immutable from 'seamless-immutable';
import * as types from '../../constants/ActionTypes';

// type: success, info, warning, danger

export default function msg(state = Immutable({ text: '', type: '', date: 0 }), action) {
  switch (action.type) {
    case types.SUBMIT_SUCCESS:
      return Immutable.merge(state, {
        status: action.status || '',
        text: action.message || 'Success!',
        type: 'success',
        date: new Date(),
      });

    case types.FETCH_FAIL:
    case types.SUBMIT_FAIL:
      console.log(action);
      return Immutable.merge(state, {
        status: action.err.status || '',
        text: action.err.message || 'Error!',
        type: 'danger',
        date: new Date(),
      });

    case types.FLUSH_MSG:
      return Immutable.merge(state, { text: '', type: '', date: 0 });

    default: {
      return state;
    }
  }
}
