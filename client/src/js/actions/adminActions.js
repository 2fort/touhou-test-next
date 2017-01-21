import { normalize } from 'normalizr';
import { SubmissionError } from 'redux-form';
import { browserHistory } from 'react-router';

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

    request('/api/admin/games')
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

export function fetchOneGame(gameId, component) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_BEGIN,
      component,
    });

    request(`/api/admin/games/edit/${gameId}`)
      .then((game) => {
        const data = normalize(game.json, gameEntity);
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

export function editGame(gameId, values, component) {
  const formData = new FormData();

  formData.append('prefix', values.prefix || '');
  formData.append('title', values.title);
  formData.append('year', values.year || null);

  formData.append('cover', values.cover || '');

  if (values.newcover && values.newcover[0]) {
    formData.append('newcover', values.newcover[0], values.newcover[0].name);
  }

  return dispatch =>
    request(`/api/admin/games/edit/${gameId}`, {
      method: 'post',
      body: formData,
    })
    .then((updatedGame) => {
      dispatch({
        type: types.SUBMIT_SUCCESS,
        status: updatedGame.status,
        message: 'Game successfully updated.',
      });

      const data = normalize(updatedGame.json, gameEntity);

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
        type: types.SUBMIT_FAIL,
        err,
      });
      throw new SubmissionError();
    });
}

export function newGame(values) {
  const formData = new FormData();

  formData.append('prefix', values.prefix || '');
  formData.append('title', values.title);
  formData.append('year', values.year || null);

  if (values.cover && values.cover[0]) {
    formData.append('cover', values.cover[0], values.cover[0].name);
  }

  return dispatch =>
    request('/api/admin/games/new', {
      method: 'post',
      body: formData,
    })
    .then((response) => {
      browserHistory.push('/admin/games');
      dispatch({
        type: types.SUBMIT_SUCCESS,
        status: response.status,
        message: 'Game successfully created.',
      });
    })
    .catch((err) => {
      dispatch({
        type: types.SUBMIT_FAIL,
        err,
      });
      throw new SubmissionError(); // submitFailed: true;
    });
}

export function deleteGame(game, component) {
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
        type: types.FETCH_MODIFY,
        id: game.id,
        component,
      });

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
