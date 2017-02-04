import Immutable from 'seamless-immutable';
import { browserHistory } from 'react-router';
import { stringify } from 'qs';
import { gameEntity } from '../../schemas/adminSchemas';

import { generateComponent } from '../../ducks/domain';
import fetchAndSave, { formSubmit, jsonSubmit } from '../../actions/fetchAndSave';

const componentName = 'GamesTable';
const NEW_GAME_MODAL_OPEN = `${componentName}/NEW_GAME_MODAL_OPEN`;
const NEW_GAME_MODAL_CLOSE = `${componentName}/NEW_GAME_MODAL_CLOSE`;
const EDIT_GAME_MODAL_OPEN = `${componentName}/EDIT_GAME_MODAL_OPEN`;
const EDIT_GAME_MODAL_CLOSE = `${componentName}/EDIT_GAME_MODAL_CLOSE`;

const component = generateComponent(componentName);
const route = '/api/admin/games';

export function newGameModalOpen() {
  return { type: NEW_GAME_MODAL_OPEN };
}

export function newGameModalClose() {
  return { type: NEW_GAME_MODAL_CLOSE };
}

export function editGameModalOpen(initValues) {
  return { type: EDIT_GAME_MODAL_OPEN, initValues };
}

export function editGameModalClose() {
  return { type: EDIT_GAME_MODAL_CLOSE };
}

export function updateQueryString() {
  return (dispatch) => {
    const query = dispatch(component.getState()).query;
    const { pathname } = browserHistory.getCurrentLocation();
    browserHistory.push(`${pathname}?${stringify(query)}`);
  };
}

export function fetchGames() {
  return (dispatch) => {
    const query = dispatch(component.getState()).query;
    dispatch(fetchAndSave(`${route}?${stringify(query)}`, [gameEntity], component));
  };
}

export function newGame(values) {
  return dispatch =>
    dispatch(formSubmit(route, { method: 'POST', body: values }));
}

export function editGame(id, values) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'PATCH', body: values }));
}

export function deleteGame(id) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'DELETE' }));
}

export function changeOrder(id, order) {
  return dispatch =>
    dispatch(jsonSubmit(`${route}/${id}`, 'PATCH', { order }));
}

const defaultState = Immutable({
  newGameModalVisible: false,
  editGameModalVisible: false,
  editFormInitValues: {},
  query: {
    sort: 'order',
  },
});

function reducer(state = null, action) {
  switch (action.type) {
    case NEW_GAME_MODAL_OPEN: {
      return Immutable.merge(state, { newGameModalVisible: true });
    }

    case NEW_GAME_MODAL_CLOSE: {
      return Immutable.merge(state, { newGameModalVisible: false });
    }

    case EDIT_GAME_MODAL_OPEN: {
      return Immutable.merge(state, { editGameModalVisible: true, editFormInitValues: action.initValues });
    }

    case EDIT_GAME_MODAL_CLOSE: {
      return Immutable.merge(state, { editGameModalVisible: false, editFormInitValues: {} });
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
