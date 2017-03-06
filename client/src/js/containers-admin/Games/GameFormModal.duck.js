import Immutable from 'seamless-immutable';
import { reset, submit, startSubmit, stopSubmit } from 'redux-form';

import { generateComponent } from '../../ducks/domain';
import { getData, formSubmit } from '../../actions/fetchAndSave';

const componentName = 'GameFormModal';
const SET_MODE = `${componentName}/SET_MODE`;
const MARK_READY = `${componentName}/MARK_READY`;
const MODAL_OPEN = `${componentName}/MODAL_OPEN`;
const MODAL_CLOSE = `${componentName}/MODAL_CLOSE`;
const SET_GAME_ID = `${componentName}/SET_GAME_ID`;
const SET_GAME = `${componentName}/SET_GAME`;
const GET_MAX_ORDER = `${componentName}/GET_MAX_ORDER`;

const formName = 'GameForm';

const component = generateComponent(componentName);
const route = '/api/admin/games';

export function setMode(mode) {
  return { type: SET_MODE, mode };
}

export function openModal() {
  return { type: MODAL_OPEN };
}

export function closeModal() {
  return { type: MODAL_CLOSE };
}

export function setGameId(id) {
  return { type: SET_GAME_ID, id };
}

export function markReady() {
  return { type: MARK_READY };
}

export function resetForm() {
  return (dispatch) => {
    dispatch(reset(formName));
  };
}

export function submitForm() {
  return (dispatch) => {
    dispatch(submit(formName));
  };
}

export function fetchSingleGame(id) {
  return dispatch =>
    dispatch(getData(`${route}/${id}`)).exec(component)
      .then((game) => {
        dispatch({ type: SET_GAME, game });
      });
}

export function getMaxOrder() {
  return dispatch =>
    dispatch(getData(`${route}?action=maxorder`)).exec(component)
      .then(({ maxOrder }) => {
        dispatch({ type: GET_MAX_ORDER, maxOrder });
      });
}

export function newGame({ cover, ...values }) {
  return (dispatch) => {
    const formData = new FormData();

    if (cover && cover[0]) {
      formData.append('cover', cover[0], cover[0].name);
    }

    formData.append('payload', JSON.stringify(values));

    dispatch(startSubmit(formName));
    return dispatch(formSubmit(route, { method: 'POST', body: formData }))
      .then(() => {
        dispatch(stopSubmit(formName));
        return true;
      });
  };
}

export function editGame({ id, cover, ...values }) {
  return (dispatch) => {
    const formData = new FormData();
    const coverStringName = typeof cover === 'string' && { cover };

    if (typeof cover === 'object' && cover[0]) {
      formData.append('cover', cover[0], cover[0].name);
    }

    formData.append('payload', JSON.stringify(Object.assign({}, values, coverStringName)));

    dispatch(startSubmit(formName));
    return dispatch(formSubmit(`${route}/${id}`, { method: 'PUT', body: formData }))
      .then(() => {
        dispatch(stopSubmit(formName));
        return true;
      });
  };
}

const defaultState = Immutable({
  mode: '',
  open: false,
  gameId: '',
  game: {},
  maxOrder: 0,
  ready: false,
});

function reducer(state = null, action) {
  switch (action.type) {
    case SET_MODE: {
      return Immutable.merge(state, { mode: action.mode });
    }

    case MODAL_OPEN: {
      return Immutable.merge(state, { open: true });
    }

    case MODAL_CLOSE: {
      return Immutable.merge(state, { open: false });
    }

    case MARK_READY: {
      return Immutable.merge(state, { ready: true });
    }

    case SET_GAME_ID: {
      return Immutable.merge(state, { gameId: action.id });
    }

    case SET_GAME: {
      return Immutable.merge(state, { game: action.game });
    }

    case GET_MAX_ORDER: {
      return Immutable.merge(state, { maxOrder: action.maxOrder });
    }

    default: {
      return state;
    }
  }
}

export default {
  defaultState,
  reducer,
};
