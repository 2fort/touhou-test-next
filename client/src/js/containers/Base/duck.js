import Immutable from 'seamless-immutable';
import { submitData } from '../../actions/fetchAndSave';

// App Base actions
export const CHANGE_MODE = 'Base/CHANGE_MODE';

export function changeMode(mode) {
  return { type: CHANGE_MODE, mode };
}

export function getToken(values) {
  return dispatch =>
    dispatch(submitData('/api/signin')).post().json(values).exec()
      .then((response) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          window.location = '/admin';
        }
      });
}

export default function base(state = Immutable({ mode: 'grid' }), action) {
  switch (action.type) {
    case CHANGE_MODE:
      return Immutable.merge(state, { mode: action.mode });

    default: {
      return state;
    }
  }
}
