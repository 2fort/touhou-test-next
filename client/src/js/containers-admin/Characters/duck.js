import Immutable from 'seamless-immutable';
import { stringify } from 'qs';
import { initialize } from 'redux-form';

import { charactersEntity, gameEntity } from '../../schemas/adminSchemas';
import { generateComponent } from '../../ducks/domain';
import { getData, formSubmit, jsonSubmit } from '../../actions/fetchAndSave';

const componentName = 'CharactersTable';
const NEW_CHAR_MODAL_OPEN = `${componentName}/NEW_CHAR_MODAL_OPEN`;
const NEW_CHAR_MODAL_CLOSE = `${componentName}/NEW_CHAR_MODAL_CLOSE`;
const EDIT_CHAR_MODAL_OPEN = `${componentName}/EDIT_CHAR_MODAL_OPEN`;
const EDIT_CHAR_MODAL_CLOSE = `${componentName}/EDIT_CHAR_MODAL_CLOSE`;
const ADD_ALL_GAMES = `${componentName}/ADD_ALL_GAMES`;

const component = generateComponent(componentName);
const route = '/api/admin/characters';

export function fetchSingleCharacter(id) {
  return dispatch =>
     dispatch(getData(`${route}/${id}`)).exec(component);
}

export function newCharModalOpen(game) {
  return (dispatch) => {
    dispatch(initialize('CharFormModal', { link: { rel: game } }));
    dispatch({ type: NEW_CHAR_MODAL_OPEN });
  };
}

export function newCharModalClose() {
  return { type: NEW_CHAR_MODAL_CLOSE };
}

export function editCharModalOpen(char) {
  return (dispatch) => {
    dispatch(initialize('CharFormModal', char));
    dispatch({ type: EDIT_CHAR_MODAL_OPEN });
  };
}

export function editCharModalClose() {
  return { type: EDIT_CHAR_MODAL_CLOSE };
}

export function fetchCharacters() {
  return (dispatch) => {
    const query = dispatch(component.getState()).query;
    return dispatch(getData(`${route}?${stringify(query)}`)).normalize([charactersEntity]).save().exec(component);
  };
}

export function getCharsFromGame(gameId) {
  return dispatch =>
    dispatch(getData(`${route}?filter[link][rel]=${gameId}&sort=link.rel`)).exec(component);
}

export function fetchAllGames() {
  return dispatch =>
    dispatch(getData('/api/admin/games')).normalize([gameEntity]).asObject().exec(component)
      .then(({ games }) => {
        dispatch({ type: ADD_ALL_GAMES, games });
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
      return Immutable.merge(state, { editCharModalVisible: true });
    }

    case EDIT_CHAR_MODAL_CLOSE: {
      return Immutable.merge(state, { editCharModalVisible: false });
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
