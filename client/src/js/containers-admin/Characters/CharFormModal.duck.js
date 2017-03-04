import Immutable from 'seamless-immutable';
import { reset, submit, startSubmit, stopSubmit } from 'redux-form';

import { generateComponent } from '../../ducks/domain';
import { getData, formSubmit } from '../../actions/fetchAndSave';

const componentName = 'CharFormModal';
const SET_MODE = `${componentName}/SET_MODE`;
const MARK_READY = `${componentName}/MARK_READY`;
const MODAL_OPEN = `${componentName}/MODAL_OPEN`;
const MODAL_CLOSE = `${componentName}/MODAL_CLOSE`;
const SET_CHAR_ID = `${componentName}/SET_CHAR_ID`;
const SET_CHAR = `${componentName}/SET_CHAR`;
const ADD_CHARS_FROM_GAME = `${componentName}/ADD_CHARS_FROM_GAME`;
const SET_INITIAL_ORDER = `${componentName}/SET_INITIAL_ORDER`;
const ADD_ALL_GAMES = `${componentName}/ADD_ALL_GAMES`;

const formName = 'CharForm';

const component = generateComponent(componentName);
const route = '/api/admin/characters';

export function setMode(mode) {
  return { type: SET_MODE, mode };
}

export function openModal() {
  return { type: MODAL_OPEN };
}

export function closeModal() {
  return { type: MODAL_CLOSE };
}

export function setCharId(id) {
  return { type: SET_CHAR_ID, id };
}

export function setInitialOrder(order) {
  return { type: SET_INITIAL_ORDER, order };
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

export function fetchSingleCharacter(id) {
  return dispatch =>
     dispatch(getData(`${route}/${id}`)).exec(component)
      .then((char) => {
        dispatch({ type: SET_CHAR, char });
        return char;
      });
}

export function getCharsFromGame(gameId) {
  return dispatch =>
    dispatch(getData(`${route}?filter[link][rel]=${gameId}&sort=link.rel`)).exec(component)
      .then((chars) => {
        dispatch({ type: ADD_CHARS_FROM_GAME, chars });
        return chars;
      });
}

export function cleanCharsFromGame() {
  return { type: ADD_CHARS_FROM_GAME, chars: [] };
}

export function fetchAllGames() {
  return dispatch =>
    dispatch(getData('/api/admin/games')).exec(component)
      .then((games) => {
        dispatch({ type: ADD_ALL_GAMES, games });
        return games;
      });
}

export function newCharacter(values) {
  return dispatch =>
    dispatch(formSubmit(route, { method: 'POST', body: values }));
}

export function editCharacter(id, values) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'PATCH', body: values }));
}

const defaultState = Immutable({
  mode: '',
  open: false,
  allGames: [],
  editCharId: '',
  editCharData: {},
  charsFromSelectedGame: [],
  initialOrder: 0,
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

    case SET_CHAR_ID: {
      return Immutable.merge(state, { editCharId: action.id });
    }

    case SET_CHAR: {
      return Immutable.merge(state, { editCharData: action.char });
    }

    case SET_INITIAL_ORDER: {
      return Immutable.merge(state, { initialOrder: action.order });
    }

    case ADD_ALL_GAMES:
      return Immutable.merge(state, { allGames: action.games });

    case ADD_CHARS_FROM_GAME: {
      return Immutable.merge(state, { charsFromSelectedGame: action.chars });
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
