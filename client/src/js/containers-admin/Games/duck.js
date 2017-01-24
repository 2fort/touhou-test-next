import { SubmissionError } from 'redux-form';
import Immutable from 'seamless-immutable';
import { gameEntity } from '../../schemas/adminSchemas';
import request from '../../api';

import { generateComponent } from '../../ducks/domain';
import * as flashMessageActions from '../../ducks/flashMessage';
import fetchAndSave from '../../actions/fetchAndSave';

const componentName = 'GamesTable';
const NEW_GAME_MODAL_OPEN = `${componentName}/NEW_GAME_MODAL_OPEN`;
const NEW_GAME_MODAL_CLOSE = `${componentName}/NEW_GAME_MODAL_CLOSE`;
const EDIT_GAME_MODAL_OPEN = `${componentName}/EDIT_GAME_MODAL_OPEN`;
const EDIT_GAME_MODAL_CLOSE = `${componentName}/EDIT_GAME_MODAL_CLOSE`;

const component = generateComponent(componentName);

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

export function fetchAllGames() {
  return dispatch =>
    dispatch(fetchAndSave('/api/admin/games', [gameEntity], component));
}

export function editGame(values) {
  return dispatch =>
    request('/api/admin/games/edit', {
      method: 'post',
      body: values,
    })
    .then((response) => {
      dispatch(flashMessageActions.add(response.status, 'Game successfully updated.', 0));
    })
    .catch((err) => {
      throw new SubmissionError({ _error: err.message });
    });
}

export function newGame(values) {
  return dispatch =>
    request('/api/admin/games/new', {
      method: 'post',
      body: values,
    })
    .then((response) => {
      dispatch(flashMessageActions.add(response.status, 'Game successfully created.', 0));
    })
    .catch((err) => {
      throw new SubmissionError({ _error: err.message });
    });
}

export function deleteGame(game) {
  return dispatch =>
    request('/api/admin/games/del', {
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
  newGameModalVisible: false,
  editGameModalVisible: false,
  editFormInitValues: {},
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
