import Immutable from 'seamless-immutable';
import { stringify } from 'qs';
import { browserHistory } from 'react-router';

import { charactersEntity } from '../../schemas/adminSchemas';
import { generateComponent } from '../../ducks/domain';
import fetchAndSave, { fetchAndReturnJson, formSubmit } from '../../actions/fetchAndSave';

const componentName = 'CharactersTable';
const NEW_CHAR_MODAL_OPEN = `${componentName}/NEW_CHAR_MODAL_OPEN`;
const NEW_CHAR_MODAL_CLOSE = `${componentName}/NEW_CHAR_MODAL_CLOSE`;
const EDIT_CHAR_MODAL_OPEN = `${componentName}/EDIT_CHAR_MODAL_OPEN`;
const EDIT_CHAR_MODAL_CLOSE = `${componentName}/EDIT_CHAR_MODAL_CLOSE`;
const CHANGE_CURRENT_GAME = `${componentName}/CHANGE_CURRENT_GAME`;
const ADD_ALL_GAMES = `${componentName}/ADD_ALL_GAMES`;
const CHAR_FILTER_MODAL_OPEN = `${componentName}/CHAR_FILTER_MODAL_OPEN`;
const CHAR_FILTER_MODAL_CLOSE = `${componentName}/CHAR_FILTER_MODAL_CLOSE`;

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

export function charFilterModalOpen() {
  return { type: CHAR_FILTER_MODAL_OPEN };
}

export function charFilterModalClose() {
  return { type: CHAR_FILTER_MODAL_CLOSE };
}

export function changeCurrentGame(e) {
  return { type: CHANGE_CURRENT_GAME, gameId: e.target.value };
}

export function updateQueryString() {
  return (dispatch) => {
    const { currentGame, query } = dispatch(component.getState());
    const { pathname } = browserHistory.getCurrentLocation();

    const _game = (currentGame) ? { _game: currentGame } : undefined;

    browserHistory.replace(`${pathname}?${stringify({ ...query, ..._game }, { encode: false })}`);
  };
}

export function fetchCharacters() {
  return (dispatch) => {
    const { currentGame, query } = dispatch(component.getState());

    const gameRoute = (game) => {
      if (game === '') return '';
      if (game === '[!uncategorized]') return '_game=';
      return `_game=${game}`;
    };

    return dispatch(fetchAndSave(`${route}?${gameRoute(currentGame)}&${stringify(query)}`, [charactersEntity], component));
  };
}

export function getCharWithMaxOrder(gameId) {
  return dispatch =>
    dispatch(fetchAndReturnJson(`${route}?_game=${gameId}&sort=-_order&limit=1`, component));
}

export function fetchAllGames() {
  return dispatch =>
    dispatch(fetchAndReturnJson('/api/admin/games', component))
      .then((games) => {
        dispatch({ type: ADD_ALL_GAMES, games });
        return true;
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

export function deleteCharacter(id) {
  return dispatch =>
    dispatch(formSubmit(`${route}/${id}`, { method: 'DELETE' }));
}

const defaultState = Immutable({
  newCharModalVisible: false,
  editCharModalVisible: false,
  editFormInitValues: {},
  filterModalVisible: false,
  query: {
    sort: '_id',
  },
  currentGame: '',
  allGames: [],
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

    case CHAR_FILTER_MODAL_OPEN: {
      return Immutable.merge(state, { filterModalVisible: true });
    }

    case CHAR_FILTER_MODAL_CLOSE: {
      return Immutable.merge(state, { filterModalVisible: false });
    }

    case CHANGE_CURRENT_GAME:
      return Immutable.merge(state, { currentGame: action.gameId });

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
