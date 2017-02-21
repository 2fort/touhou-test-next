import Immutable from 'seamless-immutable';
import { stringify } from 'qs';
import { browserHistory } from 'react-router';

import { charactersEntity, gameEntity } from '../../schemas/adminSchemas';
import { generateComponent } from '../../ducks/domain';
import fetchAndSave, { fetchAndReturnJson, formSubmit, jsonSubmit } from '../../actions/fetchAndSave';

const componentName = 'CharactersTable';
const NEW_CHAR_MODAL_OPEN = `${componentName}/NEW_CHAR_MODAL_OPEN`;
const NEW_CHAR_MODAL_CLOSE = `${componentName}/NEW_CHAR_MODAL_CLOSE`;
const EDIT_CHAR_MODAL_OPEN = `${componentName}/EDIT_CHAR_MODAL_OPEN`;
const EDIT_CHAR_MODAL_CLOSE = `${componentName}/EDIT_CHAR_MODAL_CLOSE`;
const ADD_ALL_GAMES = `${componentName}/ADD_ALL_GAMES`;
const FILTER_PANEL_TRIGGER = `${componentName}/FILTER_PANEL_TRIGGER`;

const component = generateComponent(componentName);
const route = '/api/admin/characters';

export function newCharModalOpen() {
  return { type: NEW_CHAR_MODAL_OPEN };
}

export function newCharModalClose() {
  return { type: NEW_CHAR_MODAL_CLOSE };
}

export function editCharModalOpen(initValues) {
  return { type: EDIT_CHAR_MODAL_OPEN, initValues };
}

export function editCharModalClose() {
  return { type: EDIT_CHAR_MODAL_CLOSE };
}

export function charFilterPanelTrigger() {
  return { type: FILTER_PANEL_TRIGGER };
}

export function updateQueryString() {
  return (dispatch) => {
    const query = dispatch(component.getState()).query;
    const { pathname } = browserHistory.getCurrentLocation();
    browserHistory.replace(`${pathname}?${stringify(query, { encode: false })}`);
  };
}

export function fetchCharacters() {
  return (dispatch) => {
    const query = dispatch(component.getState()).query;
    return dispatch(fetchAndSave(`${route}?${stringify(query)}`, [charactersEntity], component));
  };
}

export function getCharsFromGame(gameId) {
  return dispatch =>
    dispatch(fetchAndReturnJson(`${route}?filter[_game]=${gameId}&sort=_order`, component));
}

export function fetchAllGames() {
  return dispatch =>
    dispatch(fetchAndReturnJson('/api/admin/games', component, [gameEntity]))
      .then((games) => {
        dispatch({ type: ADD_ALL_GAMES, ...games });
        return true;
      });
}

export function changeOrder(id, _order) {
  return dispatch =>
    dispatch(jsonSubmit(`${route}/${id}`, 'PATCH', { _order }));
}

export function newCharacter(values) {
  return dispatch =>
    dispatch(formSubmit(route, { method: 'POST', body: values }));
}

export function editCharacter(id, values) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'PATCH', body: values }));
}

export function deleteCharacter(id) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'DELETE' }));
}

const defaultState = Immutable({
  newCharModalVisible: false,
  editCharModalVisible: false,
  editFormInitValues: {},
  filterPanelOpen: false,
  query: {
    sort: 'name',
  },
  allGames: {},
});

function reducer(state = null, action) {
  switch (action.type) {
    case NEW_CHAR_MODAL_OPEN: {
      return Immutable.merge(state, { newCharModalVisible: true });
    }

    case NEW_CHAR_MODAL_CLOSE: {
      return Immutable.merge(state, { newCharModalVisible: false });
    }

    case EDIT_CHAR_MODAL_OPEN: {
      return Immutable.merge(state, { editCharModalVisible: true, editFormInitValues: action.initValues });
    }

    case EDIT_CHAR_MODAL_CLOSE: {
      return Immutable.merge(state, { editCharModalVisible: false, editFormInitValues: {} });
    }

    case FILTER_PANEL_TRIGGER: {
      return Immutable.merge(state, { filterPanelOpen: !state.filterPanelOpen });
    }

    case ADD_ALL_GAMES:
      return Immutable.merge(state, { allGames: action.games });

    default: {
      return state;
    }
  }
}

export default {
  defaultState,
  reducer,
};
