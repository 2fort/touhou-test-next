import Immutable from 'seamless-immutable';
import { stringify } from 'qs';
import { initialize } from 'redux-form';

import { gameEntity } from '../../schemas/adminSchemas';
import { generateComponent } from '../../ducks/domain';
import fetchAndSave, { fetchAndReturnJson, formSubmit, jsonSubmit } from '../../actions/fetchAndSave';

const componentName = 'GamesTable';
const NEW_GAME_MODAL_OPEN = `${componentName}/NEW_GAME_MODAL_OPEN`;
const NEW_GAME_MODAL_CLOSE = `${componentName}/NEW_GAME_MODAL_CLOSE`;
const EDIT_GAME_MODAL_OPEN = `${componentName}/EDIT_GAME_MODAL_OPEN`;
const EDIT_GAME_MODAL_CLOSE = `${componentName}/EDIT_GAME_MODAL_CLOSE`;

const component = generateComponent(componentName);
const route = '/api/admin/games';

export function fetchSingleGame(id) {
  return dispatch =>
     dispatch(fetchAndReturnJson(`${route}/${id}`, component));
}

export function newGameModalOpen() {
  return { type: NEW_GAME_MODAL_OPEN };
}

export function newGameModalClose() {
  return { type: NEW_GAME_MODAL_CLOSE };
}

export function editGameModalOpen(game) {
  return (dispatch) => {
    dispatch(initialize('GameFormModal', game));
    dispatch({ type: EDIT_GAME_MODAL_OPEN });
  };
}

export function editGameModalClose() {
  return { type: EDIT_GAME_MODAL_CLOSE };
}

export function fetchGames() {
  return (dispatch) => {
    const query = dispatch(component.getState()).query;
    return dispatch(fetchAndSave(`${route}?${stringify(query)}`, [gameEntity], component));
  };
}

export function getMaxOrder() {
  return dispatch =>
    dispatch(fetchAndReturnJson(`${route}?action=maxorder`, component));
}

export function newGame(values) {
  return dispatch =>
    dispatch(formSubmit(route, { method: 'POST', body: values }));
}

export function editGame(id, values) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'PUT', body: values }));
}

export function deleteGame(id) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'DELETE' }));
}

export function changeOrder(id, order) {
  return dispatch =>
    dispatch(jsonSubmit(`${route}/${id}?action=swaporder`, 'PATCH', { order }));
}

const defaultState = Immutable({
  newGameModalVisible: false,
  editGameModalVisible: false,
  filterModalVisible: false,
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
      return Immutable.merge(state, { editGameModalVisible: true });
    }

    case EDIT_GAME_MODAL_CLOSE: {
      return Immutable.merge(state, { editGameModalVisible: false });
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
