import { normalize } from 'normalizr';
import { SubmissionError } from 'redux-form';

import { charactersEntity, characterEntityOnly, gameEntity } from '../schemas/adminSchemas';
import * as types from '../constants/ActionTypes';
import request from '../actions/api';

export function flushMsg() {
  return {
    type: types.FLUSH_MSG,
  };
}

export function fetchAllGames(component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    return request('/api/admin/games')
      .then((games) => {
        const data = normalize(games.json, [gameEntity]);
        dispatch({
          type: types.FETCH_SUCCESS,
          component,
          entities: data.entities,
          visible: data.result,
          fetchedAt: Date.now(),
        });
      })
      .catch((err) => {
        dispatch({
          type: types.FETCH_FAIL,
          component,
          err,
        });
      });
  };
}

export function fetchAllCharacters(component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    request('/api/admin/characters')
      .then((characters) => {
        const data = normalize(characters.json, [charactersEntity]);
        dispatch({
          type: types.FETCH_SUCCESS,
          component,
          entities: data.entities,
          visible: data.result,
          fetchedAt: Date.now(),
        });
      })
      .catch((err) => {
        dispatch({
          type: types.FETCH_FAIL,
          component,
          err,
        });
      });
  };
}

export function fetchOneCharacter(characterId, component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    request('/api/admin/games')
      .then((games) => {
        const data = normalize(games.json, [gameEntity]);
        dispatch({
          type: types.FETCH_SUCCESS,
          entities: data.entities,
        });
        return request(`/api/admin/characters/edit/${characterId}`);
      })
      .then((characters) => {
        const data = normalize(characters.json, characterEntityOnly);
        dispatch({
          type: types.FETCH_SUCCESS,
          component,
          entities: data.entities,
          visible: data.result,
          fetchedAt: Date.now(),
        });
      })
      .catch((err) => {
        dispatch({
          type: types.FETCH_FAIL,
          component,
          err,
        });
      });
  };
}

export function editGame(values) {
  return dispatch =>
    request('/api/admin/games/edit', {
      method: 'post',
      body: values,
    })
    .then((response) => {
      dispatch({
        type: types.SUBMIT_SUCCESS,
        status: response.status,
        message: 'Game successfully updated.',
      });
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
      dispatch({
        type: types.SUBMIT_SUCCESS,
        status: response.status,
        message: 'Game successfully created.',
      });
    })
    .catch((err) => {
      throw new SubmissionError({ _error: err.message }); // submitFailed: true;
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
      dispatch({
        type: types.SUBMIT_SUCCESS,
        status: response.status,
        message: 'Game successfully deleted',
      });
    })
    .catch((err) => {
      dispatch({
        type: types.SUBMIT_FAIL,
        err,
      });
    });
}
