import { SubmissionError } from 'redux-form';
import Immutable from 'seamless-immutable';
import { gameEntity, charactersEntity } from '../../schemas/adminSchemas';
import request from '../../api';

import { generateComponent } from '../../ducks/domain';
import * as flashMessageActions from '../../ducks/flashMessage';
import fetchAndSave from '../../actions/fetchAndSave';

const componentName = 'CharactersTable';
const NEW_CHAR_MODAL_OPEN = `${componentName}/NEW_CHAR_MODAL_OPEN`;
const NEW_CHAR_MODAL_CLOSE = `${componentName}/NEW_CHAR_MODAL_CLOSE`;
const EDIT_CHAR_MODAL_OPEN = `${componentName}/EDIT_CHAR_MODAL_OPEN`;
const EDIT_CHAR_MODAL_CLOSE = `${componentName}/EDIT_CHAR_MODAL_CLOSE`;

const component = generateComponent(componentName);

export function fetchAllCharacters() {
  return dispatch =>
    dispatch(fetchAndSave('/api/admin/characters', [charactersEntity], component));
}

export function fetchAllGames() {
  return dispatch =>
    dispatch(fetchAndSave('/api/admin/games', [gameEntity], component));
}

export function newCharacter(values) {
  return dispatch =>
    request('/api/admin/characters/new', {
      method: 'post',
      body: values,
    })
    .then((response) => {
      dispatch(flashMessageActions.add(response.status, 'Character successfully created.', 0));
    })
    .catch((err) => {
      throw new SubmissionError({ _error: err.message });
    });
}

export function editCharacter(values) {
  return dispatch =>
    request('/api/admin/characters/edit', {
      method: 'post',
      body: values,
    })
    .then((response) => {
      dispatch(flashMessageActions.add(response.status, 'Character successfully updated.', 0));
    })
    .catch((err) => {
      throw new SubmissionError({ _error: err.message });
    });
}

export function deleteCharacter(game) {
  return dispatch =>
    request('/api/admin/characters/del', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(game),
    })
    .then((response) => {
      dispatch(flashMessageActions.add(response.status, 'Game successfully deleted', 0));
    })
    .catch((err) => {
      dispatch(flashMessageActions.add(err.status, err.message, 3));
    });
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
