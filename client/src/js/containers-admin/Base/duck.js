import Immutable from 'seamless-immutable';

const AUTH_USER = 'AUTH_USER';
const UNAUTH_USER = 'UNAUTH_USER';

export function authUser() {
  return { type: AUTH_USER };
}

export function unAuthUser() {
  localStorage.removeItem('token');
  return { type: UNAUTH_USER };
}

const defaultState = Immutable({
  authenticated: false,
});

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case AUTH_USER:
      return Immutable.merge(state, { authenticated: true });

    case UNAUTH_USER:
      return Immutable.merge(state, { authenticated: false });

    default: {
      return state;
    }
  }
}
