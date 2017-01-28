import Immutable from 'seamless-immutable';
import { gameEntity, charactersEntity } from '../../schemas/adminSchemas';

import { generateComponent } from '../../ducks/domain';
import fetchAndSave, { formSubmit } from '../../actions/fetchAndSave';

const componentName = 'CharactersTable';
const NEW_CHAR_MODAL_OPEN = `${componentName}/NEW_CHAR_MODAL_OPEN`;
const NEW_CHAR_MODAL_CLOSE = `${componentName}/NEW_CHAR_MODAL_CLOSE`;
const EDIT_CHAR_MODAL_OPEN = `${componentName}/EDIT_CHAR_MODAL_OPEN`;
const EDIT_CHAR_MODAL_CLOSE = `${componentName}/EDIT_CHAR_MODAL_CLOSE`;

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

export function fetchAllCharacters() {
  return dispatch =>
    dispatch(fetchAndSave('/api/admin/characters', [charactersEntity], component));
}

export function fetchAllGames() {
  return dispatch =>
    dispatch(fetchAndSave('/api/admin/games', [gameEntity], component, false));
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

    default: {
      return state;
    }
  }
}

export default {
  defaultState,
  reducer,
};
